# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0019_remove_chicookcountyrealestatedata_township'),
    ]

    operations = [
        migrations.RenameField(
            model_name='chicookcountyrealestatedata',
            old_name='building',
            new_name='buildingsize',
        ),
    ]
