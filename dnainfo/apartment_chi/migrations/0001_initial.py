# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CHImyFirstApartment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now=True)),
                ('whenMoved', models.CharField(default=b'', max_length=255)),
                ('iDontSeeMyNeighborhood', models.BooleanField(default=False)),
                ('firstApartmentLocation', models.TextField(default=b'')),
                ('exactYearMoved', models.IntegerField(default=0)),
                ('bedrooms', models.IntegerField(default=0)),
                ('rentSplit', models.IntegerField(default=0)),
                ('iPaid', models.FloatField(default=0)),
                ('allPaid', models.FloatField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='cpi',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('year', models.IntegerField(default=0)),
                ('cpi', models.FloatField(default=b'', max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='neighborhoodCHI',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('dnaurl', models.CharField(default=b'', max_length=255)),
                ('name', models.CharField(default=b'', max_length=255)),
                ('county', models.CharField(default=b'', max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='zillowMedianRentListPrice',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('RegionName', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('City', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('State', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('Metro', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('CountyName', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('SizeRank', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('Cost', models.FloatField(default=0)),
                ('bedrooms', models.IntegerField(default=0)),
            ],
        ),
        migrations.AddField(
            model_name='chimyfirstapartment',
            name='whereMoved',
            field=models.ForeignKey(blank=True, to='apartment_chi.neighborhoodCHI', null=True),
        ),
    ]
