import sys,os
from django.core.management.base import BaseCommand, CommandError
from crimemaps.models import *
import csv
# for date parsing
import datetime
import time
from django.utils import timezone
import dateutil.parser


"""
  Loads blotter data from CSV
"""
class Command(BaseCommand):
    
    def load_blotter_data(self):
        __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
        # open LIS_Beacon_Beach_WQdata.csv and dump into BeachWQSamples table
        with open(os.path.join(__location__, 'blotter_data.csv'), 'rb') as f:
            reader = csv.reader(f)
            for row in reader:
                if row[0] != 'Precinct': # Ignore the header row, import everything else
                    print row[2]
                    # parse dates
                    DateTimeparsed = dateutil.parser.parse(row[2])
                    BlotterWeekparsed = dateutil.parser.parse(row[3])
                    JSDateparsed = dateutil.parser.parse(row[9])
                    DateTimeObject = timezone.make_aware(DateTimeparsed)
                    BlotterWeekObject = BlotterWeekparsed.date()
                    JSDateObject = JSDateparsed.date()

                    if row[6] == 'Yes':
                        arrest = True
                    elif row[6] == 'No':
                        arrest = False
                    else:
                        arrest = None

                    instance = blotter()
                    instance.Precinct = int(row[0])
                    instance.Address = row[1]
                    instance.DateTime = DateTimeObject                   
                    instance.BlotterWeek = BlotterWeekObject
                    instance.CrimeType = row[4]
                    instance.PoliceSaid = row[5]
                    instance.Arrest = arrest
                    instance.Latitude = float(row[7])
                    instance.Longitude = float(row[8])
                    instance.JSDate = JSDateObject
                    instance.save()

    def handle(self, *args, **options):
        print "Loading Blotter Data...."
        self.load_blotter_data()




