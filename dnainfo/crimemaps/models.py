from django.db import models

# NYC crime data models here
class compstat(models.Model):
	precinct = models.CharField(max_length=255, default='')
	start_date = models.DateField()
	end_date = models.DateField()
	murder = models.IntegerField()
	rape = models.IntegerField()
	robbery = models.IntegerField()
	felony_assault = models.IntegerField()
	burglary = models.IntegerField()
	grand_larceny = models.IntegerField()
	grand_larceny_auto = models.IntegerField()
	total = models.IntegerField()
	transit = models.IntegerField()
	housing = models.IntegerField()
	petit_larceny = models.IntegerField()
	misdemeanor_assault = models.IntegerField()
	misdemeanor_sex_crimes = models.IntegerField()
	shooting_victims = models.IntegerField()
	shooting_inc = models.IntegerField()
	murder_last_year = models.IntegerField()
	rape_last_year = models.IntegerField()
	robbery_last_year = models.IntegerField()
	felony_assault_last_year = models.IntegerField()
	burglary_last_year = models.IntegerField()
	grand_larceny_last_year = models.IntegerField()
	grand_larceny_auto_last_year = models.IntegerField()
	total_last_year = models.IntegerField()
	transit_last_year = models.IntegerField()
	housing_last_year = models.IntegerField()
	petit_larceny_last_year = models.IntegerField()
	misdemeanor_assault_last_year = models.IntegerField()
	misdemeanor_sex_crimes_last_year = models.IntegerField()
	shooting_victims_last_year = models.IntegerField()
	shooting_inc_last_year = models.IntegerField()

	def __unicode__(self):
		return self.precinct

class doitt(models.Model):
	longitude = models.FloatField()
	latitude = models.FloatField()
	YR = models.IntegerField()
	MO = models.IntegerField()
	X = models.IntegerField()
	Y = models.IntegerField()
	TOT = models.IntegerField()
	CR = models.CharField(max_length=255, default='')

	def __unicode__(self):
		return self.CR

class blotter(models.Model):
	Precinct = models.IntegerField(default=0)
	Address = models.CharField(max_length=255, default='')
	DateTime = models.DateTimeField(blank=True, null=True)
	BlotterWeek = models.DateField()
	CrimeType = models.CharField(max_length=255, default='', blank=True, null=True)
	PoliceSaid = models.TextField()
	Arrest = models.NullBooleanField(default=None, blank=True, null=True)
	Latitude = models.FloatField()
	Longitude = models.FloatField()
	JSDate = models.DateField()

	def __unicode__(self):
		return self.Address

class chiShootings(models.Model):
	ID = models.IntegerField(primary_key=True)
	Date = models.DateTimeField(blank=True, null=True)
	Address = models.CharField(max_length=255, default='')
	Lat = models.FloatField()
	Long = models.FloatField()
	RD = models.CharField(max_length=255, default='', blank=True, null=True)
	District = models.CharField(max_length=255, default='', blank=True, null=True)
	Beat = models.CharField(max_length=255, default='', blank=True, null=True)
	IUCR = models.CharField(max_length=255, default='', blank=True, null=True)
	Location = models.CharField(max_length=255, default='', blank=True, null=True)
	Status = models.CharField(max_length=255, default='', blank=True, null=True)
	Domestic = models.CharField(max_length=255, default='', blank=True, null=True)
	HomVics = models.IntegerField(default=0, blank=True, null=True)
	OtherShoo = models.IntegerField(default=0, blank=True, null=True)
	TotalVict = models.IntegerField(default=0, blank=True, null=True)
	Month = models.IntegerField(default=0, blank=True, null=True)
	Day = models.IntegerField(default=0, blank=True, null=True)
	Year = models.IntegerField(default=0, blank=True, null=True)
	Hour = models.IntegerField(default=0, blank=True, null=True)
	DayOfWeek = models.CharField(max_length=255, default='', blank=True, null=True)
	MonthYear = models.CharField(max_length=255, default='', blank=True, null=True)
	URL = models.TextField(default='', blank=True, null=True)
	Notes = models.TextField(default='', blank=True, null=True)
	Neighborhood = models.CharField(max_length=255, default='', blank=True, null=True)
	CommunityNo = models.IntegerField(default=0, blank=True, null=True)
	CommunityName = models.CharField(max_length=255, default='', blank=True, null=True)
	PoliceInvolved = models.CharField(max_length=255, default='', blank=True, null=True)

	def __unicode__(self):
		return self.Address

#model for NYC neighborhood look up table
class neighborhoodNYC(models.Model):
	dnaurl = models.CharField(max_length=255, default='', blank=False, null=False)
	name = models.CharField(max_length=255, default='', blank=False, null=False)

	def __unicode__(self):
		return self.name


#model for CHI neighborhood look up table
class neighborhoodCHI(models.Model):
	dnaurl = models.CharField(max_length=255, default='', blank=False, null=False)
	name = models.CharField(max_length=255, default='', blank=False, null=False)

	def __unicode__(self):
		return self.name

#model for NYC neighborhood drawing site
class neighborhoodDrawNYC(models.Model):
	created = models.DateTimeField(auto_now=True)
	neighborhoodLive = models.ForeignKey(neighborhoodNYC)
	otherNeighborhood = models.CharField(max_length=255, default='', blank=True, null=True)
	yearsLived = models.IntegerField(default=0, blank=False, null=False)
	drawnGeojson = models.TextField(default='')

#model for CHI neighborhood drawing site
class neighborhoodDrawCHI(models.Model):
	created = models.DateTimeField(auto_now=True)
	neighborhoodLive = models.ForeignKey(neighborhoodCHI)
	otherNeighborhood = models.CharField(max_length=255, default='', blank=True, null=True)
	yearsLived = models.IntegerField(default=0, blank=False, null=False)
	drawnGeojson = models.TextField(default='')


# model for Chicago zillow app
#class CHIZillow(models.Model):
#	zipcode = models.IntegerField(default=0, blank=False, null=False)
#	neighborhoods_covered = models.CharField(max_length=255, default='', blank=False, null=False)
#	population = models.IntegerField(default=0, blank=True, null=True)
#	pct_living_in_same_house = models.FloatField(default=0, blank=True, null=True)
#	med_hh_income = models.IntegerField(default=0, blank=True, null=True)
#	pct_change_sq_ft = models.FloatField(default=0, blank=True, null=True)
#	pct_homes_sold = models.FloatField(default=0, blank=True, null=True)
#	pct_change_avg_rent = models.FloatField(default=0, blank=True, null=True)
#	estimated_value_sq_ft = models.IntegerField(default=0, blank=True, null=True)
#	estimated_value_all_homes = models.IntegerField(default=0, blank=True, null=True)
#	avg_rent_sq_ft = models.FloatField(default=0, blank=True, null=True)
#	med_list_price = models.IntegerField(default=0, blank=True, null=True)
#	med_sale_price = models.IntegerField(default=0, blank=True, null=True)



#class CHIZillowTitles(models.Model):
#	zipcode = models.CharField(max_length=255, default='', blank=False, null=False)
#	neighborhoods_covered = models.CharField(max_length=255, default='', blank=False, null=False)
#	population = models.CharField(max_length=255, default='', blank=False, null=False)
#	pct_living_in_same_house = models.CharField(max_length=255, default='', blank=False, null=False)
#	med_hh_income = models.CharField(max_length=255, default='', blank=False, null=False)
#	pct_change_sq_ft = models.CharField(max_length=255, default='', blank=False, null=False)
#	pct_homes_sold = models.CharField(max_length=255, default='', blank=False, null=False)
#	pct_change_avg_rent = models.CharField(max_length=255, default='', blank=False, null=False)
#	estimated_value_sq_ft = models.CharField(max_length=255, default='', blank=False, null=False)
#	estimated_value_all_homes = models.CharField(max_length=255, default='', blank=False, null=False)
#	avg_rent_sq_ft = models.CharField(max_length=255, default='', blank=False, null=False)
#	med_list_price = models.CharField(max_length=255, default='', blank=False, null=False)
#	med_sale_price = models.CharField(max_length=255, default='', blank=False, null=False)


