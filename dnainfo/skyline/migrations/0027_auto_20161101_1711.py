# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-11-01 21:11
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('skyline', '0026_auto_20161027_1254'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='neighborhoodnyc',
            options={'permissions': (('modify_UGC', 'Can add, edit, update, delete UCG buildings.'),)},
        ),
        migrations.AlterModelOptions(
            name='nycsponsoredbuildings',
            options={'permissions': (('modify_sponsored', 'Can add, edit, update, delete sponsored buildings.'),)},
        ),
    ]
