# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='neighborhoodNYC',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('dnaurl', models.CharField(default=b'', max_length=255)),
                ('name', models.CharField(default=b'', max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name='nycmyfirstapartment',
            name='whereMovedOther',
            field=models.CharField(default=b'', max_length=255, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='nycmyfirstapartment',
            name='whereMoved',
            field=models.ForeignKey(to='apartment.neighborhoodNYC'),
        ),
    ]
