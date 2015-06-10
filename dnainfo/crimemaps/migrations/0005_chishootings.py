# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0004_auto_20150511_1830'),
    ]

    operations = [
        migrations.CreateModel(
            name='chiShootings',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Date', models.DateTimeField(null=True, blank=True)),
                ('Address', models.CharField(default=b'', max_length=255)),
                ('Lat', models.FloatField()),
                ('Long', models.FloatField()),
                ('RD', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('District', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('Beat', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('IUCR', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('Location', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('Status', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('Domestic', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('HomVics', models.IntegerField(default=0, null=True, blank=True)),
                ('OtherShoo', models.IntegerField(default=0, null=True, blank=True)),
                ('TotalVict', models.IntegerField(default=0, null=True, blank=True)),
                ('Month', models.IntegerField(default=0, null=True, blank=True)),
                ('Day', models.IntegerField(default=0, null=True, blank=True)),
                ('Year', models.IntegerField(default=0, null=True, blank=True)),
                ('Hour', models.IntegerField(default=0, null=True, blank=True)),
                ('DayOfWeek', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('MonthYear', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('URL', models.TextField(default=b'', null=True, blank=True)),
                ('Notes', models.TextField(default=b'', null=True, blank=True)),
                ('Neighborhood', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('CommunityNo', models.IntegerField(default=0, null=True, blank=True)),
                ('CommunityName', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('PoliceInvolved', models.CharField(default=b'', max_length=255, null=True, blank=True)),
            ],
        ),
    ]
