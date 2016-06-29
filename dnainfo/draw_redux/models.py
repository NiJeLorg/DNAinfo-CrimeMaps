from django.db import models

# Create your models here.
# model for NYC neighborhood look up table
class neighborhoodNYC_redux(models.Model):
	dnaurl = models.CharField(max_length=255, default='', blank=False, null=False)
	name = models.CharField(max_length=255, default='', blank=False, null=False)
	county = models.CharField(max_length=255, default='', blank=False, null=False)

	def __unicode__(self):
		return self.name

class NYCInOrOut(models.Model):
	created = models.DateTimeField(auto_now=True)
	whatNeighborhood = models.ForeignKey(neighborhoodNYC_redux, blank=True, null=True)
	inOrOut = models.TextField(default='')


