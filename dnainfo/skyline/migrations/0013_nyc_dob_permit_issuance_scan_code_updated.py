# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('skyline', '0012_nyc_dob_permit_issuance_zoning_pdfs'),
    ]

    operations = [
        migrations.AddField(
            model_name='nyc_dob_permit_issuance',
            name='scan_code_updated',
            field=models.BooleanField(default=False),
        ),
    ]
