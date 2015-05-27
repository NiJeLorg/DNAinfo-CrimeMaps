import sys,os
from django.core.management.base import BaseCommand, CommandError
from crimemaps.models import *
import csv

"""
  Loads doitt data from automated CSV collection
"""
class Command(BaseCommand):
    
    def load_doitt_data(self):
        __location__ = '/home/nijel/dnainfo/scrapers/doitt/nyc-crime-map/data/'
        # open LIS_Beacon_Beach_WQdata.csv and dump into BeachWQSamples table
        with open(os.path.join(__location__, '02378420399528461352-17772055697785505571.csv'), 'rb') as f:
            reader = csv.reader(f)
            for row in reader:
                if row[0] != 'longitude': # Ignore the header row, import everything else
	                #use get or create to only create records for objects newly added to the spreadsheets
	                obj, created = doitt.objects.update_or_create(longitude=float(row[0]), latitude=float(row[1]), YR=int(row[2]), MO=int(row[3]), X=int(row[4]), Y=int(row[5]), TOT=int(row[6]), CR=row[7])


    def handle(self, *args, **options):
        print "Loading DoITT Data...."
        self.load_doitt_data()




