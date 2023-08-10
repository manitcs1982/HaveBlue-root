# Generated by Django 3.0.8 on 2021-03-30 22:58

from django.db import models, migrations


def copy_asset_types(apps, schema_editor):
    Asset = apps.get_model('lsdb', 'Asset')

    for asset in Asset.objects.all():
        asset.asset_types.add(asset.asset_type)

class Migration(migrations.Migration):

    dependencies = [
        ('lsdb', '0014_auto_20210330_2212'),
    ]

    operations = [
        migrations.RunPython(copy_asset_types),
    ]
