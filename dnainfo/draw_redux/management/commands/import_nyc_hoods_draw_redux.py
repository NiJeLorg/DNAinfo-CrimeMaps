import sys,os
from django.core.management.base import BaseCommand, CommandError
from draw_redux.models import *
import csv


"""
  Loads nyc hoods from CSV
"""
class Command(BaseCommand):
    
    def load_nyc_hoods_data(self):
        #truncate NYCmyFirstApartment, which has a foreign key on neighborhoodNYC
        NYCInOrOut.objects.all().delete()
        neighborhoodNYC_redux.objects.all().delete()
        __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
        # open LIS_Beacon_Beach_WQdata.csv and dump into BeachWQSamples table
        with open(os.path.join(__location__, 'nyc_hoods.csv'), 'rb') as f:
            reader = csv.reader(f)
            for row in reader:
                if row[0] != 'dnaurl': # Ignore the header row, import everything else

                    instance = neighborhoodNYC_redux()
                    instance.dnaurl = row[0]
                    instance.name = row[1]
                    instance.county = row[2]
                    instance.save()

    def handle(self, *args, **options):
        print "Loading NYC Hoods...."
        self.load_nyc_hoods_data()




