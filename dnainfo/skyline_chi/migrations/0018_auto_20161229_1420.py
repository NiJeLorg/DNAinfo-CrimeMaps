# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-12-29 19:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('skyline_chi', '0017_auto_20161201_1738'),
    ]

    operations = [
        migrations.AddField(
            model_name='chi_building_permits_new',
            name='estimated_cost',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='chi_building_permits_new',
            name='pin_added',
            field=models.CharField(default=b'', max_length=255),
        ),
    ]
