import sys,os
from django.core.management.base import BaseCommand, CommandError
from skyline.models import *
import urllib, json
#for email
from django.core.mail import send_mail
# for date parsing
import datetime
import time
from datetime import date
from django.utils import timezone
import dateutil.parser
import dateutil.tz
import pytz


"""
  Loads NYC department of buildings data for NYC open data portal
  https://data.cityofnewyork.us/Housing-Development/DOB-Permit-Issuance/ipu4-2q9a
  API Docs
  https://dev.socrata.com/foundry/data.cityofnewyork.us/83x8-shf7
  API endpoint
  https://data.cityofnewyork.us/resource/83x8-shf7.json
"""
class Command(BaseCommand):

    def load_dob_data(self):
        base_url = 'https://data.cityofnewyork.us/resource/83x8-shf7.json'
        # Only get new building (NB) jobs
        params = "?$limit=50000&$where=permit_type='NB'&$order=permit_sequence__&$$app_token=GcMAdHP37jdFzicK8BZl00Urg"

        url = base_url + params
        response = urllib.urlopen(url)
        data = json.loads(response.read())
        count = 1
        for d in data:
            try:
                print count
                count = count + 1
                #parse dates from stings to date objects
                issuance_date = None
                filing_date = None
                expiration_date = None
                job_start_date = None
                if "issuance_date" in d:
                    notz = dateutil.parser.parse(d['issuance_date'], ignoretz=True)
                    DateTimeObject = pytz.timezone("America/New_York").localize(notz, is_dst=None)
                    issuance_date = DateTimeObject.date()

                if "filing_date" in d:
                    filing_date = dateutil.parser.parse(d['filing_date']).date()
                if "expiration_date" in d:
                    expiration_date = dateutil.parser.parse(d['expiration_date']).date()
                if "job_start_date" in d:
                    job_start_date = dateutil.parser.parse(d['job_start_date']).date()


                #check the rest for existence and set default values if missing
                if "borough" in d:
                    borough = d['borough']
                else:
                    borough = ''

                if "bin__" in d:
                    bin_num = d['bin__']
                else:
                    bin_num = ''

                if "house__" in d:
                    house = d['house__']
                else:
                    house = ''

                if "street_name" in d:
                    street_name = d['street_name']
                else:
                    street_name = ''

                if "job_doc___" in d:
                    job_doc = d['job_doc___']
                else:
                    job_doc = ''

                if "job_type" in d:
                    job_type = d['job_type']
                else:
                    job_type = ''

                if "block" in d:
                    block = d['block']
                else:
                    block = ''

                if "lot" in d:
                    lot = d['lot']
                else:
                    lot = ''

                if "community_board" in d:
                    community_board = d['community_board']
                else:
                    community_board = ''

                if "zip_code" in d:
                    zip_code = d['zip_code']
                else:
                    zip_code = ''

                if "bldg_type" in d:
                    bldg_type = d['bldg_type']
                else:
                    bldg_type = ''

                if "permit_status" in d:
                    permit_status = d['permit_status']
                else:
                    permit_status = ''

                if "filing_status" in d:
                    filing_status = d['filing_status']
                else:
                    filing_status = ''

                if "permit_type" in d:
                    permit_type = d['permit_type']
                else:
                    permit_type = ''


                #get data ready to be added
                if borough == 'MANHATTAN':
                    buildingBBL = '1' + block + lot[1:]
                elif borough == 'BRONX':
                    buildingBBL = '2' + block + lot[1:]
                elif borough == 'BROOKLYN':
                    buildingBBL = '3' + block + lot[1:]
                elif borough == 'QUEENS':
                    buildingBBL = '4' + block + lot[1:]
                else:
                    buildingBBL = '5' + block + lot[1:]

                #use get or create to only create records for objects newly added to the spreadsheets
                updated_values = {'borough': borough, 'bin': bin_num, 'house': d['house__'], 'street_name': d['street_name'], 'job_doc': d['job_doc___'], 'job_type': d['job_type'], 'block': d['block'], 'lot': d['lot'], 'community_board': d['community_board'], 'zip_code': d['zip_code'], 'bldg_type': d['bldg_type'], 'permit_status': d['permit_status'], 'filing_status': d['filing_status'], 'permit_type': d['permit_type'], 'filing_date': filing_date, 'issuance_date': issuance_date, 'expiration_date': expiration_date, 'job_start_date': job_start_date, 'buildingBBL': buildingBBL}
                obj, created = NYC_DOB_Permit_Issuance.objects.update_or_create(job=d['job__'], defaults=updated_values)
                print d['job__']
                print created

                # fill out address field if one doesn't exist
                if not obj.buildingAddress:
                    obj.buildingAddress = house + ' ' + street_name
                    obj.save()

                if not obj.buildingZip:
                    obj.buildingZip = zip_code
                    obj.save()


            except Exception, e:
                print "FAIL"
                print e
                print d
                # if error, send email
                subject = "Skyline NYC DOB Permits Data Import Problem"
                html_message = 'Problem Job #: ' + d['job__']
                message = 'Problem Job #: ' + d['job__']

                send_mail(subject, message, 'dnainfovisualizations@gmail.com', ['jd@nijel.org'], fail_silently=True, html_message=html_message)


    def handle(self, *args, **options):
        print "Loading DOB Permit Issuance...."
        self.load_dob_data()
        print "Done."
 



