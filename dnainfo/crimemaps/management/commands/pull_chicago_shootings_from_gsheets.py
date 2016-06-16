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
  Loads chicago shootings data from google spreadsheets API
"""
class Command(BaseCommand):

    def load_chishootings_data(self):
        keys = ['1oDjdC8gg9wh0gq9aRBFUoxq1h4bdR6k85IGUfPqYeNk']
        base_url = 'https://spreadsheets.google.com/feeds/list/'
        params = '/1/public/values?alt=json'

        for counter, key in enumerate(keys):
            url = base_url + key + params
            response = urllib.urlopen(url)
            data = json.loads(response.read())
            for data in data['feed']['entry']:
                #get data ready to be added
                dateTime = data['gsx$date']['$t']
                notz = dateutil.parser.parse(dateTime, ignoretz=True)
                DateTimeObject = pytz.timezone("US/Central").localize(notz)

                if data['gsx$id']['$t'] != '':
                    ID = int(data['gsx$id']['$t'])
                else:
                    ID = 0

                if data['gsx$lat']['$t'] == '':
                    lat = 0                    
                else:
                    lat = float(data['gsx$lat']['$t'])

                if data['gsx$long']['$t'] == '':
                    lon = 0                    
                else:
                    lon = float(data['gsx$long']['$t'])

                if data['gsx$homvics']['$t'] != '':
                    HomVics = int(data['gsx$homvics']['$t'])
                else:
                    HomVics = 0

                if data['gsx$othershoo']['$t'] != '':
                    OtherShoo = int(data['gsx$othershoo']['$t'])
                else:
                    OtherShoo = 0

                if data['gsx$totalvict']['$t'] != '':
                    TotalVict = int(data['gsx$totalvict']['$t'])
                else:
                    TotalVict = 0

                if data['gsx$month']['$t'] != '':
                    Month = int(data['gsx$month']['$t'])
                else:
                    Month = 0

                if data['gsx$day']['$t'] != '':
                    Day = int(data['gsx$day']['$t'])
                else:
                    Day = 0

                if data['gsx$year']['$t'] != '':
                    Year = int(data['gsx$year']['$t'])
                else:
                    Year = 0

                if data['gsx$hour']['$t'] != '':
                    Hour = int(data['gsx$hour']['$t'])
                else:
                    Hour = 0

                if data['gsx$communityno']['$t'] != '':
                    CommunityNo = int(data['gsx$communityno']['$t'])
                else:
                    CommunityNo = 0

                #use get or create to only create records for objects newly added to the spreadsheets
                updated_values = {'Date':DateTimeObject, 'Address':data['gsx$address']['$t'], 'Lat': lat, 'Long': lon, 'RD': data['gsx$rd']['$t'], 'District': data['gsx$district']['$t'], 'Beat': data['gsx$beat']['$t'], 'IUCR': data['gsx$iucr']['$t'], 'Location': data['gsx$location']['$t'], 'Status': data['gsx$status']['$t'], 'Domestic': data['gsx$domestic']['$t'], 'HomVics': HomVics, 'OtherShoo': OtherShoo, 'TotalVict': TotalVict, 'Month': Month, 'Day': Day, 'Year': Year, 'Hour': Hour, 'DayOfWeek': data['gsx$dayofweek']['$t'], 'MonthYear': data['gsx$my']['$t'], 'URL': data['gsx$url']['$t'], 'Notes': data['gsx$notes']['$t'], 'Neighborhood': data['gsx$neighborhood']['$t'], 'CommunityNo': CommunityNo, 'CommunityName': data['gsx$communityname']['$t'], 'PoliceInvolved': data['gsx$police-involved']['$t']}
                obj, created = chiShootings.objects.update_or_create(ID=ID, defaults=updated_values)



    def handle(self, *args, **options):
        print "Loading Chicago Shootings Data...."
        self.load_chishootings_data()
        print "Done."
 



