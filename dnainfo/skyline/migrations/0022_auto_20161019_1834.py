# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-10-19 22:34
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('skyline', '0021_auto_20161019_1800'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nyc_dob_permit_issuance',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
