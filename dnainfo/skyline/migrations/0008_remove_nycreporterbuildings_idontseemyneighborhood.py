# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('skyline', '0007_nycreporterbuildings'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='nycreporterbuildings',
            name='iDontSeeMyNeighborhood',
        ),
    ]
