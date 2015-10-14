# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0017_auto_20151014_1425'),
    ]

    operations = [
        migrations.RenameField(
            model_name='chicookcountyrealestatedata',
            old_name='city',
            new_name='classNum',
        ),
        migrations.RemoveField(
            model_name='chicookcountyrealestatedata',
            name='zip',
        ),
        migrations.AddField(
            model_name='chicookcountyrealestatedata',
            name='building',
            field=models.IntegerField(default=0, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='chicookcountyrealestatedata',
            name='description',
            field=models.TextField(default=b'', null=True, blank=True),
        ),
        migrations.AddField(
            model_name='chicookcountyrealestatedata',
            name='lotsize',
            field=models.IntegerField(default=0, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='chicookcountyrealestatedata',
            name='pricepersqft',
            field=models.FloatField(default=0, null=True, blank=True),
        ),
    ]
