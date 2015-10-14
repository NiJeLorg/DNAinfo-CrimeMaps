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
	approved = models.BooleanField(default=False)



#model for CHI neighborhood drawing site
class neighborhoodDrawCHI(models.Model):
	created = models.DateTimeField(auto_now=True)
	neighborhoodLive = models.ForeignKey(neighborhoodCHI)
	otherNeighborhood = models.CharField(max_length=255, default='', blank=True, null=True)
	yearsLived = models.IntegerField(default=0, blank=False, null=False)
	drawnGeojson = models.TextField(default='')
	approved = models.BooleanField(default=False)


# model for Chicago zillow app
class CHIZIPZillowData(models.Model):
	quarter = models.DateField(default='', blank=True, null=True)
	zip = models.IntegerField(default=0, blank=False, null=False)
	neighborhoodscovered = models.CharField(max_length=255, default='', blank=True, null=True)
	population2013censusestimate = models.IntegerField(default=0, blank=True, null=True)
	percentlivinginsamehouseoneyearago2013censusestimate = models.FloatField(default=0, blank=True, null=True)
	medianhouseholdincome2013censusestimate = models.FloatField(default=0, blank=True, null=True)
	changeinvaluesquarefootoverpreviousyear = models.FloatField(default=0, blank=True, null=True)
	changeavgrentsqfootoverpreviousyear = models.FloatField(default=0, blank=True, null=True)
	percentofhomessoldinpastyear = models.FloatField(default=0, blank=True, null=True)
	estimatedvaluesquarefoot = models.FloatField(default=0, blank=True, null=True)
	estimatedvalueofallhomes = models.FloatField(default=0, blank=True, null=True)
	avgrentsqfoot = models.FloatField(default=0, blank=True, null=True)
	medianlistprice = models.FloatField(default=0, blank=True, null=True)
	mediansaleprice = models.FloatField(default=0, blank=True, null=True)


class CHICookCountyRealEstateData(models.Model):
	doc = models.IntegerField(default=0, blank=False, null=False)
	classNum = models.CharField(max_length=255, default='', blank=True, null=True)
	description = models.TextField( default='', blank=True, null=True)
	buildingsize = models.IntegerField(default=0, blank=True, null=True)
	lotsize = models.IntegerField(default=0, blank=True, null=True)
	fulladdress = models.CharField(max_length=255, default='', blank=True, null=True)
	latitude = models.FloatField(default=0, blank=True, null=True)
	longitude = models.FloatField(default=0, blank=True, null=True)
	amount = models.FloatField(default=0, blank=True, null=True)
	recorded = models.DateField(default='', blank=True, null=True)
	executed = models.DateField(default='', blank=True, null=True)
	seller = models.CharField(max_length=255, default='', blank=True, null=True)
	buyer = models.CharField(max_length=255, default='', blank=True, null=True)
	pin = models.CharField(max_length=255, default='', blank=True, null=True)
	address = models.CharField(max_length=255, default='', blank=True, null=True)
	unit = models.CharField(max_length=255, default='', blank=True, null=True)
	pricepersqft = models.FloatField(default=0, blank=True, null=True)

class NYCStreetEasyRealEstateData(models.Model):
	area = models.CharField(max_length=255, default='', blank=False, null=False)
	dateperiod = models.DateField(default='', blank=True, null=True)
	medianaskingrent = models.FloatField(default=0, blank=True, null=True)
	medianaskingrentchcange = models.FloatField(default=0, blank=True, null=True)


