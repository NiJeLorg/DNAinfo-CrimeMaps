# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('skyline', '0008_remove_nycreporterbuildings_idontseemyneighborhood'),
    ]

    operations = [
        migrations.CreateModel(
            name='NYC_DOB_Permit_Issuance',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now=True)),
                ('borough', models.CharField(default=b'', max_length=255)),
                ('bin', models.CharField(default=b'', max_length=255)),
                ('house', models.CharField(default=b'', max_length=255)),
                ('street_name', models.CharField(default=b'', max_length=255)),
                ('job', models.CharField(default=b'', max_length=255)),
                ('job_doc', models.CharField(default=b'', max_length=255)),
                ('job_type', models.CharField(default=b'', max_length=255)),
                ('block', models.CharField(default=b'', max_length=255)),
                ('lot', models.CharField(default=b'', max_length=255)),
                ('community_board', models.CharField(default=b'', max_length=255)),
                ('zip_code', models.CharField(default=b'', max_length=255)),
                ('bldg_type', models.CharField(default=b'', max_length=255)),
                ('residential', models.CharField(default=b'', max_length=255)),
                ('permit_status', models.CharField(default=b'', max_length=255)),
                ('filing_status', models.CharField(default=b'', max_length=255)),
                ('permit_type', models.CharField(default=b'', max_length=255)),
                ('filing_date', models.CharField(default=b'', max_length=255)),
                ('issuance_date', models.CharField(default=b'', max_length=255)),
                ('expiration_date', models.CharField(default=b'', max_length=255)),
                ('job_start_date', models.CharField(default=b'', max_length=255)),
                ('buildingBBL', models.CharField(default=b'', max_length=255)),
                ('buildingFootprint', models.TextField(default=b'')),
                ('buildingStories', models.IntegerField(default=0)),
            ],
        ),
    ]
