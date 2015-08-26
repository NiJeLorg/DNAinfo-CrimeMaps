import sys,os
from django.core.management.base import BaseCommand, CommandError
from crimemaps.models import *
import csv


"""
  Exports the count of drawn geojsons for CHI by neighborhood
"""

class Command(BaseCommand):
	
	def export_count_geojsons(self):
		__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))

		# Pull all neighborhoods CHI
		CHIneighborhoods = neighborhoodCHI.objects.all()

		#file for counting
		filename = "CHI_drawn_neighborhood_count.csv"
		with open(os.path.join(__location__, filename), 'wb') as f:
			a = csv.writer(f, delimiter=',')
			# CSV Header
			header = ['Neighborhood', 'Total Count approved', 'Less than 1 year approved', '1 year approved', '2 years approved', '3 years approved', '4 years approved', '5-10 years approved', '10-15 years approved', '15-20 years approved', '20-25 years approved', '25-30 years approved', '30-35 years approved', '35-40 years approved', '40-45 years approved', '45-50 years approved', '50-55 years approved', '55-60 years approved', '60-65 years approved', '65-70 years approved', '70-75 years approved', '75-80 years approved', '80-85 years approved', '85-90 years approved', '90-95 years approved', '95-100 years approved', 'Greater than 100 years approved', 'Total Count not approved', 'Less than 1 year not approved', '1 year not approved', '2 years not approved', '3 years not approved', '4 years not approved', '5-10 years not approved', '10-15 years not approved', '15-20 years not approved', '20-25 years not approved', '25-30 years not approved', '30-35 years not approved', '35-40 years not approved', '40-45 years not approved', '45-50 years not approved', '50-55 years not approved', '55-60 years not approved', '60-65 years not approved', '65-70 years not approved', '70-75 years not approved', '75-80 years not approved', '80-85 years not approved', '85-90 years not approved', '90-95 years not approved', '95-100 years not approved', 'Greater than 100 years not approved']
			a.writerow(header)

			# loop though neighborhoods
			for CHIneighborhood in CHIneighborhoods:
				ALL = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, approved=True).exclude(drawnGeojson__exact='').count()
				ZERO = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=0, approved=True).exclude(drawnGeojson__exact='').count()
				ONE = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=1, approved=True).exclude(drawnGeojson__exact='').count()
				TWO = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=2, approved=True).exclude(drawnGeojson__exact='').count()
				THREE = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=3, approved=True).exclude(drawnGeojson__exact='').count()
				FOUR = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=4, approved=True).exclude(drawnGeojson__exact='').count()
				FIVE = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=5, approved=True).exclude(drawnGeojson__exact='').count()
				TEN = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=10, approved=True).exclude(drawnGeojson__exact='').count()
				FIFTEEN = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=15, approved=True).exclude(drawnGeojson__exact='').count()
				TWENTY = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=20, approved=True).exclude(drawnGeojson__exact='').count()
				TWENTYFIVE = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=25, approved=True).exclude(drawnGeojson__exact='').count()
				THIRTY = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=30, approved=True).exclude(drawnGeojson__exact='').count()
				THIRTYFIVE = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=35, approved=True).exclude(drawnGeojson__exact='').count()
				FORTY = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=40, approved=True).exclude(drawnGeojson__exact='').count()
				FORTYFIVE = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=45, approved=True).exclude(drawnGeojson__exact='').count()
				FIFTY = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=50, approved=True).exclude(drawnGeojson__exact='').count()
				FIFTYFIVE = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=55, approved=True).exclude(drawnGeojson__exact='').count()
				SIXTY = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=60, approved=True).exclude(drawnGeojson__exact='').count()
				SIXTYFIVE = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=65, approved=True).exclude(drawnGeojson__exact='').count()
				SEVENTY = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=70, approved=True).exclude(drawnGeojson__exact='').count()
				SEVENTYFIVE = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=75, approved=True).exclude(drawnGeojson__exact='').count()
				EIGHTY = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=80, approved=True).exclude(drawnGeojson__exact='').count()
				EIGHTYFIVE = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=85, approved=True).exclude(drawnGeojson__exact='').count()
				NINETY = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=90, approved=True).exclude(drawnGeojson__exact='').count()
				NINETYFIVE = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=95, approved=True).exclude(drawnGeojson__exact='').count()
				ONEHUNDRED = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=100, approved=True).exclude(drawnGeojson__exact='').count()
				ALL_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, approved=False).exclude(drawnGeojson__exact='').count()
				ZERO_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=0, approved=False).exclude(drawnGeojson__exact='').count()
				ONE_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=1, approved=False).exclude(drawnGeojson__exact='').count()
				TWO_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=2, approved=False).exclude(drawnGeojson__exact='').count()
				THREE_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=3, approved=False).exclude(drawnGeojson__exact='').count()
				FOUR_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=4, approved=False).exclude(drawnGeojson__exact='').count()
				FIVE_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=5, approved=False).exclude(drawnGeojson__exact='').count()
				TEN_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=10, approved=False).exclude(drawnGeojson__exact='').count()
				FIFTEEN_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=15, approved=False).exclude(drawnGeojson__exact='').count()
				TWENTY_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=20, approved=False).exclude(drawnGeojson__exact='').count()
				TWENTYFIVE_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=25, approved=False).exclude(drawnGeojson__exact='').count()
				THIRTY_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=30, approved=False).exclude(drawnGeojson__exact='').count()
				THIRTYFIVE_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=35, approved=False).exclude(drawnGeojson__exact='').count()
				FORTY_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=40, approved=False).exclude(drawnGeojson__exact='').count()
				FORTYFIVE_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=45, approved=False).exclude(drawnGeojson__exact='').count()
				FIFTY_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=50, approved=False).exclude(drawnGeojson__exact='').count()
				FIFTYFIVE_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=55, approved=False).exclude(drawnGeojson__exact='').count()
				SIXTY_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=60, approved=False).exclude(drawnGeojson__exact='').count()
				SIXTYFIVE_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=65, approved=False).exclude(drawnGeojson__exact='').count()
				SEVENTY_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=70, approved=False).exclude(drawnGeojson__exact='').count()
				SEVENTYFIVE_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=75, approved=False).exclude(drawnGeojson__exact='').count()
				EIGHTY_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=80, approved=False).exclude(drawnGeojson__exact='').count()
				EIGHTYFIVE_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=85, approved=False).exclude(drawnGeojson__exact='').count()
				NINETY_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=90, approved=False).exclude(drawnGeojson__exact='').count()
				NINETYFIVE_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=95, approved=False).exclude(drawnGeojson__exact='').count()
				ONEHUNDRED_notapproved = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood, yearsLived=100, approved=False).exclude(drawnGeojson__exact='').count()

				data = [CHIneighborhood.name, ALL, ZERO, ONE, TWO, THREE, FOUR, FIVE, TEN, FIFTEEN, TWENTY, TWENTYFIVE, THIRTY, THIRTYFIVE, FORTY, FORTYFIVE, FIFTY, FIFTYFIVE, SIXTY, SIXTYFIVE, SEVENTY, SEVENTYFIVE, EIGHTY, EIGHTYFIVE, NINETY, NINETYFIVE, ONEHUNDRED, ALL_notapproved, ZERO_notapproved, ONE_notapproved, TWO_notapproved, THREE_notapproved, FOUR_notapproved, FIVE_notapproved, TEN_notapproved, FIFTEEN_notapproved, TWENTY_notapproved, TWENTYFIVE_notapproved, THIRTY_notapproved, THIRTYFIVE_notapproved, FORTY_notapproved, FORTYFIVE_notapproved, FIFTY_notapproved, FIFTYFIVE_notapproved, SIXTY_notapproved, SIXTYFIVE_notapproved, SEVENTY_notapproved, SEVENTYFIVE_notapproved, EIGHTY_notapproved, EIGHTYFIVE_notapproved, NINETY_notapproved, NINETYFIVE_notapproved, ONEHUNDRED_notapproved]
				a.writerow(data)



	def handle(self, *args, **options):
		print "Export count of geojsons CHI...."
		self.export_count_geojsons()




