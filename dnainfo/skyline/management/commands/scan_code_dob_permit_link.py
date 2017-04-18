import sys,os
from django.core.management.base import BaseCommand, CommandError
from skyline.models import *
import urllib
import urllib2
import re
#for email
from django.core.mail import send_mail


"""
    Pulls the "scan code" from DOB permit by job number
    Need this to download PDFs
    ULR "endpoint"
    http://a810-bisweb.nyc.gov/bisweb/JobsZoningDocumentsServlet?passjobnumber=121185760&Retrieve=Zoning
"""
class Command(BaseCommand):

    def load_scan_codes(self):
        # pull data from NYC_DOB_Permit_Issuance, redo every object every time as there are frequenst updates to the zoning documents
        objects = NYC_DOB_Permit_Issuance.objects.all()
        base_url = 'http://a810-bisweb.nyc.gov/bisweb/JobsZoningDocumentsServlet'
        user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.8 (KHTML, like Gecko) Version/9.1.3 Safari/601.7.8'
        values = {'name' : 'Name', 'location' : 'Brooklyn', 'language' : 'Python' }
        headers = { 'User-Agent' : user_agent }


        for obj in objects:
            try:   
                # set URL
                print obj.job
                if obj.job:
                    params = '?passjobnumber=' + obj.job + '&Retrieve=Zoning'
                    url = base_url + params
                    data = urllib.urlencode(values)
                    req = urllib2.Request(url, data, headers)
                    response = urllib2.urlopen(req)
                    the_page = response.read()
                    #check for ZD1 documents
                    sliceText = ''
                    isZD1 = the_page.find('<td class="content" >ZD1</td>')
                    if isZD1 != -1:
                        # now find the lowest index where "ES" or "SC" scan code exists after ZD1. This should be the most recent zoning document
                        # sicne we only want to look at the text just after the isZD1 index, lets just add a bit to the positon of ZD1
                        endIsZD1 = isZD1 + 184
                        indexSC = the_page.find('<td class="content" >SC',isZD1,endIsZD1)
                        if indexSC != -1:
                            startIndexSC = indexSC + 21
                            endIndexSC = startIndexSC + 11
                            sliceText = the_page[startIndexSC:endIndexSC]
                        else:
                            indexES = the_page.find('<td class="content" >ES',isZD1,endIsZD1)
                            if indexES != -1:
                                startIndexES = indexES + 21
                                endIndexES = startIndexES + 11
                                sliceText = the_page[startIndexES:endIndexES]



                    print sliceText

                    if sliceText:
                        if obj.scan_code != sliceText:
                            obj.scan_code = sliceText
                            obj.scan_code_updated = True
                        else:
                            obj.scan_code_updated = False
                    else:
                        obj.scan_code_updated = False
                else:
                    obj.scan_code_updated = False

                obj.save()


            except Exception, e:
                obj.scan_code_updated = False
                obj.save()

                print e
                # if error, send email
                subject = "Skyline NYC Error Getting Scan Code"
                html_message = 'Problem Job Number: ' + obj.job
                message = 'Problem Job Number: ' + obj.job

                send_mail(subject, message, 'dnainfovisualizations@gmail.com', ['jd@nijel.org'], fail_silently=True, html_message=html_message)               


    def handle(self, *args, **options):
        print "Loading Scan Codes...."
        self.load_scan_codes()
        print "Done."
 



