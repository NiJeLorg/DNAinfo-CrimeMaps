# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('skyline', '0010_auto_20160921_1249'),
    ]

    operations = [
        migrations.AddField(
            model_name='nyc_dob_permit_issuance',
            name='scan_code',
            field=models.CharField(default=b'', max_length=255),
        ),
    ]
