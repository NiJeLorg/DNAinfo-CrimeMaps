# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0009_auto_20150723_1518'),
    ]

    operations = [
        migrations.AddField(
            model_name='neighborhooddrawchi',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 28, 20, 40, 31, 537347, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='neighborhooddrawnyc',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 28, 20, 40, 36, 30002, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
    ]
