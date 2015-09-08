import sys,os
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from crimemaps.models import *


"""
  Exports Drawn Geojsons by Neighborhood
"""

def strip_non_ascii(string):
    ''' Returns the string without non ASCII characters'''
    stripped = (c for c in string if ord(c) == 32 or 48 <= ord(c) <= 57 or 65 <= ord(c) <= 90  or 97 <= ord(c) <= 122)
    return ''.join(stripped)


class Command(BaseCommand):
	
	def export_geojsons(self):
		#set BASE_DIR and make geojson directory if it doesn't exist
		BASE_DIR = settings.BASE_DIR
		geojsonsPath = os.path.join(BASE_DIR, 'crimemaps/static/crimemaps/neigh_drawn_geojsons')
		if not os.path.exists(geojsonsPath):
			os.makedirs(geojsonsPath)

		# Pull all neighborhoods NYC
		NYCneighborhoods = neighborhoodNYC.objects.all()

		for NYCneighborhood in NYCneighborhoods:
			NYCdrawings = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood).exclude(approved=False)
			if len(NYCdrawings) > 0:
				print NYCneighborhood.name	
				__location__ = os.path.join(geojsonsPath, NYCneighborhood.dnaurl)

				if not os.path.exists(__location__):
					os.makedirs(__location__)

				for count, NYCdrawing in enumerate(NYCdrawings):
					if NYCdrawing.drawnGeojson:
						filename = NYCneighborhood.dnaurl + "_" + str(count) + ".geojson"
						with open(os.path.join(__location__, filename), 'wb') as f:
							changed = NYCdrawing.drawnGeojson.replace('\"properties\":{}', '\"properties\":{\"ID\":\"'+ str(NYCdrawing.id) +'\", \"neighborhoodLive\":\"'+ str(NYCdrawing.neighborhoodLive.name) +'\", \"otherNeighborhood\":\"' + strip_non_ascii(NYCdrawing.otherNeighborhood) +'\", \"yearsLived\":\"' + str(NYCdrawing.yearsLived) +'\"}')
							f.write(changed)
							f.close()

		# Pull all neighborhoods CHI
		CHIneighborhoods = neighborhoodCHI.objects.all()

		for CHIneighborhood in CHIneighborhoods:
			CHIdrawings = neighborhoodDrawCHI.objects.filter(neighborhoodLive=CHIneighborhood).exclude(approved=False)
			if len(CHIdrawings) > 0:
				print CHIneighborhood.name
				chipath = "chi-" + CHIneighborhood.dnaurl
				__location__ = os.path.join(geojsonsPath, chipath)

				if not os.path.exists(__location__):
					os.makedirs(__location__)

				for count, CHIdrawing in enumerate(CHIdrawings):
					if CHIdrawing.drawnGeojson:
						filename = CHIneighborhood.dnaurl + "_" + str(count) + ".geojson"
						with open(os.path.join(__location__, filename), 'wb') as f:
							changed = CHIdrawing.drawnGeojson.replace('\"properties\":{}', '\"properties\":{\"ID\":\"'+ str(CHIdrawing.id) +'\", \"neighborhoodLive\":\"'+ str(CHIdrawing.neighborhoodLive.name) +'\", \"otherNeighborhood\":\"' + strip_non_ascii(CHIdrawing.otherNeighborhood) +'\", \"yearsLived\":\"' + str(CHIdrawing.yearsLived) +'\"}')
							f.write(changed)
							f.close()


	def handle(self, *args, **options):
		print "Exporting Geojsons...."
		self.export_geojsons()




