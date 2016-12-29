import sys,os
from django.core.management.base import BaseCommand, CommandError
from skyline_chi.models import *
import urllib, json
#for email
from django.core.mail import send_mail


"""
    Pulls Geojson from CARTO for the PIN attached to the permit
    CARTO API endpoint
    https://{username}.carto.com/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM {table_name} LIMIT 1
"""
class Command(BaseCommand):

    def load_geom(self):
        # pull data from NYC_DOB_Permit_Issuance
        objects = CHI_Building_Permits_New.objects.filter(buildingFootprint__exact = '')

        for obj in objects:
            if obj.pin1:
                try:   
                    # set URL
                    print obj.pin1
                    #trying each carto table for a response
                    url = "https://chidata3d.carto.com/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM chi_parcels_north_third WHERE pin10 = '"+ obj.pin1 + "'"

                    response = urllib.urlopen(url)
                    data = json.loads(response.read())

                    if data['rows']:
                        print data['rows'][0]['the_geom']
                        obj.buildingFootprint = data['rows'][0]['the_geom']
                        obj.save()
                    else:
                        url = "https://chidata3d-1.carto.com/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM chi_parcels_central_third WHERE pin10 = '"+ obj.pin1 + "'"

                        response = urllib.urlopen(url)
                        data = json.loads(response.read())

                        if data['rows']:
                            print data['rows'][0]['the_geom']
                            obj.buildingFootprint = data['rows'][0]['the_geom']
                            obj.save()
                        else:
                            url = "https://chidata3d-2.carto.com/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM chi_parcels_south_third WHERE pin10 = '"+ obj.pin1 + "'"

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
                    subject = "Skyline CHI CARTO Geography DOB Permits Data Problem"
                    html_message = 'Problem ID: ' + str(obj.ID_ODP)
                    message = 'Problem ID: ' + str(obj.ID_ODP)

                    send_mail(subject, message, 'dnainfovisualizations@gmail.com', ['jd@nijel.org'], fail_silently=True, html_message=html_message)               

            elif obj.pin_added:
                try:   
                    # set URL
                    print obj.pin_added
                    #trying each carto table for a response
                    url = "https://chidata3d.carto.com/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM chi_parcels_north_third WHERE pin10 = '"+ obj.pin_added + "'"

                    response = urllib.urlopen(url)
                    data = json.loads(response.read())

                    if data['rows']:
                        print data['rows'][0]['the_geom']
                        obj.buildingFootprint = data['rows'][0]['the_geom']
                        obj.save()
                    else:
                        url = "https://chidata3d-1.carto.com/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM chi_parcels_central_third WHERE pin10 = '"+ obj.pin_added + "'"

                        response = urllib.urlopen(url)
                        data = json.loads(response.read())

                        if data['rows']:
                            print data['rows'][0]['the_geom']
                            obj.buildingFootprint = data['rows'][0]['the_geom']
                            obj.save()
                        else:
                            url = "https://chidata3d-2.carto.com/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM chi_parcels_south_third WHERE pin10 = '"+ obj.pin_added + "'"

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
                    subject = "Skyline CHI CARTO Geography DOB Permits Data Problem"
                    html_message = 'Problem ID: ' + str(obj.ID_ODP)
                    message = 'Problem ID: ' + str(obj.ID_ODP)

                    send_mail(subject, message, 'dnainfovisualizations@gmail.com', ['jd@nijel.org'], fail_silently=True, html_message=html_message)


            else:
                print '-99'
                obj.buildingFootprint = '-99'
                obj.save()

    def handle(self, *args, **options):
        print "Loading CARTO geometries linked to Chicago DOB permits...."
        self.load_geom()
        print "Done."
 



