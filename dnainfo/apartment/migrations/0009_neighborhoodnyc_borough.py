# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0008_zillowmedianrentlistprice'),
    ]

    operations = [
        migrations.AddField(
            model_name='neighborhoodnyc',
            name='borough',
            field=models.CharField(default=b'', max_length=255),
        ),
    ]
