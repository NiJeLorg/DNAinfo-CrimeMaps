# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('skyline', '0004_auto_20160713_1648'),
    ]

    operations = [
        migrations.AddField(
            model_name='nycsponsoredbuildings',
            name='buildingImage',
            field=models.ImageField(default='', upload_to=b'img/%Y_%m_%d_%h_%M_%s'),
            preserve_default=False,
        ),
    ]
