# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('skyline', '0011_nyc_dob_permit_issuance_scan_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='nyc_dob_permit_issuance',
            name='zoning_pdfs',
            field=models.FileField(null=True, upload_to=b'zoning_pdfs/', blank=True),
        ),
    ]
