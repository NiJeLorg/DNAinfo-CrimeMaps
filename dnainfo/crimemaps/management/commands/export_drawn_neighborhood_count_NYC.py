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

		# Pull all neighborhoods NYC
		NYCneighborhoods = neighborhoodNYC.objects.all()

		#file for counting
		filename = "NYC_drawn_neighborhood_count.csv"
		with open(os.path.join(__location__, filename), 'wb') as f:
			a = csv.writer(f, delimiter=',')
			# CSV Header
			header = ['Neighborhood', 'Total Count', 'Less than 1 year', '1 year', '2 years', '3 years', '4 years', '5-10 years', '10-15 years', '15-20 years', '20-25 years', '25-30 years', '30-35 years', '35-40 years', '40-45 years', '45-50 years', '50-55 years', '55-60 years', '60-65 years', '65-70 years', '70-75 years', '75-80 years', '80-85 years', '85-90 years', '95-100 years', 'Greater than 100 years']
			a.writerow(header)

			# loop though neighborhoods
			for NYCneighborhood in NYCneighborhoods:
				ALL = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood).exclude(drawnGeojson__exact='').count()
				ZERO = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=0).exclude(drawnGeojson__exact='').count()
				ONE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=1).exclude(drawnGeojson__exact='').count()
				TWO = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=2).exclude(drawnGeojson__exact='').count()
				THREE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=3).exclude(drawnGeojson__exact='').count()
				FOUR = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=4).exclude(drawnGeojson__exact='').count()
				FIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=5).exclude(drawnGeojson__exact='').count()
				TEN = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=10).exclude(drawnGeojson__exact='').count()
				FIFTEEN = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=15).exclude(drawnGeojson__exact='').count()
				TWENTY = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=20).exclude(drawnGeojson__exact='').count()
				TWENTYFIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=25).exclude(drawnGeojson__exact='').count()
				THIRTY = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=30).exclude(drawnGeojson__exact='').count()
				THIRTYFIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=35).exclude(drawnGeojson__exact='').count()
				FORTY = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=40).exclude(drawnGeojson__exact='').count()
				FORTYFIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=45).exclude(drawnGeojson__exact='').count()
				FIFTY = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=50).exclude(drawnGeojson__exact='').count()
				FIFTYFIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=55).exclude(drawnGeojson__exact='').count()
				SIXTY = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=60).exclude(drawnGeojson__exact='').count()
				SIXTYFIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=65).exclude(drawnGeojson__exact='').count()
				SEVENTY = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=70).exclude(drawnGeojson__exact='').count()
				SEVENTYFIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=75).exclude(drawnGeojson__exact='').count()
				EIGHTY = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=80).exclude(drawnGeojson__exact='').count()
				EIGHTYFIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=85).exclude(drawnGeojson__exact='').count()
				NINETY = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=90).exclude(drawnGeojson__exact='').count()
				NINETYFIVE = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=95).exclude(drawnGeojson__exact='').count()
				ONEHUNDRED = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, yearsLived=100).exclude(drawnGeojson__exact='').count()

				data = [NYCneighborhood.name, ALL, ONE, TWO, THREE, FOUR, FIVE, TEN, FIFTEEN, TWENTY, TWENTYFIVE, THIRTY, THIRTYFIVE, FORTY, FORTYFIVE, FIFTY, FIFTYFIVE, SIXTY, SIXTYFIVE, SEVENTY, SEVENTYFIVE, EIGHTY, EIGHTYFIVE, NINETY, NINETYFIVE, ONEHUNDRED]
				a.writerow(data)



	def handle(self, *args, **options):
		print "Export count of geojsons NYC...."
		self.export_count_geojsons()




