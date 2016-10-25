# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-09-28 15:19
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('skyline_chi', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='chi_building_permits',
            name='buildingFootprint',
            field=models.TextField(default=b''),
        ),
        migrations.AddField(
            model_name='chi_building_permits',
            name='buildingStories',
            field=models.IntegerField(default=0),
        ),
    ]