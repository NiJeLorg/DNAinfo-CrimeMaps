# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-11-21 23:53
from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('skyline', '0031_auto_20161114_2010'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nycskyline',
            name='buildingStories',
            field=models.PositiveIntegerField(default=1, validators=[django.core.validators.MinValueValidator(1)]),
        ),
    ]
