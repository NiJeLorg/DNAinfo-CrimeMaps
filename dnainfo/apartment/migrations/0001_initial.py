# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='NYCmyFirstApartment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now=True)),
                ('whenMoved', models.CharField(default=b'', max_length=255)),
                ('whereMoved', models.CharField(default=b'', max_length=255)),
                ('firstApartmentLocation', models.TextField(default=b'')),
                ('exactYearMoved', models.IntegerField(default=0)),
                ('bedrooms', models.IntegerField(default=0)),
                ('rentSplit', models.IntegerField(default=0)),
                ('iPaid', models.FloatField(default=0)),
                ('allPaid', models.FloatField(default=0)),
            ],
        ),
    ]
