# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0011_auto_20150728_1650'),
    ]

    operations = [
        migrations.AddField(
            model_name='neighborhooddrawchi',
            name='approved',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='neighborhooddrawnyc',
            name='approved',
            field=models.BooleanField(default=False),
        ),
    ]
