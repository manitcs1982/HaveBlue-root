# Generated by Django 3.2 on 2021-11-09 17:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lsdb', '0029_auto_20211018_2032'),
    ]

    operations = [
        migrations.AddField(
            model_name='actionresult',
            name='recognized_revenue',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='note',
            name='labels',
            field=models.ManyToManyField(blank=True, to='lsdb.Label'),
        ),
    ]
