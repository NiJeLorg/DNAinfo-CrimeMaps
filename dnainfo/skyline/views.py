from django.shortcuts import render, redirect

from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, JsonResponse

#import all apartment models and forms
from skyline.models import *
from skyline.forms import *

# bitly API
import bitly_api

#decorators
from django.contrib.auth.decorators import login_required


# views for DNAinfo my first apartment
def index(request):
	return redirect('http://www.dnainfo.com/')

def skyline_intro(request):
	return render(request, 'skyline/intro.html', {})

def skyline_whatNeighborhood(request, id=None):
	if id:
		NYCskylineObject = NYCskyline.objects.get(pk=id)
	else:
		NYCskylineObject = NYCskyline()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCwhatNeighborhoodForm(request.POST, instance=NYCskylineObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCskyline.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('buildingHeight', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCwhatNeighborhoodForm(instance=NYCskylineObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/whatNeighborhood.html', {'form':form, 'NYCskylineObject': NYCskylineObject})


def skyline_buildingHeight(request, id=None):
	if id:
		NYCskylineObject = NYCskyline.objects.get(pk=id)
	else:
		NYCskylineObject = NYCskyline()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCbuildingHeightForm(request.POST, instance=NYCskylineObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCskyline.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('exactLocation', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCbuildingHeightForm(instance=NYCskylineObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/buildingHeight.html', {'form':form, 'NYCskylineObject': NYCskylineObject})


def skyline_exactLocation(request, id=None):
	if id:
		NYCskylineObject = NYCskyline.objects.get(pk=id)
	else:
		NYCskylineObject = NYCskyline()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCexactLocationForm(request.POST, instance=NYCskylineObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCskyline.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('end', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCexactLocationForm(instance=NYCskylineObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/exactLocation.html', {'form':form, 'NYCskylineObject': NYCskylineObject})


def skyline_getGeojson(request, id=None):

	NYCskylineObject = NYCskyline.objects.get(pk=id)

	return JsonResponse(NYCskylineObject.buildingFootprint, safe=False)


def skyline_end(request, id=None):
	if id:
		NYCskylineObject = NYCskyline.objects.get(pk=id)
	else:
		NYCskylineObject = NYCskyline()

	# social urls
	url = "https://visualizations.dnainfo.com/skyline/nyc/results/" + str(id) + "/"
	# connect to Bitly API
	c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
	bitlyURL = c.shorten(url)

	return render(request, 'skyline/end.html', {'NYCskylineObject': NYCskylineObject, "bitlyURL": bitlyURL})

def skyline_results(request, id=None):
	if id:
		NYCskylineObject = NYCskyline.objects.get(pk=id)
	else:
		NYCskylineObject = NYCskyline()


	# social urls
	url = "https://visualizations.dnainfo.com/skyline/nyc/results/" + str(id) + "/"
	# connect to Bitly API
	c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
	bitlyURL = c.shorten(url)

	return render(request, 'skyline/results.html', {'NYCskylineObject': NYCskylineObject, "bitlyURL": bitlyURL})

@login_required
def skylineAdmin(request, id=None):
	buildingCount = NYCskyline.objects.filter(approved=None).exclude(buildingFootprint='').count()
	if buildingCount == 0:
		return render(request, 'skyline/adminNoBuildings.html', {})
	else:
		if id:
			NYCskylineObject = NYCskyline.objects.get(pk=id)
		else:
			qs = NYCskyline.objects.filter(approved=None).exclude(buildingFootprint='')[:1]
			r = list(qs)
			NYCskylineObject = r[0]

		form = NYCapproveForm(instance=NYCskylineObject)

		# Bad form (or form details), no form supplied...
		# Render the form with error messages (if any).
		return render(request, 'skyline/admin.html', {'form':form, 'NYCskylineObject': NYCskylineObject, 'buildingCount': buildingCount})


@login_required
def skylineAdminNext(request, id=None):
	buildingCount = NYCskyline.objects.filter(approved=None).exclude(buildingFootprint='').count()
	if buildingCount == 0:
		return render(request, 'skyline/adminNoBuildings.html', {})
	else:
		if id:
			NYCskylineObject = NYCskyline.objects.get(pk=id)
		else:
			qs = NYCskyline.objects.filter(approved=None).exclude(buildingFootprint='')[:1]
			r = list(qs)
			NYCskylineObject = r[0]

		# A HTTP POST?
		if request.method == 'POST':
			form = NYCapproveForm(request.POST, instance=NYCskylineObject)

			# Have we been provided with a valid form?
			if form.is_valid():
				# Save the new data to the database.
				f = form.save()
				lookupObject = NYCskyline.objects.get(pk=f.pk)
				return HttpResponseRedirect(reverse('skylineAdminNext'))
			else:
				# The supplied form contained errors - just print them to the terminal.
				print form.errors
		else:
			# If the request was not a POST, display the form to enter details.
			form = NYCapproveForm(instance=NYCskylineObject)

		# Bad form (or form details), no form supplied...
		# Render the form with error messages (if any).
		return render(request, 'skyline/adminTemplate.html', {'form':form, 'NYCskylineObject': NYCskylineObject, 'buildingCount': buildingCount})
