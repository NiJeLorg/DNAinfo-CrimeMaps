import sys,os
from django.core.management.base import BaseCommand, CommandError
from crimemaps.models import *
import csv


"""
  Loads list for neighborhoods from CSV
"""
class Command(BaseCommand):

    def truncate_tables(self):
        neighborhoodDrawNYC.objects.all().delete()
        neighborhoodNYC.objects.all().delete()
    
    def load_neighborhoods(self):
        __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
        # open partner.csv and dump into Contact table
        with open(os.path.join(__location__, 'import_neighborhoods_nyc.csv'), 'rb') as f:
            reader = csv.reader(f)
            for row in reader:
                if row[0] != 'name': # Ignore the header row, import everything else
                    hood = neighborhoodNYC()
                    hood.dnaurl = row[0]
                    hood.name = row[1]
                    hood.save()


    def handle(self, *args, **options):
        print "Truncate Tables...."
        self.truncate_tables()
        print "Loading Neighborhoods...."
        self.load_neighborhoods()




