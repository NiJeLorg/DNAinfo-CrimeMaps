# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-10-06 17:08
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('skyline', '0016_auto_20161005_1837'),
    ]

    operations = [
        migrations.AddField(
            model_name='nycreporterbuildings',
            name='buildingZip',
            field=models.CharField(default=b'', max_length=255),
        ),
    ]
