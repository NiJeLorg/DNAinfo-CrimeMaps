# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-10-05 22:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('skyline', '0015_auto_20160925_1634'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='nycreporterbuildings',
            name='story2',
        ),
        migrations.RemoveField(
            model_name='nycreporterbuildings',
            name='story3',
        ),
        migrations.AddField(
            model_name='nycreporterbuildings',
            name='buildingImage',
            field=models.ImageField(blank=True, null=True, upload_to=b'img/%Y_%m_%d_%h_%M_%s'),
        ),
        migrations.AddField(
            model_name='nycreporterbuildings',
            name='projectName',
            field=models.CharField(blank=True, default=b'', max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='nycreporterbuildings',
            name='description',
            field=models.CharField(blank=True, default=b'', max_length=200, null=True),
        ),
    ]
