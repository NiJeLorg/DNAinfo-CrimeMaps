# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0022_auto_20151103_1205'),
    ]

    operations = [
        migrations.CreateModel(
            name='NYCtrainSitStand',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now=True)),
                ('train', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('rideTime', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('rideLength', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('positionOne', models.IntegerField(default=0, null=True, blank=True)),
                ('positionOneType', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('positionTwo', models.IntegerField(default=0, null=True, blank=True)),
                ('positionTwoType', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('positionThree', models.IntegerField(default=0, null=True, blank=True)),
                ('positionThreeType', models.CharField(default=b'', max_length=255, null=True, blank=True)),
            ],
        ),
    ]
