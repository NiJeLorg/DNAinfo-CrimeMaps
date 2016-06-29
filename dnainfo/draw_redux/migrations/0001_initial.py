# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='neighborhoodNYC',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('dnaurl', models.CharField(default=b'', max_length=255)),
                ('name', models.CharField(default=b'', max_length=255)),
                ('county', models.CharField(default=b'', max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='NYCInOrOut',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now=True)),
                ('inOrOut', models.TextField(default=b'')),
                ('whatNeighborhood', models.ForeignKey(blank=True, to='draw_redux.neighborhoodNYC', null=True)),
            ],
        ),
    ]
