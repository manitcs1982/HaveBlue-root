import json
import math
import pandas as pd
import numpy as np
from datetime import datetime, timedelta, date
from django.db import IntegrityError, transaction
from django.http import HttpResponse
from django.utils import timezone
from lsdb.utils import ExcelFile
from django.contrib.auth.models import User
from django.db.models import Q, Max
from io import BytesIO
from openpyxl.writer.excel import save_virtual_workbook
from openpyxl import Workbook


from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_tracking.mixins import LoggingMixin
from rest_framework.status import (HTTP_400_BAD_REQUEST)

from lsdb.models import Asset
from lsdb.models import Disposition, DispositionCode
from lsdb.models import Unit
from lsdb.models import Note
from lsdb.models import MeasurementResult
from lsdb.models import ProcedureResult
from lsdb.models import StepResult
from lsdb.models import StepDefinition

from lsdb.serializers import DispositionCodeListSerializer
from lsdb.serializers import NoteSerializer
from lsdb.serializers import ResultStatsSerializer
from lsdb.serializers import StepResultSerializer
from lsdb.serializers import ProcedureResultSerializer
from lsdb.serializers import ProcedureResultStressSerializer
from lsdb.serializers import ProcedureResultVerificationSerializer
from lsdb.serializers import TransformIVCurveSerializer
from lsdb.serializers import ProcedureWorkLogSerializer
from lsdb.permissions import ConfiguredPermission
from lsdb.utils import RetestUtils
# from lsdb.utils.NoteUtils import create_note


class ProcedureResultViewSet(LoggingMixin, viewsets.ModelViewSet):
    """
    API endpoint that allows ProcedureResult to be viewed or edited.
    """
    logging_methods = ['POST', 'PUT', 'PATCH', 'DELETE']
    queryset = ProcedureResult.objects.all()
    serializer_class = ProcedureResultSerializer
    permission_classes = [ConfiguredPermission]

    @action(detail=False, methods=['get',],
        serializer_class=DispositionCodeListSerializer,
    )
    def dispositions(self, request, pk=None):
        self.context={'request':request}
        serializer = DispositionCodeListSerializer(DispositionCode.objects.get(
            name='procedure_results'),
            many=False,
            context={'request': request})
        return Response(serializer.data)

    @transaction.atomic
    @action(detail=True, methods=['get','post'],
        serializer_class=StepResultSerializer,
    )
    def add_step(self, request, pk=None):
        """
        This action accepts a minimum amount of data in order to POST results to a NEW Step Result attached to this procedure_result.
        POST:
        {
            "notes": string (optional)
            "step_definition": ID (Required)
            "execution_number": (blank=False, null=False)
            "disposition": ID (optional)
            "start_datetime": YYYY-MM-DD HH:MM[:ss[.uuuuuu]][TZ] format (optional)
            "test_step_result": ID (optional) points to step being replaced in retest
            "archived": boolean (default: false) only used for retest
            "name": string (default: step_definition.name)
            "description": string (optional)
            "step_number": string (optional)
            "linear_execution_group": float (optional)
        }
        """
        self.context={'request':request}
        procedure_result = ProcedureResult.objects.get(id=pk)
        # from django.urls import resolve
        if request.method == 'POST':
            params = request.data

            disposition = params.get('disposition')
            if disposition and (type(disposition) == int):
                disposition = Disposition.objects.get(id=disposition)

            # This is the only strictly required param from the POST:
            step_definition = params.get('step_definition')
            if type(step_definition) == int:
                step_definition = StepDefinition.objects.get(id=step_definition)
            # try:
            #     step_definition = StepDefinition.objects.get(id=resolve(step_definition).kwargs.get('pk'))
            # except IntegrityError:
            #     print('huh')

            step_result = StepResult.objects.create(
                notes = params.get('notes'),
                procedure_result = procedure_result,
                step_definition = step_definition,
                execution_number = params.get('execution_number',0),
                disposition = disposition,
                start_datetime = params.get('start_datetime'),
                duration = params.get('duration'),
                test_step_result = params.get('test_step_result'),
                archived = params.get('archived',False),
                name = params.get('name',step_definition.name),
                description = params.get('description'),
                step_number = params.get('step_number'),
                step_type = step_definition.step_type,
                linear_execution_group = params.get('linear_execution_group',0),
            )
            # print(step_result)
            for measurement_definition in step_definition.measurementdefinition_set.all():
                measurement_result = MeasurementResult.objects.create(
                    step_result = step_result,
                    measurement_definition = measurement_definition,
                    software_revision = 0.0,
                    disposition = None,
                    limit = measurement_definition.limit,
                    station = 0,
                    name = measurement_definition.name,
                    record_only = measurement_definition.record_only,
                    allow_skip = measurement_definition.allow_skip,
                    requires_review = measurement_definition.requires_review,
                    measurement_type = measurement_definition.measurement_type,
                    order = measurement_definition.order,
                    report_order = measurement_definition.report_order,
                    measurement_result_type = measurement_definition.measurement_result_type,
                )

            serializer = StepResultSerializer(step_result, many=False, context=self.context)
        else:
            # send error not 200
            serializer = ProcedureResultSerializer(procedure_result, many=False, context=self.context)
        return Response(serializer.data)

    # @transaction.atomic
    # @action(detail=True, methods=['get','post'],
    #     permission_classes=(ConfiguredPermission,),
    #     serializer_class = ProcedureResultSerializer,
    # )
    # def add_note(self, request, pk=None):
    #     """
    #     This action is used to add notes to a unit.
    #     POST:
    #     {
    #         "subject": "Unit note subject",
    #         "text": "Unit note text body",
    #         "type":$ID,
    #         "owner": $ID,
    #         "disposition": $ID,
    #         "labels": [$ID1, $ID2...],
    #         "groups": [$ID1, $ID2...],
    #         "tagged_users": [$ID1, $ID2...]
    #     }
    #     """
    #     self.context = {'request':request}
    #     procedure_result = ProcedureResult.objects.get(id=pk)
    #     if request.method == "POST":
    #         params = json.loads(request.body)
    #         noteParams = {
    #             "model" : "procedureresult",
    #             "pk" : pk,
    #             "user" : request.user,
    #             "subject" : params.get('subject'),
    #             "text" : params.get('text'),
    #             "note_type" : params.get('type'),
    #         }
    #         if params.get('owner') and params.get('owner') != -1:
    #             noteParams["owner"] = User.objects.get(id=params.get('owner'))
    #         if params.get('disposition') and params.get('disposition')!= -1 :
    #             noteParams["disposition"] =Disposition.objects.get(id=params.get('disposition'))
    #         newNote = create_note(
    #             **noteParams
    #         )
    #         # ProcedureResults need to trickle notes up to Unit and Project:
    #         procedure_result.work_order.project.notes.add(newNote)
    #         procedure_result.unit.notes.add(newNote)
    #         newNote.labels.set(params.get('labels'))
    #         newNote.groups.set(params.get('groups'))
    #         newNote.tagged_users.set(params.get('tagged_users'))
    #         newNote.save()
    #         serializer = NoteSerializer(newNote,many=False, context=self.context)
    #     else:
    #         serializer = NoteSerializer([], many=True, context=self.context)
    #     return Response(serializer.data)

    @action(detail=True, methods=['get',],
        serializer_class=NoteSerializer,
    )
    def notes(self, request, pk=None):
        procedure_result = ProcedureResult.objects.get(id=pk)
        self.context = {'request':request}
        serializer = NoteSerializer(procedure_result.notes.all(),many=True, context=self.context)
        return Response(serializer.data)

    @transaction.atomic
    @action(detail=True, methods=['get','post'],
        serializer_class=ProcedureResultSerializer,
    )
    def retest(self, request, pk=None):
        """
        This behaves the same as the manage_results/retest procedure except that any POST will do.
        """
        self.context={'request':request}
        if request.method == 'POST':
            retest = RetestUtils()
            return Response(retest.retest_procedure(request,pk))
        else:
            return Response(ProcedureResultSerializer(ProcedureResult.objects.get(id=pk),
            many=False, context=self.context).data)


    @transaction.atomic
    @action(detail=True, methods=['get','post'],
        serializer_class=ProcedureResultSerializer,
    )
    def submit(self, request, pk=None):
        """
        Submitting a result here will verify that all of the un skipable steps are
        completed before allowing a "terminal" disposition to be set.
        Additionally, if the disposition is "in progress" the server will set the
        "work_in_progress_must_comply" flag to True. If the disposition is being changed
        from "in progress" we will unset the flag.
        Accepts a sparse POST of:
        {
        "disposition": ID,
        "start_datetime": YYYY-MM-DD HH:MM[:ss[.uuuuuu]][TZ] format,
        "end_datetime": YYYY-MM-DD HH:MM[:ss[.uuuuuu]][TZ] format,
        }
        """
        self.context={'request':request}
        result = ProcedureResult.objects.get(id=pk)
        if request.method == 'POST':
            params = request.data
            if params.get('disposition'):
                disposition = Disposition.objects.get(id=params.get('disposition'))
                if disposition.complete:
                    # check all of your measurementresults
                    if (result.stepresult_set.all().count()) and ( # there are result children
                        result.stepresult_set.all().count() != result.stepresult_set.filter(Q(disposition__complete=True)|Q(allow_skip=True)).count()):
                        # error case:
                        return Response({'message':'One or more steps attached to this procedure are not complete and cannot be skipped'}, status = HTTP_400_BAD_REQUEST)
                # all good, set the disposition to the incoming one:
                result.disposition = disposition
                # if result.end_datetime == None:
                #     result.end_datetime = timezone.now()
            # WIP Flag:
            result.work_in_progress_must_comply = (disposition.name.lower() == "in progress")
            result.start_datetime = params.get('start_datetime', result.start_datetime)
            result.end_datetime = params.get('end_datetime', result.end_datetime)
            result.save()

        serializer = ProcedureResultSerializer(result, many=False, context=self.context)
        return Response(serializer.data)


    @action(detail=True,methods=['get'],
        permission_classes=(ConfiguredPermission,),
        serializer_class=ProcedureResultSerializer)
    def download(self, request, pk=None):
        # read the visualizer value of the current record to determine the shape
        # of the data to return.
        self.context = {'request':request}
        result = ProcedureResult.objects.get(id=pk)
        file = {}
        try:
            file = getattr(self, "_download_{}".format(result.procedure_definition.visualizer.name))(request, pk)
        except:
            'some error'
        return file

    def _download_colorimeter(self, request, pk=None):
        excel_file = ExcelFile()
        sheet = excel_file.workbook.active
        result = ProcedureResult.objects.get(id=pk)
        #Does not account for supersceded results
        result = result.stepresult_set.filter(disposition__isnull=False)
        result = result.first().measurementresult_set.filter(disposition__isnull=False)
        #Header Rows
        sheet.append([
            "Position",
            "L*",
            "A*",
            "B*"
        ])
        #Convert meassurement string to data values
        data = json.loads(result[0].result_string)
        data = data["values"]
        #Append values to sheet, calculate avg as we go
        l_val, a_val, b_val = [], [], []

        for value in data:
            row = [value["position"], value["l_value"], value["a_value"], value["b_value"]]
            l_val.append(value["l_value"])
            a_val.append(value["a_value"])
            b_val.append(value["b_value"])
            sheet.append(row)

        sheet.append(["Average", np.average(l_val), np.average(a_val), np.average(b_val)])

        sheet.append(["STD", np.std(l_val), np.std(a_val), np.std(b_val)])

        filename = 'ColorimeterReport-{}'.format(timezone.now().strftime('%b-%d-%Y-%H%M%S'))
        return excel_file.get_response(filename)

    def _download_diode(self, request, pk=None):
        result = ProcedureResult.objects.get(id=pk)
        serializer = ProcedureResultSerializer(result, many=False, context=self.context)
        return Response(serializer.data)
    def _download_el_image(self, request, pk=None):
        result = ProcedureResult.objects.get(id=pk)
        serializer = ProcedureResultSerializer(result, many=False, context=self.context)
        return Response(serializer.data)
    def _download_iam(self, request, pk=None):
        result = ProcedureResult.objects.get(id=pk)
        serializer = ProcedureResultSerializer(result, many=False, context=self.context)
        return Response(serializer.data)
    def _download_pan(self, request, pk=None):
        result = ProcedureResult.objects.get(id=pk)
        serializer = ProcedureResultSerializer(result, many=False, context=self.context)
        return Response(serializer.data)
    def _download_visual_inspection(self, request, pk=None):
        result = ProcedureResult.objects.get(id=pk)
        serializer = ProcedureResultSerializer(result, many=False, context=self.context)
        return Response(serializer.data)
    def _download_wet_leakage(self, request, pk=None):
        result = ProcedureResult.objects.get(id=pk)
        serializer = ProcedureResultSerializer(result, many=False, context=self.context)
        return Response(serializer.data)

    # Transforming Visualizers
    def _download_stress(self, request, pk=None):
        result = ProcedureResult.objects.get(id=pk)
        serializer = ProcedureResultStressSerializer(result, many=False, context=self.context)
        return Response(serializer.data)
    def _download_iv_curve(self, request, pk=None):
        # print('calling')
        result = ProcedureResult.objects.get(id=pk)
        serializer = TransformIVCurveSerializer(result, many=False, context=self.context)
        return Response(serializer.data)

    @action(detail=True,methods=['get'],
        permission_classes=(ConfiguredPermission,),
        serializer_class=ProcedureWorkLogSerializer)
    def view(self, request, pk=None):
        # read the visualizer value of the current record to determine the shape
        # of the data to return.
        self.context = {'request':request}
        result = ProcedureResult.objects.get(id=pk)
        visualized={}
        try:
            visualized = getattr(self, "_view_{}".format(result.procedure_definition.visualizer.name))(request, pk)
        except:
            'some error'
        return Response(visualized)

    # Base visualizers:
    def _view_colorimeter(self, request, pk=None):
        result = ProcedureResult.objects.get(id=pk)
        serializer = ProcedureResultSerializer(result, many=False, context=self.context)
        return (serializer.data)
    def _view_diode(self, request, pk=None):
        result = ProcedureResult.objects.get(id=pk)
        serializer = ProcedureResultSerializer(result, many=False, context=self.context)
        return (serializer.data)
    def _view_el_image(self, request, pk=None):
        result = ProcedureResult.objects.get(id=pk)
        serializer = ProcedureResultSerializer(result, many=False, context=self.context)
        return (serializer.data)
    def _view_iam(self, request, pk=None):
        result = ProcedureResult.objects.get(id=pk)
        serializer = ProcedureResultSerializer(result, many=False, context=self.context)
        return (serializer.data)
    def _view_pan(self, request, pk=None):
        result = ProcedureResult.objects.get(id=pk)
        serializer = ProcedureResultSerializer(result, many=False, context=self.context)
        return (serializer.data)
    def _view_visual_inspection(self, request, pk=None):
        result = ProcedureResult.objects.get(id=pk)
        serializer = ProcedureResultSerializer(result, many=False, context=self.context)
        return (serializer.data)
    def _view_wet_leakage(self, request, pk=None):
        result = ProcedureResult.objects.get(id=pk)
        serializer = ProcedureResultSerializer(result, many=False, context=self.context)
        return (serializer.data)

    # Transforming Visualizers
    def _view_stress(self, request, pk=None):
        result = ProcedureResult.objects.get(id=pk)
        serializer = ProcedureResultStressSerializer(result, many=False, context=self.context)
        return (serializer.data)
    def _view_iv_curve(self, request, pk=None):
        result = ProcedureResult.objects.get(id=pk)
        serializer = TransformIVCurveSerializer(result, many=False, context=self.context)
        return serializer.data

    @action(detail=False,methods=['get'],
        permission_classes=(ConfiguredPermission,),
        serializer_class=ProcedureWorkLogSerializer)
    def verify(self, request, pk=None):
        """
        this is where I pull all of the records that require verification in
        to be viewed for review.
        """
        self.context = {'request':request}
        disposition = Disposition.objects.get(name__iexact='requires review')
        # results = ProcedureResult.objects.filter(
        #     disposition=disposition
        # ).distinct()
        units = Unit.objects.filter(procedureresult__disposition=disposition).distinct()

        # that's all of the individul units that have results needing verification
        serializer = ProcedureResultVerificationSerializer(units, many=True, context=self.context)
        return Response(serializer.data)

    @action(detail=False,methods=['get'],
        permission_classes=(ConfiguredPermission,),
        serializer_class=ProcedureWorkLogSerializer)
    def worklog(self, request, pk=None):
        """
        This action will GET data based on dates sent as query parameters.

        To set the range:
        start_datetime=YYYY-MM-DD HH:MM[:ss[.uuuuuu]][TZ] format,
        end_datetime=YYYY-MM-DD HH:MM[:ss[.uuuuuu]][TZ] format,

        in order to dump an excel file of the same data for this range add:
        file=EXCEL

        GET /api/1.0/procedure_results/worklog/?start_datetime=2021-03-10&end_datetime=2021-03-11&file=excel
        """
        self.context = {'request':request}
        file = request.query_params.get('file','dummy')
        start_datetime = request.query_params.get('start_datetime',0)
        end_datetime = request.query_params.get('end_datetime',0)
        days = request.query_params.get('days',1)

        if start_datetime == 0 and end_datetime == 0:
            start_datetime = timezone.now() - timedelta(days=int(days))
            end_datetime = timezone.now()
        else:
            start_datetime = datetime.fromisoformat(start_datetime) + timedelta(days=1,hours=8)
            end_datetime = datetime.fromisoformat(end_datetime) + timedelta(days=1,hours=8)
            # this is still in zulu

        queryset = ProcedureResult.objects.filter(disposition__isnull=False,
            stepresult__archived=False,
            stepresult__disposition__isnull=False,
            stepresult__measurementresult__date_time__gte=start_datetime,
            stepresult__measurementresult__date_time__lte=end_datetime,
            ).distinct()
        serializer = ProcedureWorkLogSerializer(queryset, many=True, context=self.context)

        if file.upper() == 'EXCEL':
            wb = Workbook()
            sheet = wb.active
            sheet.append(['Project Number',
                        'Work Order',
                        'Serial Number',
                        'Test Sequence',
                        'Procedure',
                        'Disposition',
                        'Completion Date (UTC-8)',
                        'User',
                        'Characterization'])
            for row in serializer.data:
                result=dict(row)
                sheet.append([
                    result.get('project_number'),
                    result.get('work_order_name'),
                    str(result.get('serial_number')),
                    result.get('test_sequence_definition_name'),
                    result.get('procedure_definition_name'),
                    result.get('disposition_name'),
                    # timezone.make_aware(result.get('completion_date')),
                    timezone.make_naive(result.get('completion_date')) - timedelta(hours=8),
                    result.get('username'),
                    result.get('characterization_point')
                ])
            sheet.auto_filter.ref = sheet.dimensions
            mem_file = BytesIO(save_virtual_workbook(wb))
            # wb.save(mem_file)

            filename=timezone.now().strftime('%b-%d-%Y-%H%M%S')
            response = HttpResponse(mem_file, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = 'attachment; filename={}.xlsx'.format(filename)
            return response
        else:
            return Response(serializer.data)

    @action(detail=False,methods=['get'],
        permission_classes=(ConfiguredPermission,),
        serializer_class=ProcedureWorkLogSerializer)
    def procedure_stats(self, request, pk=None):
        self.context = {'request':request}
        file = request.query_params.get('file','dummy')
        start_datetime = request.query_params.get('start_datetime',0)
        end_datetime = request.query_params.get('end_datetime',0)
        # default to trailing 30 days
        days = request.query_params.get('days',30)
        facility = request.query_params.get('facility',None)

        if start_datetime == 0 and end_datetime == 0:
            start_datetime = timezone.now() - timedelta(days=int(days))
            end_datetime = timezone.now()
        else:
            start_datetime = datetime.fromisoformat(start_datetime) + timedelta(days=1,hours=8)
            end_datetime = datetime.fromisoformat(end_datetime) + timedelta(days=1,hours=8)
            # this is still in zulu
        queryset = ProcedureResult.objects.filter(disposition__isnull=False,
             stepresult__archived=False,
             stepresult__disposition__isnull=False,
             stepresult__measurementresult__date_time__gte=start_datetime,
             stepresult__measurementresult__date_time__lte=end_datetime,
             ).distinct()
        if facility:
            queryset = queryset.filter(stepresult__measurementresult__asset__location__name=facility)
        queryset = queryset.annotate(last_result = Max('stepresult__measurementresult__date_time'))
        master_data_frame = pd.DataFrame(list(queryset.values('last_result','procedure_definition__name')))
        master_data_frame['last_result']=master_data_frame['last_result'].dt.tz_convert("US/Pacific")
        master_data_frame['last_result']=master_data_frame['last_result'].dt.date
        df1 = pd.crosstab(master_data_frame['procedure_definition__name'],master_data_frame['last_result'].fillna(0))
        # df1.to_json(date_format='iso',orient='columns')
        final = []
        my_dict =  df1.to_dict()
        for day in my_dict:
            row={'date':day}
            row.update(my_dict[day].items())
            final.append(row)
        return Response(final)
