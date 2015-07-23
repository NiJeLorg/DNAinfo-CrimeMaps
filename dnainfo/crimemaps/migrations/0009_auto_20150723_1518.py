# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0008_auto_20150723_1510'),
    ]

    operations = [
        migrations.CreateModel(
            name='neighborhoodCHI',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('dnaurl', models.CharField(default=b'', max_length=255)),
                ('name', models.CharField(default=b'', max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='neighborhoodDrawNYC',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('yearsLived', models.IntegerField(default=0)),
                ('drawnGeojson', models.TextField(default=b'')),
            ],
        ),
        migrations.CreateModel(
            name='neighborhoodNYC',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('dnaurl', models.CharField(default=b'', max_length=255)),
                ('name', models.CharField(default=b'', max_length=255)),
            ],
        ),
        migrations.RenameModel(
            old_name='neighborhoodDraw',
            new_name='neighborhoodDrawCHI',
        ),
        migrations.AlterField(
            model_name='neighborhooddrawchi',
            name='neighborhoodLive',
            field=models.ForeignKey(to='crimemaps.neighborhoodCHI'),
        ),
        migrations.AddField(
            model_name='neighborhooddrawnyc',
            name='neighborhoodLive',
            field=models.ForeignKey(to='crimemaps.neighborhoodNYC'),
        ),
        migrations.DeleteModel(
            name='neighborhood',
        ),
    ]
