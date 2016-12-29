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
  Loads Chicago building permist data from the Chicago open data portal
  https://data.cityofchicago.org/Buildings/Building-Permits/ydr8-5enu/data
  API Docs
  https://dev.socrata.com/foundry/data.cityofchicago.org/9pkb-4fbf
  API endpoint
  https://data.cityofchicago.org/resource/9pkb-4fbf.json
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
                            if sliceText.find('eleven') != -1:
                                buildingStories = 11
                            if sliceText.find('twelve') != -1:
                                buildingStories = 12
                            if sliceText.find('thirteen') != -1:
                                buildingStories = 13
                            if sliceText.find('fourteen') != -1:
                                buildingStories = 14
                            if sliceText.find('fifteen') != -1:
                                buildingStories = 15
                            if sliceText.find('sixteen') != -1:
                                buildingStories = 16
                            if sliceText.find('seventeen') != -1:
                                buildingStories = 17
                            if sliceText.find('eighteen ') != -1:
                                buildingStories = 18
                            if sliceText.find('nineteen') != -1:
                                buildingStories = 19
                            if sliceText.find('twenty') != -1:
                                buildingStories = 20
                                
                    else:
                        buildingStories = 0

				#check the rest for existence and set default values if missing
				if "permit_" in d:
					permit = d['permit_']
				else:
					permit = ''

				if "_permit_type" in d:
					permit_type = d['_permit_type']
				else:
					permit_type = ''

				if "_estimated_cost" in d:
					estimated_cost = d['_estimated_cost']
				else:
					estimated_cost = 0

				if "street_number" in d:
					street_number = d['street_number']
				else:
					street_number = ''

				if "street_direction" in d:
					street_direction = d['street_direction']
				else:
					street_direction = ''

				if "street_name" in d:
					street_name = d['street_name']
				else:
					street_name = ''

				if "_suffix" in d:
					suffix = d['_suffix']
				else:
					suffix = ''

				if "work_description" in d:
					work_description = d['work_description']
				else:
					work_description = ''

				if "latitude" in d:
					latitude = d['latitude']
				else:
					latitude = ''

				if "longitude" in d:
					longitude = d['longitude']
				else:
					longitude = ''

                #use get or create to only create records for objects newly added to the spreadsheets
                updated_values = {'permit': permit, 'permit_type': permit_type, 'issue_date': issue_date, 'estimated_cost': estimated_cost, 'street_number': street_number, 'street_direction': street_direction, 'street_name': street_name, 'suffix': suffix, 'work_description': work_description, 'pin1': PIN, 'latitude': latitude, 'longitude': longitude, 'buildingStories': buildingStories}
                obj, created = CHI_Building_Permits_New.objects.update_or_create(ID_ODP=d['id'], defaults=updated_values)
                print d['id']
                print created

                # fill out address field if one doesn't exist
                if not obj.buildingAddress:
                    obj.buildingAddress = street_number + ' ' + street_direction + ' ' + street_name + ' ' + suffix
                    obj.save()


            except Exception, e:
            	print "FAIL"
                print e
                print d
                # if error, send email
                subject = "Skyline CHI DOB Permits Data Import Problem"
                html_message = 'Problem ID #: ' + d['id']
                message = 'Problem ID #: ' + d['id']

                send_mail(subject, message, 'dnainfovisualizations@gmail.com', ['jd@nijel.org'], fail_silently=True, html_message=html_message)


    def handle(self, *args, **options):
        print "Loading Chicago DOB Permits...."
        self.load_dob_data()
        print "Done."
 



