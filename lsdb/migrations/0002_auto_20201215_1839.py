# Generated by Django 3.0.8 on 2020-12-15 18:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('lsdb', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PlexusImport',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('plexus_oid', models.CharField(max_length=64, unique=True)),
                ('lsdb_id', models.IntegerField()),
                ('lsdb_model', models.CharField(blank=True, max_length=64, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddIndex(
            model_name='plexusimport',
            index=models.Index(fields=['plexus_oid', 'lsdb_id', 'lsdb_model'], name='lsdb_plexus_plexus__0c7b3e_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='plexusimport',
            unique_together={('plexus_oid', 'lsdb_id', 'lsdb_model')},
        ),
    ]
