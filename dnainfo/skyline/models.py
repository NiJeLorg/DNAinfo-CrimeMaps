from django.db import models
from django.contrib.auth.models import User

#validator
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
# model for NYC neighborhood look up table
class neighborhoodNYC(models.Model):
	dnaurl = models.CharField(max_length=255, default='', blank=False, null=False)
	name = models.CharField(max_length=255, default='', blank=False, null=False)
	county = models.CharField(max_length=255, default='', blank=False, null=False)

	def __unicode__(self):
		return self.name

class NYCskyline(models.Model):
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
	whereBuilding = models.ForeignKey(neighborhoodNYC, blank=True, null=True)
	buildingFootprint = models.TextField(default='')
	buildingAddress = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingBBL = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingStories = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(150)], default=1, blank=False, null=False)
	projectName = models.CharField(max_length=255, default='', blank=True, null=True)
	imageDocOrURL = models.NullBooleanField(default=None)
	buildingImage = models.ImageField(upload_to="img/%Y_%m_%d_%h_%M_%s", null=True, blank=True)
	buildingDoc = models.FileField(upload_to='buildingDocs/', blank=True, null=True)
	buildingURL = models.URLField(max_length=1000, default='', blank=True, null=True)
	userEmail = models.EmailField(max_length=255, default='', blank=True, null=True)
	newsletter = models.BooleanField(default=False)
	approved = models.NullBooleanField(default=None)
	reviewed_by = models.ForeignKey(User, blank=True, null=True)

	class Meta:
		permissions = (
			("modify_UGC", "Can add, edit, update, delete UCG buildings."),
		)

class NYCSponsoredBuildings(models.Model):
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
	created_by = models.ForeignKey(User, blank=True, null=True, related_name="sponsored_created_by")
	updated_by = models.ForeignKey(User, blank=True, null=True, related_name="sponsored_updated_by")
	whereBuilding = models.ForeignKey(neighborhoodNYC, blank=True, null=True)
	buildingFootprint = models.TextField(default='')
	buildingName = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingAddress = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingText = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingStories = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(150)], default=1, blank=False, null=False)
	buildingImage = models.ImageField(upload_to="img/%Y_%m_%d_%h_%M_%s", null=False, blank=False)
	archived = models.BooleanField(default=False)

	class Meta:
		permissions = (
			("modify_sponsored", "Can add, edit, update, delete sponsored buildings."),
		)

class NYCReporterBuildings(models.Model):
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
	created_by = models.ForeignKey(User, blank=True, null=True, related_name="reporter_created_by")
	updated_by = models.ForeignKey(User, blank=True, null=True, related_name="reporter_updated_by")
	whereBuilding = models.ForeignKey(neighborhoodNYC, blank=True, null=True)
	buildingFootprint = models.TextField(default='')
	buildingAddress = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingBBL = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingStories = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(150)], default=1, blank=False, null=False)
	approved = models.NullBooleanField(default=None)
	description = models.CharField(max_length=200, default='', blank=True, null=True)
	zoning_pdfs = models.URLField(max_length=1000, default='', blank=True, null=True)
	story1 = models.URLField(max_length=1000, default='', blank=True, null=True)
	projectName = models.CharField(max_length=255, default='', blank=True, null=True)
	buildingImage = models.ImageField(upload_to="img/%Y_%m_%d_%h_%M_%s", null=True, blank=True)
	buildingZip = models.CharField(max_length=255, default='', blank=False, null=False)
	archived = models.BooleanField(default=False)

class NYC_DOB_Permit_Issuance(models.Model):
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
	created_by = models.ForeignKey(User, blank=True, null=True, related_name="permitted_created_by")
	updated_by = models.ForeignKey(User, blank=True, null=True, related_name="permitted_updated_by")
	whereBuilding = models.ForeignKey(neighborhoodNYC, blank=False, null=True)	
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
	buildingStories = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(150)], default=1, blank=False, null=False)
	scan_code = models.CharField(max_length=255, default='', blank=False, null=False)
	scan_code_updated = models.BooleanField(default=False)
	zoning_pdfs = models.URLField(max_length=1000, default='', blank=True, null=True)
	story1 = models.URLField(max_length=1000, default='', blank=True, null=True)
	projectName = models.CharField(max_length=255, default='', blank=True, null=True)
	buildingImage = models.ImageField(upload_to="img/%Y_%m_%d_%h_%M_%s", null=True, blank=True)
	buildingZip = models.CharField(max_length=255, default='', blank=False, null=False)
	buildingAddress = models.CharField(max_length=255, default='', blank=False, null=False)
	description = models.CharField(max_length=200, default='', blank=True, null=True)
	archived = models.BooleanField(default=False)

