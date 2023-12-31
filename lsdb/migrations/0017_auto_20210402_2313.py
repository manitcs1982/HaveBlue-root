# Generated by Django 3.0.8 on 2021-04-02 23:13

from django.db import migrations, models
import django.db.models.deletion

def initialize_note_type(apps, schema_editor):
    NoteType = apps.get_model('lsdb', 'NoteType')
    note_type = NoteType()
    note_type.name = 'Note'
    note_type.description = 'Basic Note type'
    note_type.save()


class Migration(migrations.Migration):

    dependencies = [
        ('lsdb', '0016_auto_20210330_2346'),
    ]

    operations = [
        migrations.CreateModel(
            name='NoteType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, db_index=True, max_length=128, null=True)),
                ('description', models.CharField(blank=True, max_length=128, null=True)),
            ],
            options={
                'ordering': ('name',),
            },
        ),
        migrations.RunPython(initialize_note_type),
        migrations.AddField(
            model_name='note',
            name='disposition',
            field=models.ForeignKey(default=16, on_delete=django.db.models.deletion.CASCADE, to='lsdb.Disposition'),
        ),
        migrations.AddField(
            model_name='note',
            name='note_type',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='lsdb.NoteType'),
        ),
    ]
