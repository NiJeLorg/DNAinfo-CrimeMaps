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
  Loads chicago zillow data from the google spreadsheets API
"""

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

class Command(BaseCommand):

    def load_data(self):
        keys = ['1ZhFYpQRQBfRsD2HXb9t7L8cb8gbJn-tYw4Qb6f2JLfI']
        base_url = 'https://spreadsheets.google.com/feeds/list/'
        params = '/1/public/values?alt=json'

        for counter, key in enumerate(keys):
            url = base_url + key + params
            response = urllib.urlopen(url)
            data = json.loads(response.read())
            for data in data['feed']['entry']:
                #get data ready to be added
                dateTime = data['gsx$monthyear']['$t']
                dateTime = dateTime.split("/")
                dateTime = dateTime[1] + '-' + dateTime[0] + '-1'
                DateTimeObject = dateutil.parser.parse(dateTime).date()

                if is_number(data['gsx$zip']['$t']):
                    zip = int(data['gsx$zip']['$t'])
                else:
                    zip = -99

                if is_number(data['gsx$population2013censusestimate']['$t'].replace(',','')):
                    population2013censusestimate = int(data['gsx$population2013censusestimate']['$t'].replace(',',''))
                else:
                    population2013censusestimate = -99

                if is_number(data['gsx$percentlivinginsamehouseoneyearago2013censusestimate']['$t'].replace('%','')):
                    percentlivinginsamehouseoneyearago2013censusestimate = float(data['gsx$percentlivinginsamehouseoneyearago2013censusestimate']['$t'].replace('%',''))
                else:
                    percentlivinginsamehouseoneyearago2013censusestimate = -99

                if is_number(data['gsx$medianhouseholdincome2013censusestimate']['$t'].replace(',','').replace('$','')):
                    medianhouseholdincome2013censusestimate = float(data['gsx$medianhouseholdincome2013censusestimate']['$t'].replace(',','').replace('$',''))
                else:
                    medianhouseholdincome2013censusestimate = -99

                if is_number(data['gsx$changeinvaluesquarefootoverpreviousyear']['$t'].replace('%','')):
                    changeinvaluesquarefootoverpreviousyear = float(data['gsx$changeinvaluesquarefootoverpreviousyear']['$t'].replace('%',''))
                else:
                    changeinvaluesquarefootoverpreviousyear = -99

                if is_number(data['gsx$changeavg.rentsq.footoverpreviousyear']['$t'].replace('%','')):
                    changeavgrentsqfootoverpreviousyear = float(data['gsx$changeavg.rentsq.footoverpreviousyear']['$t'].replace('%',''))
                else:
                    changeavgrentsqfootoverpreviousyear = -99

                if is_number(data['gsx$percentofhomessoldinpastyear']['$t'].replace('%','')):
                    percentofhomessoldinpastyear = float(data['gsx$percentofhomessoldinpastyear']['$t'].replace('%',''))
                else:
                    percentofhomessoldinpastyear = -99

                if is_number(data['gsx$estimatedvaluesquarefoot']['$t'].replace(',','').replace('$','')):
                    estimatedvaluesquarefoot = float(data['gsx$estimatedvaluesquarefoot']['$t'].replace(',','').replace('$',''))
                else:
                    estimatedvaluesquarefoot = -99

                if is_number(data['gsx$estimatedvalueofallhomes']['$t'].replace(',','').replace('$','')):
                    estimatedvalueofallhomes = float(data['gsx$estimatedvalueofallhomes']['$t'].replace(',','').replace('$',''))
                else:
                    estimatedvalueofallhomes = -99

                if is_number(data['gsx$avg.rentsq.foot']['$t'].replace(',','').replace('$','')):
                    avgrentsqfoot = float(data['gsx$avg.rentsq.foot']['$t'].replace(',','').replace('$',''))
                else:
                    avgrentsqfoot = -99

                if is_number(data['gsx$medianlistprice']['$t'].replace(',','').replace('$','')):
                    medianlistprice = float(data['gsx$medianlistprice']['$t'].replace(',','').replace('$',''))
                else:
                    medianlistprice = -99

                if is_number(data['gsx$mediansaleprice']['$t'].replace(',','').replace('$','')):
                    mediansaleprice = float(data['gsx$mediansaleprice']['$t'].replace(',','').replace('$',''))
                else:
                    mediansaleprice = -99


                #use get or create to only create records for objects newly added to the spreadsheets
                updated_values = {'neighborhoodscovered':data['gsx$neighborhoodscovered']['$t'], 'population2013censusestimate':population2013censusestimate, 'percentlivinginsamehouseoneyearago2013censusestimate':percentlivinginsamehouseoneyearago2013censusestimate, 'medianhouseholdincome2013censusestimate':medianhouseholdincome2013censusestimate, 'changeinvaluesquarefootoverpreviousyear':changeinvaluesquarefootoverpreviousyear, 'changeavgrentsqfootoverpreviousyear':changeavgrentsqfootoverpreviousyear, 'percentofhomessoldinpastyear':percentofhomessoldinpastyear, 'estimatedvaluesquarefoot':estimatedvaluesquarefoot, 'estimatedvalueofallhomes':estimatedvalueofallhomes, 'avgrentsqfoot':avgrentsqfoot, 'medianlistprice': medianlistprice, 'mediansaleprice':mediansaleprice }
                obj, created = CHIZIPZillowData.objects.update_or_create(monthyear=DateTimeObject, zip=zip, defaults=updated_values)



    def handle(self, *args, **options):
        print "Loading Chicago Zillow Data...."
        self.load_data()
        print "Done."
 



