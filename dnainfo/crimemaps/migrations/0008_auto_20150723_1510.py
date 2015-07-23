# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0007_neighborhooddraw'),
    ]

    operations = [
        migrations.CreateModel(
            name='neighborhood',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('dnaurl', models.CharField(default=b'', max_length=255)),
                ('name', models.CharField(default=b'', max_length=255)),
                ('city', models.CharField(default=b'', max_length=255)),
            ],
        ),
        migrations.AlterField(
            model_name='neighborhooddraw',
            name='neighborhoodLive',
            field=models.ForeignKey(to='crimemaps.neighborhood'),
        ),
    ]
