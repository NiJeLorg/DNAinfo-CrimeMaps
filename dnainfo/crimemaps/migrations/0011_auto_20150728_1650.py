# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0010_auto_20150728_1640'),
    ]

    operations = [
        migrations.AddField(
            model_name='neighborhooddrawchi',
            name='otherNeighborhood',
            field=models.CharField(default=b'', max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='neighborhooddrawnyc',
            name='otherNeighborhood',
            field=models.CharField(default=b'', max_length=255, null=True, blank=True),
        ),
    ]
