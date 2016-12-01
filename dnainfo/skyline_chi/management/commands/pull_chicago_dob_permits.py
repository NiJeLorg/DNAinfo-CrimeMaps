import sys,os
from django.core.management.base import BaseCommand, CommandError
from skyline_chi.models import *
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
import re


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
        base_url = 'https://data.cityofchicago.org/resource/9pkb-4fbf.json'
        # Only get new building (NB) jobs
        params = "?$limit=50000&$where=_permit_type='PERMIT - NEW CONSTRUCTION'&$$app_token=y3tPEA3FFVgbMHTpMXv14QAcH"
        count = 1

        url = base_url + params
        response = urllib.urlopen(url)
        data = json.loads(response.read())
        for d in data:
            try:
                print count
                count = count + 1
                #parse dates from stings to date objects
                issue_date = None
                if "_issue_date" in d:
                    notz = dateutil.parser.parse(d['_issue_date'], ignoretz=True)
                    DateTimeObject = pytz.timezone("America/Chicago").localize(notz, is_dst=None)
                    issue_date = DateTimeObject.date()

                #strip out dashes from PIN and truncate PIN to 10 digits
                if "_pin1" in d:
                    pinNoDash = d['_pin1'].replace('-', '')
                    #remove last 4 characters to match with pin10
                    PIN = pinNoDash[:-4]
                else:
                    PIN = ''

                # pull number of building stories out of work_description field
                if "work_description" in d:
                    WD_lower = d['work_description'].lower()
                    isStory = WD_lower.find('story')
                    if isStory == -1:
                        isStory = WD_lower.find('stories')

                    if isStory != -1:
                        #near check for a number
                        startLooking = isStory - 4
                        sliceText = WD_lower[startLooking:isStory]
                        numberArray = re.findall(r'\d+', sliceText)
                        if numberArray:
                            buildingStories = int(numberArray[0])
                        else:
                            #deeper look for number words
                            startLooking = isStory - 8
                            sliceText = WD_lower[startLooking:isStory]
                            if sliceText.find('one') != -1:
                                buildingStories = 1
                            if sliceText.find('two') != -1:
                                buildingStories = 2
                            if sliceText.find('three') != -1:
                                buildingStories = 3
                            if sliceText.find('four') != -1:
                                buildingStories = 4
                            if sliceText.find('five') != -1:
                                buildingStories = 5
                            if sliceText.find('six') != -1:
                                buildingStories = 6
                            if sliceText.find('seven') != -1:
                                buildingStories = 7
                            if sliceText.find('eight') != -1:
                                buildingStories = 8
                            if sliceText.find('nine') != -1:
                                buildingStories = 9
                            if sliceText.find('ten') != -1:
                                buildingStories = 10

                    else:
                        buildingStories = 0

                #use get or create to only create records for objects newly added to the spreadsheets
                updated_values = {'permit': d['permit_'], 'permit_type': d['_permit_type'], 'issue_date': issue_date, 'street_number': d['street_number'], 'street_direction': d['street_direction'], 'street_name': d['street_name'], 'suffix': d['_suffix'], 'work_description': d['work_description'], 'pin1': PIN, 'latitude': d['latitude'], 'longitude': d['longitude'], 'buildingStories': buildingStories}
                obj, created = CHI_Building_Permits_New.objects.update_or_create(ID_ODP=d['id'], defaults=updated_values)
                print d['id']
                print created

                # fill out address field if one doesn't exist
                if not obj.buildingAddress:
                    obj.buildingAddress = d['street_number'] + ' ' + d['street_direction'] + ' ' + d['street_name'] + ' ' + d['_suffix']
                    obj.save()


            except Exception, e:
                print e
                # if error, send email
                subject = "Skyline CHI DOB Permits Data Import Problem"
                html_message = 'Problem ID #: ' + d['id']
                message = 'Problem ID #: ' + d['id']

                #send_mail(subject, message, 'dnainfovisualizations@gmail.com', ['jd@nijel.org'], fail_silently=True, html_message=html_message)


    def handle(self, *args, **options):
        print "Loading Chicago DOB Permits...."
        self.load_dob_data()
        print "Done."
 



