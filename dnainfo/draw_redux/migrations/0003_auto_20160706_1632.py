# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('draw_redux', '0002_auto_20160629_1204'),
    ]

    operations = [
        migrations.RenameField(
            model_name='nycinorout',
            old_name='inOrOut',
            new_name='added',
        ),
        migrations.AddField(
            model_name='nycinorout',
            name='removed',
            field=models.TextField(default=b''),
        ),
    ]
