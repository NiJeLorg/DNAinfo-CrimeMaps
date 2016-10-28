import sys,os
from django.core.management.base import BaseCommand, CommandError
from skyline_chi.models import *
import urllib, json


"""
    Migrates data from CHI_Building_Permits_Old to CHI_Building_Permits_New to deal with primary key problem.
"""
class Command(BaseCommand):

    def migrate_data(self):
        objects = CHI_Building_Permits_Old.objects.all()

        for obj in objects:
            newObj = CHI_Building_Permits_New()
            newObj.ID_ODP = obj.ID
            newObj.created = obj.created
            newObj.updated = obj.updated
            newObj.created_by = obj.created_by
            newObj.updated_by = obj.updated_by
            newObj.whereBuilding = obj.whereBuilding
            newObj.permit = obj.permit
            newObj.permit_type = obj.permit_type
            newObj.issue_date = obj.issue_date
            newObj.street_number = obj.street_number
            newObj.street_direction = obj.street_direction
            newObj.street_name = obj.street_name
            newObj.suffix = obj.suffix 
            newObj.work_description = obj.work_description
            newObj.pin1 = obj.pin1
            newObj.latitude = obj.latitude
            newObj.longitude = obj.longitude
            newObj.buildingFootprint = obj.buildingFootprint
            newObj.buildingStories = obj.buildingStories
            newObj.zoning_pdfs = obj.zoning_pdfs
            newObj.story1 = obj.story1
            newObj.projectName = obj.projectName
            newObj.buildingImage = obj.buildingImage
            newObj.buildingAddress = obj.buildingAddress
            newObj.description = obj.description
            newObj.archived = obj.archived
            newObj.save()

    def handle(self, *args, **options):
        print "Migrate Permit Data...."
        self.migrate_data()
        print "Done."
 



