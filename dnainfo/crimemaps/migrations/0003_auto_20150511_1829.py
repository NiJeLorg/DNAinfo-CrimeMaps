# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0002_auto_20150429_2020'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blotter',
            name='DateTime',
            field=models.DateTimeField(null=True, blank=True),
        ),
    ]
