# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0002_auto_20160328_0000'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nycmyfirstapartment',
            name='whereMoved',
            field=models.ForeignKey(to='apartment.neighborhoodNYC', null=True),
        ),
    ]
