# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('draw_redux', '0003_auto_20160706_1632'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nycinorout',
            name='added',
            field=models.TextField(default=b'', null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='nycinorout',
            name='removed',
            field=models.TextField(default=b'', null=True, blank=True),
        ),
    ]
