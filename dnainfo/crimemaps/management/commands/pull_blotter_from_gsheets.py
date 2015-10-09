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
  Loads blotter data from google spreadsheets API
"""
class Command(BaseCommand):
    
    def load_blotter_data(self):
        keys = ['1NISlql8CXM-eVmJikOiY0ZF2MEaVYcZYTbIFU_gZ3oo', '1DJ2lUCY07XAxCn9Wn-kHBC83zNQhE5XEzeFHJ23Qg9M', '1zsPX6xKUaXwtzwzyLqJG_hCqMW6TNx3Gxi95VLSXvUw', '1cXZuk5IBNH4DOGG8XLZMr7LHpbYidmGRpm0sqB2cWcc', '18lUQ173090JpCGHWWjw6m87Yy1rxFxUuCXJlGrNa9xg', '1SjMXehyftQ8ESCi1Bl0IX9PY-zZgj4FVIBGlwYoN2Pc', '1_z9c0LUeSGZiVML3nP7g_nxrtcEmGfdVKlOTJCTtrEQ', '1UbhLaPDFE5NICYrlv5YOImZIoN5WTKJ9oIijSvCIjG0', '1Pj3AJk0NU6_rAbykgjTF5btlhHKZRq8eo8eCy_GijVw', '1tDrqnTn07Y4y2-vWKuxSiES45136KkRd8Kk1pd4h78s', '1sDE-lHe-RGgoDFTuB-otkgSvhQBE8t3To3dscrpmBIc', '1bhUNdCnUbUDWaTick1VGr1R1iD2g8U16aJxAvvZkotg']
        precincts = [10, 13, 1, 20, 25, 40, 6, 78, 7, 90, 94, 0]
        base_url = 'https://spreadsheets.google.com/feeds/list/'
        params = '/1/public/values?alt=json'

        for counter, key in enumerate(keys):
            url = base_url + key + params
            response = urllib.urlopen(url)
            data = json.loads(response.read())
            for data in data['feed']['entry']:
                #get data ready to be added
                BlotterWeekparsed = dateutil.parser.parse(data['gsx$blotterweek']['$t'])
                JSDateparsed = dateutil.parser.parse(data['gsx$jsdate']['$t'])
                BlotterWeekObject = BlotterWeekparsed.date()
                JSDateObject = JSDateparsed.date()
                #try to add date time 
                notz = dateutil.parser.parse(data['gsx$datetime']['$t'], ignoretz=True)
                DateTimeObject = pytz.timezone("America/New_York").localize(notz, is_dst=None)
                print DateTimeObject

                if hasattr(data, 'gsx$arrest'):
                    if data['gsx$arrest']['$t'] == 'Yes':
                        arrest = True
                    elif data['gsx$arrest']['$t'] == 'No':
                        arrest = False
                    else:
                        arrest = None
                else:
                    arrest = None

                if hasattr(data, 'gsx$crimetype'):
                    crimeType = data['gsx$crimetype']['$t']
                else:
                    crimeType = None

                if data['gsx$precinct']['$t'] != '' and data['gsx$precinct']['$t'] != '10th' and data['gsx$precinct']['$t'] != '13th' and data['gsx$precinct']['$t'] != '1st' and data['gsx$precinct']['$t'] != '20th' and data['gsx$precinct']['$t'] != '25th' and data['gsx$precinct']['$t'] != '40th' and data['gsx$precinct']['$t'] != '6th' and data['gsx$precinct']['$t'] != '78th' and data['gsx$precinct']['$t'] != '7th' and data['gsx$precinct']['$t'] != '90th' and data['gsx$precinct']['$t'] != '94th':
                    precinctNum = int(data['gsx$precinct']['$t'])
                else:
                    precinctNum = precincts[counter]

                if data['gsx$latitude']['$t'] == '':
                    lat = 0                    
                else:
                    lat = float(data['gsx$latitude']['$t'])

                if data['gsx$latitude']['$t'] == '':
                    lon = 0                    
                else:
                    lon = float(data['gsx$longitude']['$t'])


                #use get or create to only create records for objects newly added to the spreadsheets
                updated_values = {'BlotterWeek':BlotterWeekObject, 'CrimeType':crimeType, 'PoliceSaid':data['gsx$policesaid']['$t'], 'Arrest': arrest, 'Latitude':lat, 'Longitude':lon, 'JSDate': JSDateObject }
                obj, created = blotter.objects.update_or_create(Precinct=precinctNum, Address=data['gsx$address']['$t'], DateTime=DateTimeObject,defaults=updated_values)


    def load_blotter_data_consolidated_sheet(self):
        keys = ['1WZsIEkHVy8YUrfYaBEkk3z0xy1bikYySqNcXE8NRxMY']
        base_url = 'https://spreadsheets.google.com/feeds/list/'
        params = '/1/public/values?alt=json'

        for counter, key in enumerate(keys):
            url = base_url + key + params
            response = urllib.urlopen(url)
            data = json.loads(response.read())
            for data in data['feed']['entry']:
                #get data ready to be added
                dateTime = data['gsx$date']['$t'] + ' ' + data['gsx$time']['$t']
                notz = dateutil.parser.parse(dateTime, ignoretz=True)
                DateTimeObject = pytz.timezone("America/New_York").localize(notz, is_dst=None)
                print DateTimeObject
                justDate = DateTimeObject.date()

                if hasattr(data, 'gsx$arrest'):
                    if data['gsx$arrests']['$t'] == 'Yes':
                        arrest = True
                    elif data['gsx$arrests']['$t'] == 'No':
                        arrest = False
                    else:
                        arrest = None
                else:
                    arrest = None

                if hasattr(data, 'gsx$crimetype'):
                    crimeType = data['gsx$crimetype']['$t']
                else:
                    crimeType = None

                if data['gsx$precinct']['$t'] != '':
                    precinctNum = int(data['gsx$precinct']['$t'])
                else:
                    precinctNum = 0

                if data['gsx$latitude']['$t'] == '':
                    lat = 0                    
                else:
                    lat = float(data['gsx$latitude']['$t'])

                if data['gsx$latitude']['$t'] == '':
                    lon = 0                    
                else:
                    lon = float(data['gsx$longitude']['$t'])

                #use get or create to only create records for objects newly added to the spreadsheets
                updated_values = {'BlotterWeek':justDate, 'CrimeType':crimeType, 'PoliceSaid':data['gsx$policesaid']['$t'], 'Arrest': arrest, 'Latitude':lat, 'Longitude':lon, 'JSDate': justDate }
                obj, created = blotter.objects.update_or_create(Precinct=precinctNum, Address=data['gsx$address']['$t'], DateTime=DateTimeObject,defaults=updated_values)


    def handle(self, *args, **options):
        print "Loading Blotter Data...."
        #self.load_blotter_data()
        print "Loading Blotter Data from the Consolidated Sheet...."
        self.load_blotter_data_consolidated_sheet()
        print "Done."




