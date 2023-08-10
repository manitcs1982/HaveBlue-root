# Generated by Django 3.2 on 2021-08-16 19:11

from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ('lsdb', '0023_auto_20210806_1543'),
    ]

    operations = [
        migrations.AddField(
            model_name='crate',
            name='project',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='lsdb.project'),
        ),
        migrations.AddField(
            model_name='project',
            name='attachments',
            field=models.ManyToManyField(blank=True, to='lsdb.AzureFile'),
        ),
        migrations.AddField(
            model_name='unit',
            name='intake_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='note',
            name='labels',
            field=models.ManyToManyField(blank=True, to='lsdb.Label'),
        ),
    ]
