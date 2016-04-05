# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0007_cpi'),
    ]

    operations = [
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
    ]
