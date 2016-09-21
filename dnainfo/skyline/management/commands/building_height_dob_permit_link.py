import sys,os
from django.core.management.base import BaseCommand, CommandError
from skyline.models import *
import urllib
import urllib2
import re
#for email
from django.core.mail import send_mail


"""
    Pulls Building height from DOB permit by job number
    ULR "endpoint"
    http://a810-bisweb.nyc.gov/bisweb/JobsQueryByNumberServlet?passjobnumber=121185760&passdocnumber=01
"""
class Command(BaseCommand):

    def load_height(self):
        # pull data from NYC_DOB_Permit_Issuance
        objects = NYC_DOB_Permit_Issuance.objects.filter(buildingStories__exact = 0)
        base_url = 'http://a810-bisweb.nyc.gov/bisweb/JobsQueryByNumberServlet'
        user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.8 (KHTML, like Gecko) Version/9.1.3 Safari/601.7.8'
        values = {'name' : 'Name', 'location' : 'Brooklyn', 'language' : 'Python' }
        headers = { 'User-Agent' : user_agent }


        for obj in objects:
            try:   
                # set URL
                print obj.job
                if obj.job:
                    params = '?passjobnumber=' + obj.job + '&passdocnumber=01'
                    url = base_url + params
                    data = urllib.urlencode(values)
                    req = urllib2.Request(url, data, headers)
                    response = urllib2.urlopen(req)
                    the_page = response.read()
                    heightPos = the_page.find('<td class="rightlabel">Building Stories:</td>')
                    startBuildingHeightPos = heightPos + 93;
                    endBuildingHeightPos = startBuildingHeightPos + 3;
                    bh = the_page[startBuildingHeightPos:endBuildingHeightPos]
                    bhNum = re.sub("[^0-9]", "", bh)
                    print bhNum

                    if bhNum:
                        obj.buildingStories = int(bhNum)
                        obj.save()


            except Exception, e:
                print e
                # if error, send email
                subject = "Skyline NYC Error Getting Building Height"
                html_message = 'Problem Job Number: ' + obj.job
                message = 'Problem Job Number: ' + obj.job

                send_mail(subject, message, 'dnainfovisualizations@gmail.com', ['jd@nijel.org'], fail_silently=True, html_message=html_message)               


    def handle(self, *args, **options):
        print "Loading Building Heights...."
        self.load_height()
        print "Done."
 



