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
                # dateperiod is of the for MMM-MMM YYYY
                dateperiod = data['gsx$dateperiod']['$t']
                #spilt into three components
                dateperiod = dateperiod.split("-")
                dateperiodyear = dateperiod[1].split(" ")
                #using the first month create a date object that uses the first day of the quarter 
                dateperiod = dateperiod[0] + ' 1, ' + dateperiodyear[1]
                dateperiodObject = dateutil.parser.parse(dateperiod).date()

                if is_number(data['gsx$medianaskingrent']['$t'].replace(',','').replace('$','')):
                    medianaskingrent = float(data['gsx$medianaskingrent']['$t'].replace(',','').replace('$',''))
                else:
                    medianaskingrent = -99

                if is_number(data['gsx$medianaskingrentchcange']['$t'].replace('%','')):
                    medianaskingrentchcange = float(data['gsx$medianaskingrentchcange']['$t'].replace('%',''))
                else:
                    medianaskingrentchcange = -99


                #use get or create to only create records for objects newly added to the spreadsheets
                updated_values = {'medianaskingrent': medianaskingrent, 'medianaskingrentchcange': medianaskingrentchcange}
                obj, created = NYCStreetEasyRealEstateData.objects.update_or_create(area=data['gsx$area']['$t'], dateperiod=dateperiodObject, defaults=updated_values)



    def handle(self, *args, **options):
        print "Loading NYC Streeteasy Data...."
        self.load_data()
        print "Done."
 



