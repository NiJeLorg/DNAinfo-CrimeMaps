# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='blotter',
            name='Arrest',
            field=models.NullBooleanField(default=None),
        ),
        migrations.AddField(
            model_name='blotter',
            name='CrimeType',
            field=models.CharField(default=b'', max_length=255),
        ),
        migrations.AddField(
            model_name='blotter',
            name='Precinct',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='blotter',
            name='Address',
            field=models.CharField(default=b'', max_length=255),
        ),
        migrations.AlterField(
            model_name='compstat',
            name='precinct',
            field=models.CharField(default=b'', max_length=255),
        ),
        migrations.AlterField(
            model_name='doitt',
            name='CR',
            field=models.CharField(default=b'', max_length=255),
        ),
    ]
