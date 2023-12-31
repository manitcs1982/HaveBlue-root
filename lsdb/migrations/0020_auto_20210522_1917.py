# Generated by Django 3.2 on 2021-05-22 19:17

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings

class Migration(migrations.Migration):

    dependencies = [
        ('lsdb', '0019_auto_20210507_1513'),
    ]

    operations = [
        migrations.RenameField(
            model_name='crate',
            old_name='observations',
            new_name='notes',
        ),
        migrations.AddField(
            model_name='asset',
            name='notes',
            field=models.ManyToManyField(blank=True, to='lsdb.Note'),
        ),
        migrations.AddField(
            model_name='testsequencedefinition',
            name='short_name',
            field=models.CharField(blank=True, max_length=5, null=True),
        ),
        migrations.AlterField(
            model_name='procedureresult',
            name='linear_execution_group',
            field=models.FloatField(),
        ),
        migrations.AddField(
            model_name='note',
            name='organization',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='lsdb.organization'),
        ),
        migrations.AddField(
            model_name='note',
            name='parent_note',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='lsdb.note'),
        ),
        migrations.AddField(
            model_name='note',
            name='tagged_users',
            field=models.ManyToManyField(blank=True, related_name='notetaggedusers', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='NoteReadStatus',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('read_datetime', models.DateTimeField(auto_now_add=True)),
                ('note', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lsdb.note')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notereaduser', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='note',
            name='read_status',
            field=models.ManyToManyField(blank=True, related_name='notereadstaus', through='lsdb.NoteReadStatus', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddIndex(
            model_name='notereadstatus',
            index=models.Index(fields=['user', 'note'], name='lsdb_notere_user_id_60642d_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='notereadstatus',
            unique_together={('user', 'note')},
        ),
    ]
