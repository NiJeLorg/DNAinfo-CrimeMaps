# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0023_nyctrainsitstand'),
    ]

    operations = [
        migrations.CreateModel(
            name='NYCschoolsWaterTesting',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now=True)),
                ('lc', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('bc', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('ln', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('bn', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('add', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('cit', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('stc', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('zip', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('wtp', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('er', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('dohm', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('note', models.CharField(default=b'', max_length=255, null=True, blank=True)),
            ],
        ),
    ]
