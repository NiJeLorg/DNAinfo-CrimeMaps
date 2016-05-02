import sys,os
from django.core.management.base import BaseCommand, CommandError
from apartment_chi.models import *
import csv


"""
  Loads CHI hoods from CSV
"""
class Command(BaseCommand):
    
    def load_CHI_hoods_data(self):
        #truncate CHImyFirstApartment, which has a foreign key on neighborhoodCHI
        CHImyFirstApartment.objects.all().delete()
        neighborhoodCHI.objects.all().delete()
        __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
        # open LIS_Beacon_Beach_WQdata.csv and dump into BeachWQSamples table
        with open(os.path.join(__location__, 'chi_hoods.csv'), 'rb') as f:
            reader = csv.reader(f)
            for row in reader:
                if row[0] != 'dnaurl': # Ignore the header row, import everything else

                    instance = neighborhoodCHI()
                    instance.dnaurl = row[0]
                    instance.name = row[1]
                    instance.county = row[2]
                    instance.save()

    def handle(self, *args, **options):
        print "Loading CHI Hoods...."
        self.load_CHI_hoods_data()




