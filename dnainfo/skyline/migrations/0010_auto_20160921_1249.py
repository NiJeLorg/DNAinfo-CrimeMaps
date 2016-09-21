# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('skyline', '0009_nyc_dob_permit_issuance'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nyc_dob_permit_issuance',
            name='expiration_date',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='nyc_dob_permit_issuance',
            name='filing_date',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='nyc_dob_permit_issuance',
            name='issuance_date',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='nyc_dob_permit_issuance',
            name='job_start_date',
            field=models.DateField(null=True, blank=True),
        ),
    ]
