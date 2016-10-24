# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-10-24 22:12
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('skyline_chi', '0010_auto_20161019_1906'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chi_building_permits',
            name='user',
        ),
        migrations.RemoveField(
            model_name='chireporterbuildings',
            name='user',
        ),
        migrations.RemoveField(
            model_name='chisponsoredbuildings',
            name='user',
        ),
        migrations.AddField(
            model_name='chi_building_permits',
            name='archived',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='chi_building_permits',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='chi_permitted_created_by', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='chi_building_permits',
            name='updated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='chi_permitted_updated_by', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='chireporterbuildings',
            name='archived',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='chireporterbuildings',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='chi_reporter_created_by', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='chireporterbuildings',
            name='updated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='chi_reporter_updated_by', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='chiskyline',
            name='reviewed_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='chisponsoredbuildings',
            name='archived',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='chisponsoredbuildings',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='chi_sponsored_created_by', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='chisponsoredbuildings',
            name='updated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='chi_sponsored_updated_by', to=settings.AUTH_USER_MODEL),
        ),
    ]
