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
    
    def load_compstat_data(self):
        __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
        # open LIS_Beacon_Beach_WQdata.csv and dump into BeachWQSamples table
        with open(os.path.join(__location__, 'compstat_data.csv'), 'rb') as f:
            reader = csv.reader(f)
            for row in reader:
                if row[0] != 'precinct': # Ignore the header row, import everything else
                    # parse dates
                    SDparsed = dateutil.parser.parse(row[1])
                    EDparsed = dateutil.parser.parse(row[2])
                    SDObject = SDparsed.date()
                    EDObject = EDparsed.date()

                    instance = compstat()
                    instance.precinct = row[0]
                    instance.start_date = SDObject
                    instance.end_date = EDObject                    
                    instance.murder = int(row[3])
                    instance.rape = int(row[4])
                    instance.robbery = int(row[5])
                    instance.felony_assault = int(row[6])
                    instance.burglary = int(row[7])
                    instance.grand_larceny = int(row[8])
                    instance.grand_larceny_auto = int(row[9])
                    instance.total = int(row[10])
                    instance.transit = int(row[11])
                    instance.housing = int(row[12])
                    instance.petit_larceny = int(row[13])
                    instance.misdemeanor_assault = int(row[14])
                    instance.misdemeanor_sex_crimes = int(row[15])
                    instance.shooting_victims = int(row[16])
                    instance.shooting_inc = int(row[17])
                    instance.murder_last_year = int(row[18])
                    instance.rape_last_year = int(row[19])
                    instance.robbery_last_year = int(row[20])
                    instance.felony_assault_last_year = int(row[21])
                    instance.burglary_last_year = int(row[22])
                    instance.grand_larceny_last_year = int(row[23])
                    instance.grand_larceny_auto_last_year = int(row[24])
                    instance.total_last_year = int(row[25])
                    instance.transit_last_year = int(row[26])
                    instance.housing_last_year = int(row[27])
                    instance.petit_larceny_last_year = int(row[28])
                    instance.misdemeanor_assault_last_year = int(row[29])
                    instance.misdemeanor_sex_crimes_last_year = int(row[30])
                    instance.shooting_victims_last_year = int(row[31])
                    instance.shooting_inc_last_year = int(row[32])
                    instance.save()

    def handle(self, *args, **options):
        print "Loading Compstat Data...."
        self.load_compstat_data()




