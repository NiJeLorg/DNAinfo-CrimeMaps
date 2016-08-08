import sys,os
from django.core.management.base import BaseCommand, CommandError
from apartment_test_for_danny_nyc.models import *
import csv


"""
  Loads zillow median rent list price data from CSV
"""
class Command(BaseCommand):
    
    def load_zillow_data(self):
        # remove all data previously loaded
        zillowMedianRentListPrice.objects.all().delete()
        
        __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
        # open LIS_Beacon_Beach_WQdata.csv and dump into BeachWQSamples table
        with open(os.path.join(__location__, 'all_nyc.csv'), 'rb') as f:
            reader = csv.reader(f)
            for row in reader:
                if row[0] != 'RegionName': # Ignore the header row, import everything else
                    instance = zillowMedianRentListPrice()
                    instance.RegionName = row[0]
                    instance.City = row[1]
                    instance.State = row[2]
                    instance.Metro = row[3]
                    instance.CountyName = row[4]
                    instance.SizeRank = row[5]
                    instance.Cost = float(row[6])
                    instance.bedrooms = int(row[7])
                    instance.save()

    def handle(self, *args, **options):
        print "Loading Zillow Data...."
        self.load_zillow_data()




