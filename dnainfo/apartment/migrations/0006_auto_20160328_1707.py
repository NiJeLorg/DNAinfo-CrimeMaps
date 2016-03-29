# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0005_auto_20160328_1523'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nycmyfirstapartment',
            name='whereMoved',
            field=models.ForeignKey(blank=True, to='apartment.neighborhoodNYC', null=True),
        ),
    ]
