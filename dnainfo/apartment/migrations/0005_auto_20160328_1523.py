# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0004_auto_20160328_1520'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nycmyfirstapartment',
            name='iDontSeeMyNeighborhood',
            field=models.BooleanField(default=False),
        ),
    ]
