# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crimemaps', '0015_auto_20150929_1449'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='nycstreeteasyrealestatedata',
            name='medianaskingprice',
        ),
        migrations.RemoveField(
            model_name='nycstreeteasyrealestatedata',
            name='medianclosingprice',
        ),
        migrations.RemoveField(
            model_name='nycstreeteasyrealestatedata',
            name='medianppsf',
        ),
        migrations.RemoveField(
            model_name='nycstreeteasyrealestatedata',
            name='medianppsfchange',
        ),
        migrations.RemoveField(
            model_name='nycstreeteasyrealestatedata',
            name='totalclosings',
        ),
        migrations.RemoveField(
            model_name='nycstreeteasyrealestatedata',
            name='totalrentalinventory',
        ),
        migrations.RemoveField(
            model_name='nycstreeteasyrealestatedata',
            name='totalsaleclosings',
        ),
        migrations.RemoveField(
            model_name='nycstreeteasyrealestatedata',
            name='totalsalesinventory',
        ),
        migrations.RemoveField(
            model_name='nycstreeteasyrealestatedata',
            name='unittype',
        ),
    ]
