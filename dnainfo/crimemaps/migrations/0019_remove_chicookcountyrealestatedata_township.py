# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0018_auto_20151014_1506'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chicookcountyrealestatedata',
            name='township',
        ),
    ]
