import sys,os
from django.core.management.base import BaseCommand, CommandError
from skyline.models import *
import urllib, json
#for email
from django.core.mail import send_mail



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
        params = '?job_type=NB&$$app_token=GcMAdHP37jdFzicK8BZl00Urg';

        url = base_url + params
        response = urllib.urlopen(url)
        data = json.loads(response.read())
        for d in data:
            try:
                #get data ready to be added
                if d['borough'] == 'MANHATTAN':
                    buildingBBL = '1' + d['block'] + d['lot'][1:]
                elif d['borough'] == 'BRONX':
                    buildingBBL = '2' + d['block'] + d['lot'][1:]
                elif d['borough'] == 'BROOKLYN':
                    buildingBBL = '3' + d['block'] + d['lot'][1:]
                elif d['borough'] == 'QUEENS':
                    buildingBBL = '4' + d['block'] + d['lot'][1:]
                else:
                    buildingBBL = '5' + d['block'] + d['lot'][1:]

                #use get or create to only create records for objects newly added to the spreadsheets
                updated_values = {'borough': d['borough'], 'bin': d['bin__'], 'house': d['house__'], 'street_name': d['street_name'], 'job_doc': d['job_doc___'], 'job_type': d['job_type'], 'block': d['block'], 'lot': d['lot'], 'community_board': d['community_board'], 'zip_code': d['zip_code'], 'bldg_type': d['bldg_type'], 'permit_status': d['permit_status'], 'filing_status': d['filing_status'], 'permit_type': d['permit_type'], 'filing_date': d['filing_date'], 'issuance_date': d['issuance_date'], 'expiration_date': d['expiration_date'], 'buildingBBL': buildingBBL}
                obj, created = NYC_DOB_Permit_Issuance.objects.update_or_create(job=d['job__'], defaults=updated_values)

            except Exception, e:
                # if error, send email
                subject = "Skyline NYC DOB Permits Data Import Problem"
                html_message = e
                message = e

                send_mail(subject, message, 'dnainfovisualizations@gmail.com', ['jd@nijel.org'], fail_silently=True, html_message=html_message)


    def handle(self, *args, **options):
        print "Loading DOB Permit Issuance...."
        self.load_dob_data()
        print "Done."
 



