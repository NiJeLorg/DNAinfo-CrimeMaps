import sys,os
from django.core.management.base import BaseCommand, CommandError
from skyline.models import *
import urllib, json
#for email
from django.core.mail import send_mail


"""
    Pulls Geojson from CARTO for the BBL attached to the permit
    CARTO API endpoint
    https://{username}.carto.com/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM {table_name} LIMIT 1
"""
class Command(BaseCommand):

    def load_geom(self):
        # pull data from NYC_DOB_Permit_Issuance
        objects = NYC_DOB_Permit_Issuance.objects.filter(buildingFootprint__exact = '')

        for obj in objects:
            try:   
                # set URL
                print obj.borough
                print obj.buildingBBL
                if obj.borough == 'MANHATTAN':
                    url = 'https://jd.carto.com/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM mnmappluto WHERE bbl = '+ obj.buildingBBL
                elif obj.borough == 'BRONX':
                    url = 'https://jd.carto.com/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM bxmappluto WHERE bbl = '+ obj.buildingBBL
                elif obj.borough == 'BROOKLYN':
                    url = 'https://jdgodchaux.carto.com/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM bkmappluto WHERE bbl = '+ obj.buildingBBL
                elif obj.borough == 'QUEENS':
                    url = 'https://jdgodchaux.carto.com/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM qnmappluto WHERE bbl = '+ obj.buildingBBL
                else:
                    url = 'https://jd.carto.com/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM simappluto WHERE bbl = '+ obj.buildingBBL

                response = urllib.urlopen(url)
                data = json.loads(response.read())

                if data['total_rows'] > 0:
                    print data['rows'][0]['the_geom']
                    obj.buildingFootprint = data['rows'][0]['the_geom']
                    obj.save()
                else:
                    print '-99'
                    obj.buildingFootprint = '-99'
                    obj.save()


            except Exception, e:
                print e
                # if error, send email
                subject = "Skyline NYC CARTO Geography DOB Permits Data Problem"
                html_message = 'Problem BBL: ' + obj.buildingBBL
                message = 'Problem BBL: ' + obj.buildingBBL

                send_mail(subject, message, 'dnainfovisualizations@gmail.com', ['jd@nijel.org'], fail_silently=True, html_message=html_message)               


    def handle(self, *args, **options):
        print "Loading CARTO geometries linked to DOB permits...."
        self.load_geom()
        print "Done."
 



