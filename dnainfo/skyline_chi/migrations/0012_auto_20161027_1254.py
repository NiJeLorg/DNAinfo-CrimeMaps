# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-10-27 16:54
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('skyline_chi', '0011_auto_20161024_1812'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chi_building_permits',
            name='whereBuilding',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='skyline_chi.neighborhoodCHI'),
        ),
    ]
