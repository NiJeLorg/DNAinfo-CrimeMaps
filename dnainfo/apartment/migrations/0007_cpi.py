# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0006_auto_20160328_1707'),
    ]

    operations = [
        migrations.CreateModel(
            name='cpi',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('year', models.IntegerField(default=0)),
                ('cpi', models.FloatField(default=b'', max_length=255)),
            ],
        ),
    ]
