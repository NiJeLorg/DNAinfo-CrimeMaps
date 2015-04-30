# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='blotter',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Address', models.CharField(max_length=255)),
                ('DateTime', models.DateTimeField()),
                ('BlotterWeek', models.DateField()),
                ('PoliceSaid', models.TextField()),
                ('Latitude', models.FloatField()),
                ('Longitude', models.FloatField()),
                ('JSDate', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='compstat',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('precinct', models.IntegerField()),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('murder', models.IntegerField()),
                ('rape', models.IntegerField()),
                ('robbery', models.IntegerField()),
                ('felony_assault', models.IntegerField()),
                ('burglary', models.IntegerField()),
                ('grand_larceny', models.IntegerField()),
                ('grand_larceny_auto', models.IntegerField()),
                ('total', models.IntegerField()),
                ('transit', models.IntegerField()),
                ('housing', models.IntegerField()),
                ('petit_larceny', models.IntegerField()),
                ('misdemeanor_assault', models.IntegerField()),
                ('misdemeanor_sex_crimes', models.IntegerField()),
                ('shooting_victims', models.IntegerField()),
                ('shooting_inc', models.IntegerField()),
                ('murder_last_year', models.IntegerField()),
                ('rape_last_year', models.IntegerField()),
                ('robbery_last_year', models.IntegerField()),
                ('felony_assault_last_year', models.IntegerField()),
                ('burglary_last_year', models.IntegerField()),
                ('grand_larceny_last_year', models.IntegerField()),
                ('grand_larceny_auto_last_year', models.IntegerField()),
                ('total_last_year', models.IntegerField()),
                ('transit_last_year', models.IntegerField()),
                ('housing_last_year', models.IntegerField()),
                ('petit_larceny_last_year', models.IntegerField()),
                ('misdemeanor_assault_last_year', models.IntegerField()),
                ('misdemeanor_sex_crimes_last_year', models.IntegerField()),
                ('shooting_victims_last_year', models.IntegerField()),
                ('shooting_inc_last_year', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='doitt',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('longitude', models.FloatField()),
                ('latitude', models.FloatField()),
                ('YR', models.IntegerField()),
                ('MO', models.IntegerField()),
                ('X', models.IntegerField()),
                ('Y', models.IntegerField()),
                ('TOT', models.IntegerField()),
                ('CR', models.CharField(max_length=255)),
            ],
        ),
    ]
