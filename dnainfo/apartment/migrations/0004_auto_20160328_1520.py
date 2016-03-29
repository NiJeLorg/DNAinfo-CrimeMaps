# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0003_auto_20160328_0012'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='nycmyfirstapartment',
            name='whereMovedOther',
        ),
        migrations.AddField(
            model_name='nycmyfirstapartment',
            name='iDontSeeMyNeighborhood',
            field=models.NullBooleanField(),
        ),
    ]
