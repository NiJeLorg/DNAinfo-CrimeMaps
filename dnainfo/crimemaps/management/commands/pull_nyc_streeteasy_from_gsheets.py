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


"""
  Loads NY streeteasy data from the google spreadsheets API
"""

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

class Command(BaseCommand):

    def load_data(self):
        keys = ['1k13n0PnhEtGw1Eyrt2XM4Y9yQHlhp0lZKOJ-fnB6gkI']
        base_url = 'https://spreadsheets.google.com/feeds/list/'
        params = '/1/public/values?alt=json'

        for counter, key in enumerate(keys):
            url = base_url + key + params
            response = urllib.urlopen(url)
            data = json.loads(response.read())
            for data in data['feed']['entry']:
                #get data ready to be added
                dateperiod = data['gsx$dateperiod']['$t']
                dateperiod = dateperiod.split("/")
                dateperiod = dateperiod[1] + '-' + dateperiod[0] + '-1'
                dateperiodObject = dateutil.parser.parse(dateperiod).date()

                if is_number(data['gsx$medianaskingprice']['$t'].replace(',','').replace('$','')):
                    medianaskingprice = float(data['gsx$medianaskingprice']['$t'].replace(',','').replace('$',''))
                else:
                    medianaskingprice = -99

                if is_number(data['gsx$totalsalesinventory']['$t'].replace(',','')):
                    totalsalesinventory = int(data['gsx$totalsalesinventory']['$t'].replace(',',''))
                else:
                    totalsalesinventory = -99

                if is_number(data['gsx$medianaskingrent']['$t'].replace(',','').replace('$','')):
                    medianaskingrent = float(data['gsx$medianaskingrent']['$t'].replace(',','').replace('$',''))
                else:
                    medianaskingrent = -99

                if is_number(data['gsx$totalrentalinventory']['$t'].replace(',','')):
                    totalrentalinventory = int(data['gsx$totalrentalinventory']['$t'].replace(',',''))
                else:
                    totalrentalinventory = -99

                if is_number(data['gsx$medianclosingprice']['$t'].replace(',','').replace('$','')):
                    medianclosingprice = float(data['gsx$medianclosingprice']['$t'].replace(',','').replace('$',''))
                else:
                    medianclosingprice = -99

                if is_number(data['gsx$totalclosings']['$t'].replace(',','')):
                    totalclosings = int(data['gsx$totalclosings']['$t'].replace(',',''))
                else:
                    totalclosings = -99

                if is_number(data['gsx$medianppsf']['$t'].replace(',','').replace('$','')):
                    medianppsf = float(data['gsx$medianppsf']['$t'].replace(',','').replace('$',''))
                else:
                    medianppsf = -99

                if is_number(data['gsx$totalsaleclosings']['$t'].replace(',','')):
                    totalsaleclosings = int(data['gsx$totalsaleclosings']['$t'].replace(',',''))
                else:
                    totalsaleclosings = -99

                if is_number(data['gsx$medianaskingrentchcange']['$t'].replace('%','')):
                    medianaskingrentchcange = float(data['gsx$medianaskingrentchcange']['$t'].replace('%',''))
                else:
                    medianaskingrentchcange = -99

                if is_number(data['gsx$medianppsfchange']['$t'].replace('%','')):
                    medianppsfchange = float(data['gsx$medianppsfchange']['$t'].replace('%',''))
                else:
                    medianppsfchange = -99


                #use get or create to only create records for objects newly added to the spreadsheets
                updated_values = {'unittype': data['gsx$unittype']['$t'], 'medianaskingprice': medianaskingprice, 'totalsalesinventory': totalsalesinventory, 'medianaskingrent': medianaskingrent, 'totalrentalinventory': totalrentalinventory, 'medianclosingprice': medianclosingprice, 'totalclosings': totalclosings, 'medianppsf': medianppsf, 'totalsaleclosings': totalsaleclosings, 'medianaskingrentchcange': medianaskingrentchcange, 'medianppsfchange': medianppsfchange }
                obj, created = NYCStreetEasyRealEstateData.objects.update_or_create(area=data['gsx$area']['$t'], dateperiod=dateperiodObject, defaults=updated_values)



    def handle(self, *args, **options):
        print "Loading NYC Streeteasy Data...."
        self.load_data()
        print "Done."
 



