from django.db import models

# Create your models here.
# model for NYC neighborhood look up table
class neighborhoodNYC(models.Model):
	dnaurl = models.CharField(max_length=255, default='', blank=False, null=False)
	name = models.CharField(max_length=255, default='', blank=False, null=False)
	county = models.CharField(max_length=255, default='', blank=False, null=False)

	def __unicode__(self):
		return self.name

class NYCskyline(models.Model):
	created = models.DateTimeField(auto_now=True)
	whereBuilding = models.ForeignKey(neighborhoodNYC, blank=True, null=True)
	iDontSeeMyNeighborhood = models.BooleanField(default=False)
	buildingFootprint = models.TextField(default='')
	buildingAddress = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingBBL = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingStories = models.IntegerField(default=0, blank=False, null=False)
	approved = models.NullBooleanField(default=None)

