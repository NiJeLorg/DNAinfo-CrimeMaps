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
            name='NYCskyline',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now=True)),
                ('iDontSeeMyNeighborhood', models.BooleanField(default=False)),
                ('buildingFootprint', models.TextField(default=b'')),
                ('buildingAddress', models.CharField(default=b'', max_length=255)),
                ('buildingBBL', models.CharField(default=b'', max_length=255)),
                ('buildingStories', models.IntegerField(default=0)),
                ('whereBuilding', models.ForeignKey(blank=True, to='skyline.neighborhoodNYC', null=True)),
            ],
        ),
    ]
