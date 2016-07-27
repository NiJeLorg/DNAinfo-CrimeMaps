from django.shortcuts import render, redirect

from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, JsonResponse

#import all draw_redux models and forms
from draw_redux.models import *
from draw_redux.forms import *

#import draw your neighborhood models to get counts of the number of drawings in each neighborhood
from crimemaps.models import neighborhoodDrawNYC, neighborhoodDrawCHI, neighborhoodNYC, neighborhoodCHI 

# bitly API
import bitly_api


# views for DNAinfo my first apartment
def index(request):
	return redirect('http://www.dnainfo.com/')

def draw_redux_intro(request):
	return render(request, 'draw_redux/intro.html', {})

def draw_redux_whatNeighborhood(request, id=None):
	if id:
		NYCInOrOutObject = NYCInOrOut.objects.get(pk=id)
	else:
		NYCInOrOutObject = NYCInOrOut()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCwhatNeighborhoodForm(request.POST, instance=NYCInOrOutObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCInOrOut.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('draw_redux_pick', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCwhatNeighborhoodForm(instance=NYCInOrOutObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'draw_redux/whatNeighborhood.html', {'form':form, 'NYCInOrOutObject': NYCInOrOutObject})


def draw_redux_pick(request, id=None):
	if id:
		NYCInOrOutObject = NYCInOrOut.objects.get(pk=id)
	else:
		NYCInOrOutObject = NYCInOrOut()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCinOrOutForm(request.POST, instance=NYCInOrOutObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCInOrOut.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('draw_redux_end', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCinOrOutForm(instance=NYCInOrOutObject)

	# get counts of each neighborhood and how many approved, non-empty drawings are present
	NYCneighborhoods = neighborhoodNYC.objects.all()
	# loop though neighborhoods
	for NYCneighborhood in NYCneighborhoods:
		#get count of valid drawings
		ALL = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, approved=True).exclude(drawnGeojson__exact='').count()
		NYCneighborhood.drawingCount = ALL
		# remove dashes from dnaurl
		NYCneighborhood.dnaurl = NYCneighborhood.dnaurl.replace('-', '')


	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'draw_redux/pick.html', {'form':form, 'NYCInOrOutObject': NYCInOrOutObject, 'NYCneighborhoods':NYCneighborhoods})


def draw_redux_getAdded(request, id=None):

	NYCInOrOutObject = NYCInOrOut.objects.get(pk=id)

	return JsonResponse(NYCInOrOutObject.added, safe=False)


def draw_redux_getRemoved(request, id=None):

	NYCInOrOutObject = NYCInOrOut.objects.get(pk=id)

	return JsonResponse(NYCInOrOutObject.removed, safe=False)


def draw_redux_end(request, id=None):
	if id:
		NYCInOrOutObject = NYCInOrOut.objects.get(pk=id)
	else:
		NYCInOrOutObject = NYCInOrOut()

	# get counts of each neighborhood and how many approved, non-empty drawings are present
	NYCneighborhoods = neighborhoodNYC.objects.all()
	# loop though neighborhoods
	for NYCneighborhood in NYCneighborhoods:
		#get count of valid drawings
		ALL = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, approved=True).exclude(drawnGeojson__exact='').count()
		NYCneighborhood.drawingCount = ALL
		# remove dashes from dnaurl
		NYCneighborhood.dnaurl = NYCneighborhood.dnaurl.replace('-', '')

	# social urls
	url = "https://visualizations.dnainfo.com/in-or-out/nyc/results/" + str(id) + "/"
	# connect to Bitly API
	c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
	bitlyURL = c.shorten(url)

	return render(request, 'draw_redux/end.html', {'NYCInOrOutObject': NYCInOrOutObject, 'NYCneighborhoods':NYCneighborhoods, "bitlyURL": bitlyURL})

def draw_redux_results(request, id=None):
	if id:
		NYCInOrOutObject = NYCInOrOut.objects.get(pk=id)
	else:
		NYCInOrOutObject = NYCInOrOut()

	# get counts of each neighborhood and how many approved, non-empty drawings are present
	NYCneighborhoods = neighborhoodNYC.objects.all()
	# loop though neighborhoods
	for NYCneighborhood in NYCneighborhoods:
		#get count of valid drawings
		ALL = neighborhoodDrawNYC.objects.filter(neighborhoodLive=NYCneighborhood, approved=True).exclude(drawnGeojson__exact='').count()
		NYCneighborhood.drawingCount = ALL
		# remove dashes from dnaurl
		NYCneighborhood.dnaurl = NYCneighborhood.dnaurl.replace('-', '')

	# social urls
	url = "https://visualizations.dnainfo.com/in-or-out/nyc/results/" + str(id) + "/"
	# connect to Bitly API
	c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
	bitlyURL = c.shorten(url)

	return render(request, 'draw_redux/results.html', {'NYCInOrOutObject': NYCInOrOutObject, 'NYCneighborhoods':NYCneighborhoods, "bitlyURL": bitlyURL})

