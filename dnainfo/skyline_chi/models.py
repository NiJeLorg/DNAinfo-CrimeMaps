from django.db import models

# Create your models here.
# model for CHI neighborhood look up table
class neighborhoodCHI(models.Model):
	dnaurl = models.CharField(max_length=255, default='', blank=False, null=False)
	name = models.CharField(max_length=255, default='', blank=False, null=False)
	county = models.CharField(max_length=255, default='', blank=False, null=False)

	def __unicode__(self):
		return self.name

class CHIskyline(models.Model):
	created = models.DateTimeField(auto_now=True)
	whereBuilding = models.ForeignKey(neighborhoodCHI, blank=True, null=True)
	iDontSeeMyNeighborhood = models.BooleanField(default=False)
	buildingFootprint = models.TextField(default='')
	buildingAddress = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingPIN = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingStories = models.IntegerField(default=0, blank=False, null=False)
	approved = models.NullBooleanField(default=None)

class CHISponsoredBuildings(models.Model):
	created = models.DateTimeField(auto_now=True)
	whereBuilding = models.ForeignKey(neighborhoodCHI, blank=True, null=True)
	buildingFootprint = models.TextField(default='')
	buildingName = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingAddress = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingText = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingStories = models.IntegerField(default=0, blank=False, null=False)
	buildingImage = models.ImageField(upload_to="img/%Y_%m_%d_%h_%M_%s", null=False, blank=False)

class CHIReporterBuildings(models.Model):
	created = models.DateTimeField(auto_now=True)
	whereBuilding = models.ForeignKey(neighborhoodCHI, blank=True, null=True)
	buildingFootprint = models.TextField(default='')
	buildingAddress = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingPIN = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingStories = models.IntegerField(default=0, blank=False, null=False)
	approved = models.NullBooleanField(default=None)
	description = models.CharField(max_length=200, default='', blank=True, null=True)
	zoning_pdfs = models.URLField(max_length=1000, default='', blank=True, null=True)
	story1 = models.URLField(max_length=1000, default='', blank=True, null=True)
	projectName = models.CharField(max_length=255, default='', blank=True, null=True)
	buildingImage = models.ImageField(upload_to="img/%Y_%m_%d_%h_%M_%s", null=True, blank=True)
	buildingZip = models.CharField(max_length=255, default='', blank=True, null=True)



class CHI_Building_Permits(models.Model):
	created = models.DateTimeField(auto_now=True)
	ID = models.IntegerField(primary_key=True)
	permit = models.CharField(max_length=255, default='', blank=False, null=False)
	permit_type = models.CharField(max_length=255, default='', blank=False, null=False)
	issue_date = models.DateField(blank=True, null=True)
	street_number = models.CharField(max_length=255, default='', blank=False, null=False)
	street_direction = models.CharField(max_length=255, default='', blank=False, null=False)
	street_name = models.CharField(max_length=255, default='', blank=False, null=False)
	suffix = models.CharField(max_length=255, default='', blank=False, null=False)
	work_description = models.TextField(default='', blank=True, null=True)
	pin1 = models.CharField(max_length=255, default='', blank=False, null=False)
	latitude = models.CharField(max_length=255, default='', blank=False, null=False)
	longitude = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingFootprint = models.TextField(default='')
	buildingStories = models.IntegerField(default=0, blank=False, null=False)



