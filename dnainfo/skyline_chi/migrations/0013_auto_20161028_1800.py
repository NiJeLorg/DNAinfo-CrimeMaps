# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-10-28 22:00
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('skyline_chi', '0012_auto_20161027_1254'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='CHI_Building_Permits',
            new_name='CHI_Building_Permits_Old',
        ),
    ]
