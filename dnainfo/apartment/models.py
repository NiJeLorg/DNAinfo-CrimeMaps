from django.db import models

# Create your models here.
#model for NYC neighborhood look up table
class neighborhoodNYC(models.Model):
	dnaurl = models.CharField(max_length=255, default='', blank=False, null=False)
	name = models.CharField(max_length=255, default='', blank=False, null=False)
	county = models.CharField(max_length=255, default='', blank=False, null=False)

	def __unicode__(self):
		return self.name

class NYCmyFirstApartment(models.Model):
	created = models.DateTimeField(auto_now=True)
	whenMoved = models.CharField(max_length=255, default='', blank=False, null=False)
	whereMoved = models.ForeignKey(neighborhoodNYC, blank=True, null=True)
	iDontSeeMyNeighborhood = models.BooleanField(default=False)
	firstApartmentLocation = models.TextField(default='')
	exactYearMoved = models.IntegerField(default=0, blank=False, null=False)
	bedrooms = models.IntegerField(default=0, blank=False, null=False)
	rentSplit = models.IntegerField(default=0, blank=False, null=False)
	iPaid = models.FloatField(default=0, blank=False, null=False)
	allPaid = models.FloatField(default=0, blank=False, null=False)

class cpi(models.Model):
	year = models.IntegerField(default=0, blank=False, null=False)
	cpi = models.FloatField(max_length=255, default='', blank=False, null=False)

class zillowMedianRentListPrice(models.Model):
	RegionName = models.CharField(max_length=255, default='', blank=True, null=True)
	City = models.CharField(max_length=255, default='', blank=True, null=True)
	State = models.CharField(max_length=255, default='', blank=True, null=True)
	Metro = models.CharField(max_length=255, default='', blank=True, null=True)
	CountyName = models.CharField(max_length=255, default='', blank=True, null=True)
	SizeRank = models.CharField(max_length=255, default='', blank=True, null=True)
	Cost = models.FloatField(default=0, blank=False, null=False)
	bedrooms = models.IntegerField(default=0, blank=False, null=False)

