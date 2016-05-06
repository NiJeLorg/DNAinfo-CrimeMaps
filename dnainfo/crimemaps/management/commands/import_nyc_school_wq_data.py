import sys,os
from django.core.management.base import BaseCommand, CommandError
from crimemaps.models import *
import urllib, csv, xmltodict


"""
  Loads XML data from NYC schools water quality database
"""
class Command(BaseCommand):
    
    def load_wq_data(self):
        base_url = 'http://schools.nyc.gov/webservices/wt/watertesting.asmx/GetTestLocations?LocationCode='
        __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
        # open partner.csv and dump into Contact table
        with open(os.path.join(__location__, 'convertcsv.csv'), 'rb') as f:
            reader = csv.reader(f)
            for row in reader:
                if row[0] != 'name': # Ignore the header row

                    # call the public web services URL
                    # http://schools.nyc.gov/webservices/wt/watertesting.asmx/GetTestLocations?LocationCode=XXXX
                    locationCode = row[2]
                    print locationCode
                    #create URL
                    url = base_url + locationCode
                    file = urllib.urlopen(url)
                    readData = file.read()
                    file.close()
                    dataAll = xmltodict.parse(readData)
                    # check to see if data returned
                    dataTestInfo = dataAll['ArrayOfTestInfo'].get('TestInfo', None)
                    if dataTestInfo:
                        # if more than one record (length = 2), iterate                    
                        length = len(dataTestInfo) 
                        if length != 16:
                            for data in dataAll['ArrayOfTestInfo']['TestInfo']:
                                i = NYCschoolsWaterTesting()
                                i.lc = data['lc']
                                i.bc = data['bc']
                                i.ln = data['ln']
                                i.bn = data['bn']
                                i.add = data['add']
                                i.cit = data['cit']
                                i.stc = data['stc']
                                i.zip = data['zip']
                                i.wtp = data['wtp']
                                i.er = data['er']
                                i.dohm = data['dohm']
                                i.note = data['note']
                                i.dt = data['dt']
                                i.st = data['st']
                                i.se = data['se']
                                i.rt = data['rt']
                                i.save()
                        else:
                            data = dataAll['ArrayOfTestInfo']['TestInfo']
                            i = NYCschoolsWaterTesting()
                            i.lc = data['lc']
                            i.bc = data['bc']
                            i.ln = data['ln']
                            i.bn = data['bn']
                            i.add = data['add']
                            i.cit = data['cit']
                            i.stc = data['stc']
                            i.zip = data['zip']
                            i.wtp = data['wtp']
                            i.er = data['er']
                            i.dohm = data['dohm']
                            i.note = data['note']
                            i.dt = data['dt']
                            i.st = data['st']
                            i.se = data['se']
                            i.rt = data['rt']
                            i.save() 
                     


    def handle(self, *args, **options):
        print "Loading Water Quality Data...."
        self.load_wq_data()




