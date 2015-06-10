# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0005_chishootings'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chishootings',
            name='id',
        ),
        migrations.AddField(
            model_name='chishootings',
            name='ID',
            field=models.IntegerField(default=0, serialize=False, primary_key=True),
            preserve_default=False,
        ),
    ]
