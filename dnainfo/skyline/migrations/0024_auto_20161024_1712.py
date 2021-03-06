# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-10-24 21:12
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('skyline', '0023_auto_20161019_1839'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='nyc_dob_permit_issuance',
            name='user',
        ),
        migrations.RemoveField(
            model_name='nycreporterbuildings',
            name='user',
        ),
        migrations.RemoveField(
            model_name='nycsponsoredbuildings',
            name='user',
        ),
        migrations.AddField(
            model_name='nyc_dob_permit_issuance',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='permitted_created_by', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='nyc_dob_permit_issuance',
            name='updated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='permitted_updated_by', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='nycreporterbuildings',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reporter_created_by', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='nycreporterbuildings',
            name='updated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reporter_updated_by', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='nycskyline',
            name='reviewed_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='nycsponsoredbuildings',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='sponsored_created_by', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='nycsponsoredbuildings',
            name='updated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='sponsored_updated_by', to=settings.AUTH_USER_MODEL),
        ),
    ]
