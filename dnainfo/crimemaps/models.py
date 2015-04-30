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
	DateTime = models.DateTimeField()
	BlotterWeek = models.DateField()
	CrimeType = models.CharField(max_length=255, default='')
	PoliceSaid = models.TextField()
	Arrest = models.NullBooleanField(default=None)
	Latitude = models.FloatField()
	Longitude = models.FloatField()
	JSDate = models.DateField()

	def __unicode__(self):
		return self.Address





