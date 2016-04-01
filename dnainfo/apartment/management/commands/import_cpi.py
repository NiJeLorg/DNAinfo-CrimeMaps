import sys,os
from django.core.management.base import BaseCommand, CommandError
from apartment.models import *
import csv


"""
  Loads consumer price index from CSV
"""
class Command(BaseCommand):
    
    def load_cpi_data(self):
        __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
        # open LIS_Beacon_Beach_WQdata.csv and dump into BeachWQSamples table
        with open(os.path.join(__location__, 'cpi_data.csv'), 'rb') as f:
            reader = csv.reader(f)
            for row in reader:
                if row[0] != 'year': # Ignore the header row, import everything else

                    instance = cpi()
                    instance.year = int(row[0])
                    instance.cpi = float(row[1])
                    instance.save()

    def handle(self, *args, **options):
        print "Loading CPI Data...."
        self.load_cpi_data()




