import sys,os
from django.core.management.base import BaseCommand, CommandError
from crimemaps.models import *
import csv
# for date parsing
import datetime
import time
import dateutil.parser


"""
  Loads compstat from CSV
"""
class Command(BaseCommand):
    
    def load_doitt_data(self):
        __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
        # open LIS_Beacon_Beach_WQdata.csv and dump into BeachWQSamples table
        with open(os.path.join(__location__, 'doitt_data_all.csv'), 'rb') as f:
            reader = csv.reader(f)
            for row in reader:
                if row[0] != 'longitude': # Ignore the header row, import everything else
                    # parse dates
                    instance = doitt()
                    instance.longitude = float(row[0])
                    instance.latitude = float(row[1])
                    instance.YR = int(row[2])                  
                    instance.MO = int(row[3])
                    instance.X = int(row[4])
                    instance.Y = int(row[5])
                    instance.TOT = int(row[6])
                    instance.CR = row[7]
                    instance.save()

    def handle(self, *args, **options):
        print "Loading DoITT Data...."
        self.load_doitt_data()




