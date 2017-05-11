import sys,os
from django.core.management.base import BaseCommand, CommandError
from skyline.models import *
import requests
from django.core.files import File
import time
import datetime
#for email
from django.core.mail import send_mail


"""
    Using the "scan code" download the PDF document to the model
    ULR "endpoint"
    http://a810-bisweb.nyc.gov/bisweb/BSCANJobDocumentContentServlet?passjobnumber=121185760&scancode=ES405072999
"""
class Command(BaseCommand):

    def load_pdfs(self):
        # pull data from NYC_DOB_Permit_Issuance, redo every object every time as there are frequent updates to the zoning documents
        objects = NYC_DOB_Permit_Issuance.objects.exclude(scan_code__exact='')
        base_url = 'http://a810-bisweb.nyc.gov/bisweb/BSCANJobDocumentContentServlet'
        user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.8 (KHTML, like Gecko) Version/9.1.3 Safari/601.7.8'
        values = {'name' : 'Name', 'location' : 'Brooklyn', 'language' : 'Python' }
        headers = { 'User-Agent' : user_agent }

        t = datetime.date.today()
        strtime = t.strftime('%m_%d_%Y')


        for obj in objects:
        	# only pull new pdf if the scan code has changed
        	if obj.scan_code_updated:
	            try:   
	                # set URL
	                print 'Job #: ' + obj.job
	                print 'Scan Code: ' + obj.scan_code
	                if obj.job:
	                    params = '?passjobnumber=' + obj.job + '&scancode=' + obj.scan_code
	                    url = base_url + params
	                    print url
	                    obj.zoning_pdfs.save(url)
	                    # response = requests.get(url, headers=headers)
	                    # try:
	                    #     response.raise_for_status()
	                    #     if response.headers.get('content-type') == 'application/pdf':
	                    #         f = open(obj.scan_code+'.pdf', 'wb+')
	                    #         f.write(response.content)
	                    #         pdffile = File(f)
	                    #         print pdffile
	                    #         obj.zoning_pdfs.save(obj.scan_code+'_'+strtime+'.pdf', pdffile)
	                    #         f.close()
	                    #         os.remove(obj.scan_code+'.pdf')

	                    #         # pause if successful
	                    #         time.sleep(2) 

	                    # except Exception as e:
	                    #     print('There was a problem: %s' % (e))

	            except Exception, e:
	                print e
	                # if error, send email
	                subject = "Skyline NYC Error Getting Scan Code"
	                html_message = 'Problem Job Number: ' + obj.job
	                message = 'Problem Job Number: ' + obj.job

	                send_mail(subject, message, 'dnainfovisualizations@gmail.com', ['jd@nijel.org'], fail_silently=True, html_message=html_message)          


    def handle(self, *args, **options):
        print "Loading PDFs...."
        self.load_pdfs()
        print "Done."
 



