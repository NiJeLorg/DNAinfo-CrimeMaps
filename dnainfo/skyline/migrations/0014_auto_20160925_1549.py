# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-09-25 19:49
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('skyline', '0013_nyc_dob_permit_issuance_scan_code_updated'),
    ]

    operations = [
        migrations.AddField(
            model_name='nycreporterbuildings',
            name='description',
            field=models.TextField(default=b''),
        ),
        migrations.AddField(
            model_name='nycreporterbuildings',
            name='story1',
            field=models.URLField(blank=True, default=b'', max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name='nycreporterbuildings',
            name='story2',
            field=models.URLField(blank=True, default=b'', max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name='nycreporterbuildings',
            name='story3',
            field=models.URLField(blank=True, default=b'', max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name='nycreporterbuildings',
            name='zoning_pdfs',
            field=models.FileField(blank=True, null=True, upload_to=b'reporter_zoning_pdfs/'),
        ),
    ]
