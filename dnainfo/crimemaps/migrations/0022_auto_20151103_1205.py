# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0021_chitrainsitstand'),
    ]

    operations = [
        migrations.AddField(
            model_name='chitrainsitstand',
            name='positionOneType',
            field=models.CharField(default=b'', max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='chitrainsitstand',
            name='positionThreeType',
            field=models.CharField(default=b'', max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='chitrainsitstand',
            name='positionTwoType',
            field=models.CharField(default=b'', max_length=255, null=True, blank=True),
        ),
    ]
