# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0006_auto_20150609_1708'),
    ]

    operations = [
        migrations.CreateModel(
            name='neighborhoodDraw',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('neighborhoodLive', models.CharField(default=b'', max_length=255)),
                ('yearsLived', models.IntegerField(default=0)),
                ('drawnGeojson', models.TextField(default=b'')),
            ],
        ),
    ]
