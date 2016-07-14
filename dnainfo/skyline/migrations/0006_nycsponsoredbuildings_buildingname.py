# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('skyline', '0005_nycsponsoredbuildings_buildingimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='nycsponsoredbuildings',
            name='buildingName',
            field=models.CharField(default=b'', max_length=255),
        ),
    ]
