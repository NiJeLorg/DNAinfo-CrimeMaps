# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-10-28 22:21
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('skyline_chi', '0013_auto_20161028_1800'),
    ]

    operations = [
        migrations.CreateModel(
            name='CHI_Building_Permits_New',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ID_ODP', models.IntegerField(unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('permit', models.CharField(default=b'', max_length=255)),
                ('permit_type', models.CharField(default=b'', max_length=255)),
                ('issue_date', models.DateField(blank=True, null=True)),
                ('street_number', models.CharField(default=b'', max_length=255)),
                ('street_direction', models.CharField(default=b'', max_length=255)),
                ('street_name', models.CharField(default=b'', max_length=255)),
                ('suffix', models.CharField(default=b'', max_length=255)),
                ('work_description', models.TextField(blank=True, default=b'', null=True)),
                ('pin1', models.CharField(default=b'', max_length=255)),
                ('latitude', models.CharField(default=b'', max_length=255)),
                ('longitude', models.CharField(default=b'', max_length=255)),
                ('buildingFootprint', models.TextField(default=b'')),
                ('buildingStories', models.IntegerField(default=0)),
                ('zoning_pdfs', models.URLField(blank=True, default=b'', max_length=1000, null=True)),
                ('story1', models.URLField(blank=True, default=b'', max_length=1000, null=True)),
                ('projectName', models.CharField(blank=True, default=b'', max_length=255, null=True)),
                ('buildingImage', models.ImageField(blank=True, null=True, upload_to=b'img/%Y_%m_%d_%h_%M_%s')),
                ('buildingAddress', models.CharField(default=b'', max_length=255)),
                ('description', models.CharField(blank=True, default=b'', max_length=200, null=True)),
                ('archived', models.BooleanField(default=False)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='chi_permitted_created_by_new', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='chi_permitted_updated_by_new', to=settings.AUTH_USER_MODEL)),
                ('whereBuilding', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='skyline_chi.neighborhoodCHI')),
            ],
        ),
    ]
