# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0013_chicookcountyrealestatedata_chizipzillowdata_nycstreeteasyrealestatedata'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chicookcountyrealestatedata',
            name='amount',
            field=models.FloatField(default=0, null=True, blank=True),
        ),
    ]
