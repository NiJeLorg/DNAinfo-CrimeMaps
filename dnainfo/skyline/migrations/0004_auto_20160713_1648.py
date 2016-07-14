# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('skyline', '0003_nycsponsoredbuidlings'),
    ]

    operations = [
        migrations.CreateModel(
            name='NYCSponsoredBuildings',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now=True)),
                ('buildingFootprint', models.TextField(default=b'')),
                ('buildingAddress', models.CharField(default=b'', max_length=255)),
                ('buildingText', models.CharField(default=b'', max_length=255)),
                ('buildingStories', models.IntegerField(default=0)),
                ('whereBuilding', models.ForeignKey(blank=True, to='skyline.neighborhoodNYC', null=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='nycsponsoredbuidlings',
            name='whereBuilding',
        ),
        migrations.DeleteModel(
            name='NYCSponsoredBuidlings',
        ),
    ]
