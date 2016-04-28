# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0009_neighborhoodnyc_borough'),
    ]

    operations = [
        migrations.RenameField(
            model_name='neighborhoodnyc',
            old_name='borough',
            new_name='county',
        ),
    ]
