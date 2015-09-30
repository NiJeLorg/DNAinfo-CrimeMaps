# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0012_auto_20150813_1507'),
    ]

    operations = [
        migrations.CreateModel(
            name='CHICookCountyRealEstateData',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('doc', models.IntegerField(default=0)),
                ('address', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('unit', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('zip', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('city', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('fulladdress', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('latitude', models.FloatField(default=0, null=True, blank=True)),
                ('longitude', models.FloatField(default=0, null=True, blank=True)),
                ('amount', models.IntegerField(default=0, null=True, blank=True)),
                ('recorded', models.DateField(default=b'', null=True, blank=True)),
                ('executed', models.DateField(default=b'', null=True, blank=True)),
                ('seller', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('buyer', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('pin', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('township', models.CharField(default=b'', max_length=255, null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='CHIZIPZillowData',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('monthyear', models.DateField(default=b'', null=True, blank=True)),
                ('zip', models.IntegerField(default=0)),
                ('neighborhoodscovered', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('population2013censusestimate', models.IntegerField(default=0, null=True, blank=True)),
                ('percentlivinginsamehouseoneyearago2013censusestimate', models.FloatField(default=0, null=True, blank=True)),
                ('medianhouseholdincome2013censusestimate', models.FloatField(default=0, null=True, blank=True)),
                ('changeinvaluesquarefootoverpreviousyear', models.FloatField(default=0, null=True, blank=True)),
                ('changeavgrentsqfootoverpreviousyear', models.FloatField(default=0, null=True, blank=True)),
                ('percentofhomessoldinpastyear', models.FloatField(default=0, null=True, blank=True)),
                ('estimatedvaluesquarefoot', models.FloatField(default=0, null=True, blank=True)),
                ('estimatedvalueofallhomes', models.FloatField(default=0, null=True, blank=True)),
                ('avgrentsqfoot', models.FloatField(default=0, null=True, blank=True)),
                ('medianlistprice', models.FloatField(default=0, null=True, blank=True)),
                ('mediansaleprice', models.FloatField(default=0, null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='NYCStreetEasyRealEstateData',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('area', models.CharField(default=b'', max_length=255)),
                ('dateperiod', models.DateField(default=b'', null=True, blank=True)),
                ('unittype', models.CharField(default=b'', max_length=255)),
                ('medianaskingprice', models.IntegerField(default=0, null=True, blank=True)),
                ('totalsalesinventory', models.IntegerField(default=0, null=True, blank=True)),
                ('medianaskingrent', models.IntegerField(default=0, null=True, blank=True)),
                ('totalrentalinventory', models.IntegerField(default=0, null=True, blank=True)),
                ('medianclosingprice', models.IntegerField(default=0, null=True, blank=True)),
                ('totalclosings', models.IntegerField(default=0, null=True, blank=True)),
                ('medianppsf', models.FloatField(default=0, null=True, blank=True)),
                ('totalsaleclosings', models.IntegerField(default=0, null=True, blank=True)),
                ('medianaskingrentchcange', models.FloatField(default=0, null=True, blank=True)),
                ('medianppsfchange', models.FloatField(default=0, null=True, blank=True)),
            ],
        ),
    ]
