import json

from django.apps import apps
from django.contrib.auth.models import User
from django.db import IntegrityError, transaction
from django.db.models import Q
from django_filters import rest_framework as filters
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import (HTTP_400_BAD_REQUEST)
from rest_framework_tracking.mixins import LoggingMixin

from lsdb.models import AzureFile
from lsdb.models import Disposition
from lsdb.models import DispositionCode
from lsdb.models import Label
from lsdb.models import Note
from lsdb.models import NoteReadStatus
from lsdb.models import NoteType
from lsdb.models import ProcedureResult
from lsdb.models import Unit
from lsdb.permissions import ConfiguredPermission
from lsdb.serializers import DispositionCodeListSerializer
from lsdb.serializers import NoteSerializer
from lsdb.utils.NoteUtils import get_note_link
from lsdb.utils.Notification import Notification


class NoteFilter(filters.FilterSet):
    class Meta:
        model = Note
        fields = [
            'note_type__groups__name',
        ]


class NoteViewSet(LoggingMixin, viewsets.ModelViewSet):
    """
    API endpoint that allows Notes to be viewed or edited.
    """
    logging_methods = ['POST', 'PUT', 'PATCH', 'DELETE']
    queryset = Note.objects.all()
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = NoteFilter
    serializer_class = NoteSerializer
    permission_classes = [ConfiguredPermission]

    @action(detail=False, methods=['get', ],
            serializer_class=DispositionCodeListSerializer,
            )
    def dispositions(self, request, pk=None):
        self.context = {'request': request}
        serializer = DispositionCodeListSerializer(DispositionCode.objects.get(
            name='notes'),
            many=False,
            context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def flags(self, request):
        flags = Note.objects.filter(note_type__name='Flag').distinct()
        flags = flags.exclude(disposition__complete=True)
        serializer = self.get_serializer(flags, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def support_tickets(self, request):
        support_tickets = Note.objects.filter(note_type__name='Support Ticket').distinct()
        support_tickets = support_tickets.exclude(disposition__complete=True)
        serializer = self.get_serializer(support_tickets, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def tasks(self, request):
        support_tickets = Note.objects.filter(note_type__name='Task').distinct()
        support_tickets = support_tickets.exclude(disposition__complete=True)
        serializer = self.get_serializer(support_tickets, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def closed_flags(self, request):
        flags = Note.objects.filter(note_type__name='Flag', disposition__complete=True).distinct()
        serializer = self.get_serializer(flags, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def closed_support_tickets(self, request):
        support_tickets = Note.objects.filter(note_type__name='Support Ticket', disposition__complete=True).distinct()
        serializer = self.get_serializer(support_tickets, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def closed_tasks(self, request):
        support_tickets = Note.objects.filter(note_type__name='Task', disposition__complete=True).distinct()
        serializer = self.get_serializer(support_tickets, many=True)
        return Response(serializer.data)

    @transaction.atomic
    @action(detail=True, methods=['get', 'post'])
    def bulk_update(self, request, pk=None):
        """
        This takes a collection of changes to apply and applies them and creates system notes for each change.
        POST:
        {
            "tagged_users":[
                $ID1,...$IDn
            ],
            "disposition":$ID,
            "labels":[
                $ID1,...$IDn
            ],
            "owner":$ID,
            "note_type":$ID,
            "comment": {
                "text" : "string",
                "subject" : "string",
                "note_type" : $ID,
                "parent_note" : $ID
            }
        }
        """
        self.context = {'request': request}
        self.obj = Note.objects.get(id=pk)
        if request.method == "POST":
            systemlog = NoteType.objects.get(name='SystemLog')
            params = json.loads(request.body)
            if params.get('comment'):
                params["comment"]["user"] = request.user
            # Handle empty disposition case:
            try:
                disposition_id = self.obj.disposition.id
            except:
                disposition_id = 0
            # Handle empty owner case:
            try:
                owner_id = self.obj.owner.id
            except:
                owner_id = 0
            # preserve tagged users:
            self.current_tag = []
            self.blobs_old = []
            for user_id in self.obj.tagged_users.all().order_by('id'):
                self.current_tag.append(int(user_id.id))
                self.blobs_old.append('"{}"'.format(user_id.username))

            # This logic could better handle null cases:
            if ((disposition_id != params.get("disposition", 0)) or (owner_id != params.get("owner", 0))):
                if (params.get('comment') and len(params["comment"]["text"]) <= 5):
                    return Response({'error': 'A comment is requried for this action.'},
                                    status=HTTP_400_BAD_REQUEST)

            response = {'subject': '', 'read_datetime': ''}
            notify = False
            ticket_activity = []
            while params:
                # Should wrap some exception handling around this
                command = params.popitem()
                message = None
                activity = False
                # print("0{} 1{}".format(command[0],command[1]))
                if not command[1] == None:
                    message, activity = getattr(self, '_{}'.format(command[0]))(command[1])
                if message:
                    # print('sending message: {}'.format(message))
                    system_note = Note.objects.create(
                        user=request.user,
                        subject='system note',
                        text=message,
                        note_type=systemlog,
                        parent_note=self.obj
                    )
                    NoteReadStatus.objects.create(
                        user=request.user,
                        note=system_note
                    )
                    print('message:',message)
                    ticket_activity.append(message)
                if activity: notify = True  # could also append all the system notes here to send in th email.
            # email the owner and the tagged users of notable activity
            if notify:
                # All activity gets sent to everyone, Owners get the activity attached
                # to the "assigned_owner" mail
                if (owner_id !=0
                    and self.obj.owner.id != owner_id
                    and self.obj.owner != request.user
                    ): # Owner is set and has changed.
                    email_notify = Notification()
                    email_notify.throttled_email(
                        template='assigned_owner',
                        user=self.obj.owner,
                        ticket_id=self.obj.id,
                        ticket_link=get_note_link(self.obj),
                        ticket_activity = ticket_activity,
                        ticket_subject = self.obj.subject,
                        ticket_body = self.obj.text,
                    )
                    # assigned owner template
                elif (self.obj.owner != request.user) and (self.obj.owner):
                    email_notify = Notification()
                    email_notify.throttled_email(
                        template='ticket_activity',
                        user=self.obj.owner,
                        ticket_id=self.obj.id,
                        ticket_link=get_note_link(self.obj),
                        ticket_activity = ticket_activity,
                        ticket_subject = self.obj.subject,
                        ticket_body = self.obj.text,
                    )
                for user in self.obj.tagged_users.all():
                    if user not in self.current_tag and user != request.user:
                        # send them notifications
                        email_notify = Notification()
                        email_notify.throttled_email(
                            template='tagged_user',
                            user=user,
                            ticket_id=self.obj.id,
                            ticket_link=get_note_link(self.obj),
                            ticket_activity=ticket_activity,
                            ticket_subject = self.obj.subject,
                            ticket_body = self.obj.text,
                        )
                    elif user != request.user:
                        email_notify = Notification()
                        email_notify.throttled_email(
                            template='ticket_activity',
                            user=user,
                            ticket_id=self.obj.id,
                            ticket_link=get_note_link(self.obj),
                            ticket_activity=ticket_activity,
                            ticket_subject = self.obj.subject,
                            ticket_body = self.obj.text,
                        )
        # we have probably updated the object, but this will work:
        return Response(self.serializer_class(self.obj, many=False, context=self.context).data)

    def _note_type(self, type):
        new_type = NoteType.objects.get(id=type)
        old_type = self.obj.note_type.name
        if self.obj.note_type != new_type:
            self.obj.note_type = new_type
            self.obj.save()
            return 'Note Type set to "{}" from "{}"'.format(new_type.name, old_type), True
        else:
            return None, False

    def _tagged_users(self, users):
        # Only message if there's a change:
        users.sort()
        if self.current_tag == users:
            return None, False
        else:
            blobs_old = []
            for tagged_user in self.obj.tagged_users.all():
                blobs_old.append('"{}"'.format(tagged_user.username))
            self.obj.tagged_users.set(users)
            blobs_new = []
            message = "Tagged users set to "
            for user in self.obj.tagged_users.all():
                blobs_new.append('"{}"'.format(user.username))
            return message + ','.join(blobs_new) + " from " + ','.join(blobs_old), False

    def _disposition(self, disposition):
        new_disposition = Disposition.objects.get(id=disposition)
        old_disposition = self.obj.disposition.name
        if self.obj.disposition != new_disposition:
            self.obj.disposition = new_disposition
            self.obj.save()
            return 'Disposition set to "{}" from "{}"'.format(new_disposition.name, old_disposition), True
        else:
            return None, False

    def _labels(self, labels):
        # Only message if there's a change:
        labels.sort()
        current_tag = []
        blobs_old = []
        for label_id in self.obj.labels.all().order_by('id'):
            current_tag.append(int(label_id.id))
            blobs_old.append('"{}"'.format(label_id.name))
        # There's still a bug here:
        if current_tag == labels:
            # print('not setting')
            return None, False
        else:
            self.obj.labels.set(labels)
            blobs_new = []
            message = "Labels set to "
            for label in self.obj.labels.all():
                blobs_new.append('"{}"'.format(label.name))
            return message + ','.join(blobs_new) + " from " + ','.join(blobs_old), False
        return None, False

    def _owner(self, owner):
        # print('called _owner')
        new_owner = User.objects.get(id=owner)
        if self.obj.owner:
            old_owner = self.obj.owner.username
        else:
            old_owner = 'None'
        if self.obj.owner != new_owner:
            self.obj.owner = new_owner
            self.obj.save()
            # New assigned owner, send an email:
            # if new_owner != self.context['request'].user:
            #     email_notify = Notification()
            #     email_notify.throttled_email(
            #         template='assigned_owner',
            #         user=new_owner,
            #         ticket_id=self.obj.id,
            #         ticket_link=get_note_link(self.obj)
            #     )
            return 'Owner set to "{}" from "{}"'.format(new_owner.username, old_owner), True
        else:
            return None, False

    def _comment(self, comment):
        print('called _comment')
        commentType = NoteType.objects.get(id=comment["note_type"])
        parent = Note.objects.get(id=comment["parent_note"])
        Note.objects.create(
            user=comment["user"],
            subject=comment["subject"],
            text=comment["text"],
            note_type=commentType,
            parent_note=parent
        )
        return comment["text"], True

    @action(detail=True, methods=['get'])
    def email_note(self, request, pk=None):
        note = Note.objects.get(id=pk)
        self.context = {'request': request}
        email_notify = Notification()
        email_notify.throttled_email(
            template='ticket_activity',
            user=request.user,
            ticket_id=note.id,
            ticket_link=get_note_link(note)
        )

        return Response(NoteSerializer(note, many=False, context=self.context).data)

    @action(detail=True, methods=['get', 'post'])
    def mark_read(self, request, pk=None):
        """
        This will mark the current note and ALL children of the note as read.
        POST any response to this detail action to mark note and children as read.
        """
        self.context = {'request': request}
        if request.method == "POST":
            response = {'subject': '', 'read_datetime': ''}
            notes = Note.objects.filter(Q(id=pk) | Q(parent_note__id=pk))
            for note in notes:
                # print(type(pk), note.subject, type(note.id), (int(note.pk) == int(pk)))
                try:
                    read_flag = NoteReadStatus.objects.create(
                        user=request.user,
                        note=note
                    )
                except IntegrityError:
                    # this note is already read
                    read_flag = NoteReadStatus.objects.get(
                        user=request.user,
                        note=note
                    )
                    pass  # ?
                if str(note.pk) == str(pk):
                    response['subject'] = note.subject
                response['read_datetime'] = read_flag.read_datetime
            return Response(response)
        else:  # GET
            return Response([])

    @transaction.atomic
    @action(detail=True, methods=['get', 'post'],
            serializer_class=NoteSerializer,
            )
    def link_files(self, request, pk=None):
        """
        This action will link an existing AzureFile to this measurement_result.
        POST: {"id":1} to link azurfefile id=1 to this measurement_result
        """
        self.context = {'request': request}
        queryset = Note.objects.get(id=pk)
        if request.method == 'POST':
            params = request.data
            file_id = params.get('id')
            if file_id:
                attachment = AzureFile.objects.get(id=int(file_id))
                note = Note.objects.get(id=pk)
                queryset.attachments.add(attachment)
                queryset.save()

                system_note = Note.objects.create(
                    user = request.user,
                    subject = 'system note',
                    text = "File {} added.".format(attachment.name),
                    note_type = NoteType.objects.get(name='SystemLog'),
                    parent_note = note
                )
                NoteReadStatus.objects.create(
                    user = request.user,
                    note = system_note
                )
        serializer = NoteSerializer(queryset, many=False, context=self.context)
        return Response(serializer.data)

    """
    Tagged Users actions
    """

    @action(detail=True, methods=['post'])
    def add_users(self, request, pk=None):
        """
        This action is used to add tagged users to a Note
        POST : {
            "users_to_add": [$ID]
        }
        """
        self.context = {'request': request}
        note = Note.objects.get(pk=pk)
        active_users = User.objects.filter(is_active=True)
        if request.method == 'POST':
            params = json.loads(request.body)
            users_to_add = params.get('users_to_add')
            for user in users_to_add:
                for active_user in active_users:
                    if active_user.id == user:
                        note.tagged_users.add(user)
        serializer = self.serializer_class(note, many=False, context=self.context)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def remove_users(self, request, pk=None):
        """
        This action is used to add tagged users to a Note
        POST : {
            "users_to_remove": [$ID]
        }
        """
        self.context = {'request': request}
        note = Note.objects.get(pk=pk)
        if request.method == 'POST':
            params = json.loads(request.body)
            users_to_delete = params.get('users_to_remove')
            tagged_users = note.tagged_users.all()
            new_users = []
            for tagged_user in tagged_users:
                is_element_found = False
                for user in users_to_delete:
                    if tagged_user.id == user:
                        is_element_found = True
                        break
                if not is_element_found:
                    new_users.append(tagged_user.id)
            note.tagged_users.set(new_users)
        serializer = self.serializer_class(note, many=False, context=self.context)
        return Response(serializer.data)

    """
    Label actions
    """

    @action(detail=True, methods=['post'])
    def add_labels(self, request, pk=None):
        """
        This action is used to add Labels to a Note
        POST : {
            "labels": [$ID]
        }
        """
        self.context = {'request': request}
        note = Note.objects.get(pk=pk)
        labels = Label.objects.all()
        if request.method == 'POST':
            params = json.loads(request.body)
            labels_to_add = params.get('labels')
            for label in labels_to_add:
                for existing_label in labels:
                    if existing_label.id == label:
                        note.labels.add(label)
        serializer = self.serializer_class(note, many=False, context=self.context)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def remove_labels(self, request, pk=None):
        """
        This action is used to add tagged users to a Note
        POST : {
            "labels": [$ID]
        }
        """
        self.context = {'request': request}
        note = Note.objects.get(pk=pk)
        if request.method == 'POST':
            params = json.loads(request.body)
            labels_to_delete = params.get('labels')
            current_labels = note.labels.all()
            new_labels = []

            for current_label in current_labels:
                is_element_found = False
                for label in labels_to_delete:
                    if current_label.id == label:
                        is_element_found = True
                        break
                if not is_element_found:
                    new_labels.append(current_label.id)

            note.labels.set(new_labels)
        serializer = self.serializer_class(note, many=False, context=self.context)
        return Response(serializer.data)

    """
    Change Owner
    """

    @action(detail=True, methods=['post'])
    def change_owner(self, request, pk=None):
        """
        This action is used to change the Owner of a Note
        POST: {
            "owner": $ID
        }
        """
        self.context = {'request': request}
        note = Note.objects.get(pk=pk)
        active_users = User.objects.filter(is_active=True)
        if request.method == 'POST':
            params = json.loads(request.body)
            owner = params.get('owner')
            owner_user = None
            for user in active_users:
                if user.id == owner:
                    owner_user = user
            note.owner = owner_user
            note.save()
        serializer = self.serializer_class(note, many=False, context=self.context)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def change_disposition(self, request, pk=None):
        """
        This actions is used to change the disposition of a Note
        POST: {
            'disposition': $ID
        }
        """
        self.context = {'request': request}
        note = Note.objects.get(pk=pk)
        dispositions = Disposition.objects.all()
        if request.method == 'POST':
            params = json.loads(request.body)
            disp = params.get('disposition')
            new_disposition = None
            for disposition in dispositions:
                if disposition.id == disp:
                    new_disposition = disposition
            note.disposition = new_disposition
            note.save()
        serializer = self.serializer_class(note, many=False, context=self.context)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def get_children(self, request, pk=None):
        self.context = {'request': request}

        notes = Note.objects.filter(parent_note__id=pk).order_by("datetime")
        serializer = self.serializer_class(notes, many=True, context=self.context)

        return Response(serializer.data)

    @transaction.atomic
    @action(detail=False, methods=['get', 'post'],
            serializer_class=NoteSerializer,
            )
    def add_note(self, request):
        """
        This action is used to add ALL notes.
        POST:
        {
            "id": $ID
            "subject": "Unit note subject",
            "text": "Unit note text body",
            "type":$ID,
            "owner": $ID,
            "disposition": $ID,
            "model" : "model name",
            "labels": [$ID1, $ID2...],
            "groups": [$ID1, $ID2...],
            "tagged_users": [$ID1, $ID2...]
        }

        Accepted Models: Customer, Crate, Asset, Procedure, Project, Unit
        """
        self.context = {'request': request}
        if request.method == "POST":
            params = json.loads(request.body)

            model_name = params.get('model')
            target_id = params.get('id')

            # print(target_id)

            owner = None
            disposition = None

            note_type = NoteType.objects.get(id=params.get('note_type'))
            if params.get('owner') > 1:
                owner = User.objects.get(id=params.get('owner'))
            if params.get('disposition') > 1:
                disposition = Disposition.objects.get(id=params.get('disposition'))

            new_note = Note.objects.create(**{
                "user": request.user,
                "subject": params.get('subject'),
                "text": params.get('text'),
                "note_type": note_type,
                "owner": owner,
                "disposition": disposition,
            })
            new_note.labels.set(params.get('labels'))
            new_note.groups.set(params.get('groups'))
            new_note.tagged_users.set(params.get('tagged_users'))
            new_note.save()

            NoteReadStatus.objects.create(
                user=request.user,
                note=new_note
            )

            # print(model_name)

            if model_name:
                # If note is tethered, some models require extra steps
                # Procedure tethers note to parent project and unit
                if model_name == "procedure":
                    procedure_result = ProcedureResult.objects.get(pk=target_id)
                    procedure_result.notes.add(new_note)
                    procedure_result.work_order.project.notes.add(new_note)
                    procedure_result.unit.notes.add(new_note)

                # Unit tethers note to parent project
                elif model_name == "unit":
                    # print("Do we enter?")
                    unit = Unit.objects.get(pk=target_id)
                    unit.notes.add(new_note)

                    for project in unit.project_set.all():
                        project.notes.add(new_note)

                else:
                    try:
                        model = apps.get_app_config('lsdb').get_model(model_name)
                    except Exception as e:
                        return e
                    obj = model.objects.get(pk=target_id)
                    obj.notes.add(new_note)

            # Notifications on New:
            if owner != request.user and owner != None:
                email_notify = Notification()
                email_notify.throttled_email(
                    template='assigned_owner',
                    user=owner,
                    ticket_id=new_note.id,
                    ticket_link=get_note_link(new_note),
                    ticket_subject=new_note.subject,
                    ticket_body=new_note.text,
                )
            for user_id in params.get('tagged_users'):
                tagged_user = User.objects.get(id=user_id)
                if tagged_user != request.user:
                    email_notify = Notification()
                    email_notify.throttled_email(
                        template='tagged_user',
                        user=tagged_user,
                        ticket_id=new_note.id,
                        ticket_link=get_note_link(new_note),
                        ticket_subject=new_note.subject,
                        ticket_body=new_note.text,
                    )
            serializer = NoteSerializer(new_note, many=False, context=self.context)
        else:
            serializer = NoteSerializer([], many=True, context=self.context)
        return Response(serializer.data)
