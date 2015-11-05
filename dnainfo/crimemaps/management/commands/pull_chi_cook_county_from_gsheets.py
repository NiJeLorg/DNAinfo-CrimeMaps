import sys,os
from django.core.management.base import BaseCommand, CommandError
from crimemaps.models import *
import urllib, json
# for date parsing
import datetime
import time
from datetime import date
from django.utils import timezone
import dateutil.parser
import dateutil.tz
import pytz
from django.db import connection


"""
  Loads chicago cook county data from the google spreadsheets API
"""

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

class Command(BaseCommand):

    def truncate_table(self):
    	cursor = connection.cursor()
    	CHICookCountyRealEstateData.objects.all().delete()
    	CHICookCountyRealEstateData.objects.raw("ALTER TABLE crimemaps_chicookcountyrealestatedata AUTO_INCREMENT = 0")

    def load_data(self):
        keys = ['1Z-zzZ7qvjkpnz1683Yq4ibigVQ5sIeExj9I3xpTty3w']
        base_url = 'https://spreadsheets.google.com/feeds/list/'
        params = '/1/public/values?alt=json'

        for counter, key in enumerate(keys):
            url = base_url + key + params
            response = urllib.urlopen(url)
            data = json.loads(response.read())
            for data in data['feed']['entry']:
                #get data ready to be added
                if is_number(data['gsx$doc']['$t']):
                    doc = int(data['gsx$doc']['$t'])
                else:
                    doc = -99

                if is_number(data['gsx$buildingsize']['$t']):
                    buildingsize = int(data['gsx$buildingsize']['$t'])
                else:
                    buildingsize = -99

                if is_number(data['gsx$lotsize']['$t']):
                    lotsize = int(data['gsx$lotsize']['$t'])
                else:
                    lotsize = -99

                if is_number(data['gsx$latitude']['$t']):
                    latitude = float(data['gsx$latitude']['$t'])
                else:
                    latitude = 0

                if is_number(data['gsx$longitude']['$t']):
                    longitude = float(data['gsx$longitude']['$t'])
                else:
                    longitude = 0

                if is_number(data['gsx$amount']['$t'].replace(',','').replace('$','')):
                    amount = float(data['gsx$amount']['$t'].replace(',','').replace('$',''))
                else:
                    amount = -99

                if is_number(data['gsx$pricepersqft']['$t'].replace(',','').replace('$','')):
                    pricepersqft = float(data['gsx$pricepersqft']['$t'].replace(',','').replace('$',''))
                else:
                    pricepersqft = -99

                recorded = data['gsx$recorded']['$t']
                recordedObject = dateutil.parser.parse(recorded).date()

                executed = data['gsx$executed']['$t']
                executedObject = dateutil.parser.parse(executed).date()

                #use get or create to only create records for objects newly added to the spreadsheets
                updated_values = {'doc':doc, 'classNum':data['gsx$class']['$t'], 'description': data['gsx$description']['$t'], 'buildingsize': buildingsize, 'lotsize': lotsize, 'fulladdress': data['gsx$fulladdress']['$t'], 'latitude': latitude, 'longitude': longitude, 'amount': amount, 'recorded': recordedObject, 'executed': executedObject, 'seller': data['gsx$seller']['$t'], 'buyer': data['gsx$buyer']['$t'], 'address': data['gsx$address']['$t'], 'unit': data['gsx$unit']['$t'], 'pricepersqft': pricepersqft}
                obj, created = CHICookCountyRealEstateData.objects.update_or_create(pin=data['gsx$pin']['$t'], defaults=updated_values)



    def handle(self, *args, **options):
        print "Truncate Table...."
    	self.truncate_table()
        print "Loading Chicago Cook County Data...."
        self.load_data()
        print "Done."
 



