# Generated by Django 3.2 on 2021-10-18 20:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contenttypes', '0002_remove_content_type_name'),
        ('lsdb', '0028_auto_20211011_2122'),
    ]

    operations = [
        migrations.AddField(
            model_name='azurefile',
            name='expires',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='ActionCompletionDefinition',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=128, null=True)),
                ('plugin_name', models.CharField(max_length=256)),
                ('plugin_params', models.CharField(max_length=256)),
                ('expected_result', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='ActionCompletionResult',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('criteria_completed', models.BooleanField(default=False)),
                ('completed_datetime', models.DateTimeField(blank=True, null=True)),
                ('action_completion_definition', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lsdb.actioncompletiondefinition')),
            ],
        ),
        migrations.CreateModel(
            name='ActionDefinition',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=128, null=True)),
                ('description', models.CharField(blank=True, max_length=128, null=True)),
                ('completion_criteria', models.ManyToManyField(blank=True, to='lsdb.ActionCompletionDefinition')),
                ('disposition', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lsdb.disposition')),
                ('groups', models.ManyToManyField(blank=True, to='lsdb.Group')),
            ],
            options={
                'ordering': ('name',),
            },
        ),
        migrations.CreateModel(
            name='ActionExecutionOrder',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('execution_group_number', models.FloatField()),
                ('execution_group_name', models.CharField(blank=True, max_length=128, null=True)),
                ('action_definition', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lsdb.actiondefinition')),
            ],
        ),
        migrations.AlterModelOptions(
            name='plugin',
            options={'ordering': ('name',)},
        ),
        migrations.RemoveField(
            model_name='plugin',
            name='version',
        ),
        migrations.AddField(
            model_name='plugin',
            name='revision',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='note',
            name='labels',
            field=models.ManyToManyField(blank=True, to='lsdb.Label'),
        ),
        migrations.AlterField(
            model_name='plugin',
            name='name',
            field=models.CharField(max_length=256, unique=True),
        ),
        migrations.CreateModel(
            name='ActionResult',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=128, null=True)),
                ('description', models.CharField(blank=True, max_length=128, null=True)),
                ('execution_group', models.FloatField()),
                ('done_datetime', models.DateTimeField(blank=True, null=True)),
                ('start_datetime', models.DateTimeField(blank=True, null=True)),
                ('promise_datetime', models.DateTimeField(blank=True, null=True)),
                ('eta_datetime', models.DateTimeField(blank=True, null=True)),
                ('override_description', models.CharField(blank=True, max_length=128, null=True)),
                ('override_date', models.DateTimeField(blank=True, null=True)),
                ('object_id', models.PositiveIntegerField()),
                ('action_definition', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lsdb.actiondefinition')),
                ('attachments', models.ManyToManyField(blank=True, to='lsdb.AzureFile')),
                ('completion_criteria', models.ManyToManyField(blank=True, through='lsdb.ActionCompletionResult', to='lsdb.ActionCompletionDefinition')),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('disposition', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lsdb.disposition')),
                ('groups', models.ManyToManyField(blank=True, to='lsdb.Group')),
                ('override_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='action_override_user', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ActionPlanDefinition',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=128, null=True)),
                ('description', models.CharField(blank=True, max_length=128, null=True)),
                ('action_definitions', models.ManyToManyField(through='lsdb.ActionExecutionOrder', to='lsdb.ActionDefinition')),
                ('disposition', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lsdb.disposition')),
                ('groups', models.ManyToManyField(blank=True, to='lsdb.Group')),
                ('unit_type_family', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lsdb.unittypefamily')),
            ],
            options={
                'ordering': ('name',),
            },
        ),
        migrations.AddField(
            model_name='actionexecutionorder',
            name='action_plan',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lsdb.actionplandefinition'),
        ),
        migrations.AddField(
            model_name='actioncompletionresult',
            name='action_result',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lsdb.actionresult'),
        ),
        migrations.AddIndex(
            model_name='actioncompletiondefinition',
            index=models.Index(fields=['name'], name='lsdb_action_name_65384b_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='actioncompletiondefinition',
            unique_together={('name',)},
        ),
        migrations.AddIndex(
            model_name='actionresult',
            index=models.Index(fields=['name'], name='lsdb_action_name_758236_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='actionresult',
            unique_together={('name',)},
        ),
        migrations.AddIndex(
            model_name='actionplandefinition',
            index=models.Index(fields=['name'], name='lsdb_action_name_b0f279_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='actionplandefinition',
            unique_together={('name',)},
        ),
        migrations.AddIndex(
            model_name='actionexecutionorder',
            index=models.Index(fields=['execution_group_number', 'action_definition', 'action_plan'], name='lsdb_action_executi_9ea195_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='actionexecutionorder',
            unique_together={('execution_group_number', 'action_definition', 'action_plan')},
        ),
        migrations.AddIndex(
            model_name='actiondefinition',
            index=models.Index(fields=['name'], name='lsdb_action_name_b60971_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='actiondefinition',
            unique_together={('name',)},
        ),
        migrations.AddIndex(
            model_name='actioncompletionresult',
            index=models.Index(fields=['action_result', 'action_completion_definition'], name='lsdb_action_action__fd05e8_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='actioncompletionresult',
            unique_together={('action_result', 'action_completion_definition')},
        ),
    ]
