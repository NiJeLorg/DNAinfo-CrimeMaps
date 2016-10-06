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

class NYCSponsoredBuildings(models.Model):
	created = models.DateTimeField(auto_now=True)
	whereBuilding = models.ForeignKey(neighborhoodNYC, blank=True, null=True)
	buildingFootprint = models.TextField(default='')
	buildingName = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingAddress = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingText = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingStories = models.IntegerField(default=0, blank=False, null=False)
	buildingImage = models.ImageField(upload_to="img/%Y_%m_%d_%h_%M_%s", null=False, blank=False)

class NYCReporterBuildings(models.Model):
	created = models.DateTimeField(auto_now=True)
	whereBuilding = models.ForeignKey(neighborhoodNYC, blank=True, null=True)
	buildingFootprint = models.TextField(default='')
	buildingAddress = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingBBL = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingStories = models.IntegerField(default=0, blank=False, null=False)
	approved = models.NullBooleanField(default=None)
	description = models.CharField(max_length=200, default='', blank=True, null=True)
	zoning_pdfs = models.FileField(upload_to='reporter_zoning_pdfs/', blank=True, null=True)
	story1 = models.URLField(max_length=1000, default='', blank=True, null=True)
	projectName = models.CharField(max_length=255, default='', blank=True, null=True)
	buildingImage = models.ImageField(upload_to="img/%Y_%m_%d_%h_%M_%s", null=True, blank=True)
	buildingZip = models.CharField(max_length=255, default='', blank=False, null=False)

class NYC_DOB_Permit_Issuance(models.Model):
	created = models.DateTimeField(auto_now=True)
	borough = models.CharField(max_length=255, default='', blank=False, null=False)
	bin = models.CharField(max_length=255, default='', blank=False, null=False)
	house = models.CharField(max_length=255, default='', blank=False, null=False)
	street_name = models.CharField(max_length=255, default='', blank=False, null=False)
	job = models.CharField(max_length=255, default='', blank=False, null=False)
	job_doc = models.CharField(max_length=255, default='', blank=False, null=False)
	job_type = models.CharField(max_length=255, default='', blank=False, null=False)
	block = models.CharField(max_length=255, default='', blank=False, null=False)
	lot = models.CharField(max_length=255, default='', blank=False, null=False)
	community_board = models.CharField(max_length=255, default='', blank=False, null=False)
	zip_code = models.CharField(max_length=255, default='', blank=False, null=False)
	bldg_type = models.CharField(max_length=255, default='', blank=False, null=False)
	residential = models.CharField(max_length=255, default='', blank=False, null=False)
	permit_status = models.CharField(max_length=255, default='', blank=False, null=False)
	filing_status = models.CharField(max_length=255, default='', blank=False, null=False)
	permit_type = models.CharField(max_length=255, default='', blank=False, null=False)
	filing_date = models.DateField(blank=True, null=True)
	issuance_date = models.DateField(blank=True, null=True)
	expiration_date = models.DateField(blank=True, null=True)
	job_start_date = models.DateField(blank=True, null=True)
	buildingBBL = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingFootprint = models.TextField(default='')
	buildingStories = models.IntegerField(default=0, blank=False, null=False)
	scan_code = models.CharField(max_length=255, default='', blank=False, null=False)
	scan_code_updated = models.BooleanField(default=False)
	zoning_pdfs = models.FileField(upload_to='zoning_pdfs/', blank=True, null=True)



