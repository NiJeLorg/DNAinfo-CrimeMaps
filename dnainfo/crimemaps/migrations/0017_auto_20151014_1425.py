# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0016_auto_20151014_1414'),
    ]

    operations = [
        migrations.RenameField(
            model_name='chizipzillowdata',
            old_name='monthyear',
            new_name='quarter',
        ),
    ]
