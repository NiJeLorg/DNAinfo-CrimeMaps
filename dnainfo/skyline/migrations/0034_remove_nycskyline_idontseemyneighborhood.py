# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-11-22 00:34
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('skyline', '0033_auto_20161121_1916'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='nycskyline',
            name='iDontSeeMyNeighborhood',
        ),
    ]
