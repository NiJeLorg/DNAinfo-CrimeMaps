# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0003_auto_20150511_1829'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blotter',
            name='CrimeType',
            field=models.CharField(default=b'', max_length=255, null=True, blank=True),
        ),
    ]
