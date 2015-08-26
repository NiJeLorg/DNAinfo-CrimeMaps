import sys,os
from django.core.management.base import BaseCommand, CommandError
from crimemaps.models import *
import csv


"""
  Exports the count of drawn geojsons for NYC by neighborhood
"""

class Command(BaseCommand):
	
	def export_count_geojsons(self):
		__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))

		# Pull Other neighborhood record
		other = neighborhoodNYC.objects.get(name='Other')

		#look up all the other neighborhoods written in, grouping by the same name
		otherNeighborhoods = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other).values('otherNeighborhood').distinct()

		#file for counting
		filename = "NYC_other_writein_neighborhoods.csv"
		with open(os.path.join(__location__, filename), 'wb') as f:
			a = csv.writer(f, delimiter=',')
			# CSV Header
			header = ['Neighborhood Name', 'Total Count approved', 'Less than 1 year approved', '1 year approved', '2 years approved', '3 years approved', '4 years approved', '5-10 years approved', '10-15 years approved', '15-20 years approved', '20-25 years approved', '25-30 years approved', '30-35 years approved', '35-40 years approved', '40-45 years approved', '45-50 years approved', '50-55 years approved', '55-60 years approved', '60-65 years approved', '65-70 years approved', '70-75 years approved', '75-80 years approved', '80-85 years approved', '85-90 years approved', '90-95 years approved', '95-100 years approved', 'Greater than 100 years approved', 'Total Count not approved', 'Less than 1 year not approved', '1 year not approved', '2 years not approved', '3 years not approved', '4 years not approved', '5-10 years not approved', '10-15 years not approved', '15-20 years not approved', '20-25 years not approved', '25-30 years not approved', '30-35 years not approved', '35-40 years not approved', '40-45 years not approved', '45-50 years not approved', '50-55 years not approved', '55-60 years not approved', '60-65 years not approved', '65-70 years not approved', '70-75 years not approved', '75-80 years not approved', '80-85 years not approved', '85-90 years not approved', '90-95 years not approved', '95-100 years not approved', 'Greater than 100 years not approved']
			a.writerow(header)

			# loop though write in neighborhoods
			for otherNeighborhood in otherNeighborhoods:
				ALL = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], approved=True).exclude(drawnGeojson__exact='').count()
				ZERO = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=0, approved=True).exclude(drawnGeojson__exact='').count()
				ONE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=1, approved=True).exclude(drawnGeojson__exact='').count()
				TWO = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=2, approved=True).exclude(drawnGeojson__exact='').count()
				THREE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=3, approved=True).exclude(drawnGeojson__exact='').count()
				FOUR = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=4, approved=True).exclude(drawnGeojson__exact='').count()
				FIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=5, approved=True).exclude(drawnGeojson__exact='').count()
				TEN = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=10, approved=True).exclude(drawnGeojson__exact='').count()
				FIFTEEN = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=15, approved=True).exclude(drawnGeojson__exact='').count()
				TWENTY = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=20, approved=True).exclude(drawnGeojson__exact='').count()
				TWENTYFIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=25, approved=True).exclude(drawnGeojson__exact='').count()
				THIRTY = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=30, approved=True).exclude(drawnGeojson__exact='').count()
				THIRTYFIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=35, approved=True).exclude(drawnGeojson__exact='').count()
				FORTY = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=40, approved=True).exclude(drawnGeojson__exact='').count()
				FORTYFIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=45, approved=True).exclude(drawnGeojson__exact='').count()
				FIFTY = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=50, approved=True).exclude(drawnGeojson__exact='').count()
				FIFTYFIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=55, approved=True).exclude(drawnGeojson__exact='').count()
				SIXTY = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=60, approved=True).exclude(drawnGeojson__exact='').count()
				SIXTYFIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=65, approved=True).exclude(drawnGeojson__exact='').count()
				SEVENTY = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=70, approved=True).exclude(drawnGeojson__exact='').count()
				SEVENTYFIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=75, approved=True).exclude(drawnGeojson__exact='').count()
				EIGHTY = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=80, approved=True).exclude(drawnGeojson__exact='').count()
				EIGHTYFIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=85, approved=True).exclude(drawnGeojson__exact='').count()
				NINETY = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=90, approved=True).exclude(drawnGeojson__exact='').count()
				NINETYFIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=95, approved=True).exclude(drawnGeojson__exact='').count()
				ONEHUNDRED = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=100, approved=True).exclude(drawnGeojson__exact='').count()
				ALL_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], approved=False).exclude(drawnGeojson__exact='').count()
				ZERO_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=0, approved=False).exclude(drawnGeojson__exact='').count()
				ONE_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=1, approved=False).exclude(drawnGeojson__exact='').count()
				TWO_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=2, approved=False).exclude(drawnGeojson__exact='').count()
				THREE_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=3, approved=False).exclude(drawnGeojson__exact='').count()
				FOUR_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=4, approved=False).exclude(drawnGeojson__exact='').count()
				FIVE_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=5, approved=False).exclude(drawnGeojson__exact='').count()
				TEN_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=10, approved=False).exclude(drawnGeojson__exact='').count()
				FIFTEEN_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=15, approved=False).exclude(drawnGeojson__exact='').count()
				TWENTY_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=20, approved=False).exclude(drawnGeojson__exact='').count()
				TWENTYFIVE_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=25, approved=False).exclude(drawnGeojson__exact='').count()
				THIRTY_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=30, approved=False).exclude(drawnGeojson__exact='').count()
				THIRTYFIVE_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=35, approved=False).exclude(drawnGeojson__exact='').count()
				FORTY_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=40, approved=False).exclude(drawnGeojson__exact='').count()
				FORTYFIVE_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=45, approved=False).exclude(drawnGeojson__exact='').count()
				FIFTY_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=50, approved=False).exclude(drawnGeojson__exact='').count()
				FIFTYFIVE_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=55, approved=False).exclude(drawnGeojson__exact='').count()
				SIXTY_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=60, approved=False).exclude(drawnGeojson__exact='').count()
				SIXTYFIVE_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=65, approved=False).exclude(drawnGeojson__exact='').count()
				SEVENTY_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=70, approved=False).exclude(drawnGeojson__exact='').count()
				SEVENTYFIVE_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=75, approved=False).exclude(drawnGeojson__exact='').count()
				EIGHTY_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=80, approved=False).exclude(drawnGeojson__exact='').count()
				EIGHTYFIVE_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=85, approved=False).exclude(drawnGeojson__exact='').count()
				NINETY_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=90, approved=False).exclude(drawnGeojson__exact='').count()
				NINETYFIVE_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=95, approved=False).exclude(drawnGeojson__exact='').count()
				ONEHUNDRED_notapproved = neighborhoodDrawNYC.objects.filter(neighborhoodLive=other, otherNeighborhood=otherNeighborhood['otherNeighborhood'], yearsLived=100, approved=False).exclude(drawnGeojson__exact='').count()

				data = [otherNeighborhood['otherNeighborhood'], ALL, ZERO, ONE, TWO, THREE, FOUR, FIVE, TEN, FIFTEEN, TWENTY, TWENTYFIVE, THIRTY, THIRTYFIVE, FORTY, FORTYFIVE, FIFTY, FIFTYFIVE, SIXTY, SIXTYFIVE, SEVENTY, SEVENTYFIVE, EIGHTY, EIGHTYFIVE, NINETY, NINETYFIVE, ONEHUNDRED, ALL_notapproved, ZERO_notapproved, ONE_notapproved, TWO_notapproved, THREE_notapproved, FOUR_notapproved, FIVE_notapproved, TEN_notapproved, FIFTEEN_notapproved, TWENTY_notapproved, TWENTYFIVE_notapproved, THIRTY_notapproved, THIRTYFIVE_notapproved, FORTY_notapproved, FORTYFIVE_notapproved, FIFTY_notapproved, FIFTYFIVE_notapproved, SIXTY_notapproved, SIXTYFIVE_notapproved, SEVENTY_notapproved, SEVENTYFIVE_notapproved, EIGHTY_notapproved, EIGHTYFIVE_notapproved, NINETY_notapproved, NINETYFIVE_notapproved, ONEHUNDRED_notapproved]
				a.writerow(data)



	def handle(self, *args, **options):
		print "Export count of other neighborhood write ins for NYC...."
		self.export_count_geojsons()




