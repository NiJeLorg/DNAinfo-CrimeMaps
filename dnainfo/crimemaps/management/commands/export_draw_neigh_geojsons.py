import sys,os
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
		BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
		geojsonsPath = os.path.join(BASE_DIR, 'geojsons')
		if not os.path.exists(geojsonsPath):
			os.makedirs(geojsonsPath)

		# Pull all neighborhoods NYC
		NYCneighborhoods = neighborhoodNYC.objects.all()

		for NYCneighborhood in NYCneighborhoods:
			NYCdrawings = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood).exclude(approved=False)
			if len(NYCdrawings) > 0:
				print NYCneighborhood.name	
				path = 'geojsons/' + NYCneighborhood.dnaurl
				__location__ = os.path.join(BASE_DIR, path)

				if not os.path.exists(__location__):
					os.makedirs(__location__)

				for count, NYCdrawing in enumerate(NYCdrawings):
					if NYCdrawing.drawnGeojson:
						filename = NYCneighborhood.dnaurl + "_" + str(count) + ".geojson"
						with open(os.path.join(__location__, filename), 'wb') as f:
							changed = NYCdrawing.drawnGeojson.replace('\"properties\":{}', '\"properties\":{\"ID\":\"'+ str(NYCdrawing.id) +'\", \"neighborhoodLive\":\"'+ str(NYCdrawing.neighborhoodLive.name) +'\", \"otherNeighborhood\":\"' + strip_non_ascii(NYCdrawing.otherNeighborhood) +'\", \"yearsLived\":\"' + str(NYCdrawing.yearsLived) +'\"}')
							f.write(changed)
							f.close()


	def handle(self, *args, **options):
		print "Exporting Geojsons...."
		self.export_geojsons()




