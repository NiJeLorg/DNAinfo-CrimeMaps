# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0014_auto_20150929_1447'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nycstreeteasyrealestatedata',
            name='medianaskingprice',
            field=models.FloatField(default=0, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='nycstreeteasyrealestatedata',
            name='medianaskingrent',
            field=models.FloatField(default=0, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='nycstreeteasyrealestatedata',
            name='medianclosingprice',
            field=models.FloatField(default=0, null=True, blank=True),
        ),
    ]
