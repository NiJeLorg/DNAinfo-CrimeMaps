# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0024_nycschoolswatertesting'),
    ]

    operations = [
        migrations.AddField(
            model_name='nycschoolswatertesting',
            name='dt',
            field=models.CharField(default=b'', max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='nycschoolswatertesting',
            name='rt',
            field=models.CharField(default=b'', max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='nycschoolswatertesting',
            name='se',
            field=models.CharField(default=b'', max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='nycschoolswatertesting',
            name='st',
            field=models.CharField(default=b'', max_length=255, null=True, blank=True),
        ),
    ]
