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

# paginator
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

# datetime
import datetime


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
			return HttpResponseRedirect(reverse('skyline_buildingHeight', args=(lookupObject.pk,)))
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
			return HttpResponseRedirect(reverse('skyline_exactLocation', args=(lookupObject.pk,)))
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
			return HttpResponseRedirect(reverse('skyline_end', args=(lookupObject.pk,)))
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
def skylineAdminDashboard(request):
	return render(request, 'skyline/adminDashboard.html', {})

@login_required
def skyline_UgcList(request):
	NYCskylineObjects = NYCskyline.objects.filter(approved=None).exclude(buildingFootprint='')
	paginator = Paginator(NYCskylineObjects, 10) # Show 10 buildings per page
	page = request.GET.get('page')
	try:
		objs = paginator.page(page)
	except PageNotAnInteger:
		# If page is not an integer, deliver first page.
		objs = paginator.page(1)
	except EmptyPage:
		# If page is out of range (e.g. 9999), deliver last page of results.
		objs = paginator.page(paginator.num_pages)


	return render(request, 'skyline/ugcList.html', {'NYCskylineObjects': objs})

@login_required
def skyline_UgcApprove(request, id=None):
	obj = NYCskyline.objects.get(id=id)
	obj.approved = True
	obj.save()
	return HttpResponseRedirect(reverse('skyline_UgcList'))

@login_required
def skyline_UgcReject(request, id=None):
	obj = NYCskyline.objects.get(id=id)
	obj.approved = False
	obj.save()
	return HttpResponseRedirect(reverse('skyline_UgcList'))

@login_required
def skyline_sponsoredWhatNeighborhood(request, id=None):
	if id:
		NYCSponsoredBuildingsObject = NYCSponsoredBuildings.objects.get(pk=id)
	else:
		NYCSponsoredBuildingsObject = NYCSponsoredBuildings()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCwhatNeighborhoodSponsoredForm(request.POST, instance=NYCSponsoredBuildingsObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCSponsoredBuildings.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_sponsoredBuildingHeight', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCwhatNeighborhoodSponsoredForm(instance=NYCSponsoredBuildingsObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/sponsoredWhatNeighborhood.html', {'form':form, 'NYCSponsoredBuildingsObject': NYCSponsoredBuildingsObject})

@login_required
def skyline_sponsoredBuildingHeight(request, id=None):
	if id:
		NYCSponsoredBuildingsObject = NYCSponsoredBuildings.objects.get(pk=id)
	else:
		NYCSponsoredBuildingsObject = NYCSponsoredBuildings()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCbuildingHeightSponsoredForm(request.POST, request.FILES, instance=NYCSponsoredBuildingsObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCSponsoredBuildings.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_sponsoredExactLocation', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCbuildingHeightSponsoredForm(instance=NYCSponsoredBuildingsObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/sponsoredBuildingHeight.html', {'form':form, 'NYCSponsoredBuildingsObject': NYCSponsoredBuildingsObject})

@login_required
def skyline_sponsoredExactLocation(request, id=None):
	if id:
		NYCSponsoredBuildingsObject = NYCSponsoredBuildings.objects.get(pk=id)
	else:
		NYCSponsoredBuildingsObject = NYCSponsoredBuildings()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCexactLocationSponsoredForm(request.POST, instance=NYCSponsoredBuildingsObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCSponsoredBuildings.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_sponsoredEnd', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCexactLocationSponsoredForm(instance=NYCSponsoredBuildingsObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/sponsoredExactLocation.html', {'form':form, 'NYCSponsoredBuildingsObject': NYCSponsoredBuildingsObject})

def skyline_sponsoredGetGeojson(request, id=None):

	NYCSponsoredBuildingsObject = NYCSponsoredBuildings.objects.get(pk=id)

	return JsonResponse(NYCSponsoredBuildingsObject.buildingFootprint, safe=False)

def skyline_getSponsoredGeojsons(request, id=None):

	NYCSponsoredBuildingsObjects = NYCSponsoredBuildings.objects.all()
	geojsons = []

	for obj in NYCSponsoredBuildingsObjects:
		geojsons.append(obj.buildingFootprint)
		

	return JsonResponse(geojsons, safe=False)

def skyline_getPermittedGeojsons(request, id=None):
	today = datetime.date.today()
	minyear = today.year - 1

	NYC_DOB_Permit_IssuanceObjects = NYC_DOB_Permit_Issuance.objects.filter(job_start_date__year__gte=minyear).exclude(buildingStories__exact = 0).exclude(buildingFootprint__in = ['', '-99'])
	geojsons = []

	for obj in NYC_DOB_Permit_IssuanceObjects:
		buildingHeight = (3.5*obj.buildingStories) + 9.625 + (2.625 * (obj.buildingStories/25));
		changed = '{\"type\":\"FeatureCollection\",\"features\":[{\"type\": \"Feature\", \"properties\":{\"color\":\"rgba(0, 205, 190, 0.5)\", \"roofColor\":\"rgba(0, 205, 190, 0.5)\", \"height\":\"' + str(buildingHeight) +'\"}, \"geometry\": ' + obj.buildingFootprint + '}]}'
		geojsons.append(changed)
		
	return JsonResponse(geojsons, safe=False)

@login_required
def skyline_sponsoredEnd(request, id=None):
	NYCSponsoredBuildingsObject = NYCSponsoredBuildings.objects.get(pk=id)

	return render(request, 'skyline/sponsoredEnd.html', {'NYCSponsoredBuildingsObject': NYCSponsoredBuildingsObject})

@login_required
def skyline_sponsoredList(request, id=None):
	NYCSponsoredBuildingsObjects = NYCSponsoredBuildings.objects.all()

	paginator = Paginator(NYCSponsoredBuildingsObjects, 10) # Show 10 buildings per page
	page = request.GET.get('page')
	try:
		objs = paginator.page(page)
	except PageNotAnInteger:
		# If page is not an integer, deliver first page.
		objs = paginator.page(1)
	except EmptyPage:
		# If page is out of range (e.g. 9999), deliver last page of results.
		objs = paginator.page(paginator.num_pages)

	return render(request, 'skyline/sponsoredList.html', {'NYCSponsoredBuildingsObjects': objs})

@login_required
def skyline_sponsoredRemove(request, id=None):
	NYCSponsoredBuildingsObject = NYCSponsoredBuildings.objects.get(pk=id)

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCremoveSponsoredForm(request.POST, instance=NYCSponsoredBuildingsObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			#delete this sponsored content
			NYCSponsoredBuildingsObject.delete()
			return HttpResponseRedirect(reverse('skyline_sponsoredList'))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCremoveSponsoredForm(instance=NYCSponsoredBuildingsObject)

	return render(request, 'skyline/sponsoredRemove.html', {'form': form, 'NYCSponsoredBuildingsObject': NYCSponsoredBuildingsObject})


@login_required
def skyline_reporterWhatNeighborhood(request, id=None):
	if id:
		NYCReporterBuildingsObject = NYCReporterBuildings.objects.get(pk=id)
	else:
		NYCReporterBuildingsObject = NYCReporterBuildings()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCwhatNeighborhoodReporterForm(request.POST, instance=NYCReporterBuildingsObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCReporterBuildings.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_reporterBuildingHeight', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCwhatNeighborhoodReporterForm(instance=NYCReporterBuildingsObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/reporterWhatNeighborhood.html', {'form':form, 'NYCReporterBuildingsObject': NYCReporterBuildingsObject})

@login_required
def skyline_reporterBuildingHeight(request, id=None):
	if id:
		NYCReporterBuildingsObject = NYCReporterBuildings.objects.get(pk=id)
	else:
		NYCReporterBuildingsObject = NYCReporterBuildings()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCbuildingHeightReporterForm(request.POST, request.FILES, instance=NYCReporterBuildingsObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCReporterBuildings.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_reporterExactLocation', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCbuildingHeightReporterForm(instance=NYCReporterBuildingsObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/reporterBuildingHeight.html', {'form':form, 'NYCReporterBuildingsObject': NYCReporterBuildingsObject})

@login_required
def skyline_reporterExactLocation(request, id=None):
	if id:
		NYCReporterBuildingsObject = NYCReporterBuildings.objects.get(pk=id)
	else:
		NYCReporterBuildingsObject = NYCReporterBuildings()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCexactLocationReporterForm(request.POST, instance=NYCReporterBuildingsObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCReporterBuildings.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_reporterEnd', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCexactLocationReporterForm(instance=NYCReporterBuildingsObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/reporterExactLocation.html', {'form':form, 'NYCReporterBuildingsObject': NYCReporterBuildingsObject})

def skyline_reporterGetGeojson(request, id=None):

	NYCReporterBuildingsObject = NYCReporterBuildings.objects.get(pk=id)

	return JsonResponse(NYCReporterBuildingsObject.buildingFootprint, safe=False)

def skyline_getReporterGeojsons(request, id=None):

	NYCReporterBuildingsObjects = NYCReporterBuildings.objects.all()
	geojsons = []

	for obj in NYCReporterBuildingsObjects:
		geojsons.append(obj.buildingFootprint)
		

	return JsonResponse(geojsons, safe=False)

@login_required
def skyline_reporterEnd(request, id=None):
	NYCReporterBuildingsObject = NYCReporterBuildings.objects.get(pk=id)

	return render(request, 'skyline/reporterEnd.html', {'NYCReporterBuildingsObject': NYCReporterBuildingsObject})

@login_required
def skyline_reporterList(request, id=None):
	NYCReporterBuildingsObjects = NYCReporterBuildings.objects.all()

	paginator = Paginator(NYCReporterBuildingsObjects, 10) # Show 10 buildings per page
	page = request.GET.get('page')
	try:
		objs = paginator.page(page)
	except PageNotAnInteger:
		# If page is not an integer, deliver first page.
		objs = paginator.page(1)
	except EmptyPage:
		# If page is out of range (e.g. 9999), deliver last page of results.
		objs = paginator.page(paginator.num_pages)

	return render(request, 'skyline/reporterList.html', {'NYCReporterBuildingsObjects': objs})

@login_required
def skyline_reporterRemove(request, id=None):
	NYCReporterBuildingsObject = NYCReporterBuildings.objects.get(pk=id)

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCremoveReporterForm(request.POST, instance=NYCReporterBuildingsObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			#delete this sponsored content
			NYCReporterBuildingsObject.delete()
			return HttpResponseRedirect(reverse('skyline_reporterList'))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCremoveReporterForm(instance=NYCReporterBuildingsObject)

	return render(request, 'skyline/reporterRemove.html', {'form': form, 'NYCReporterBuildingsObject': NYCReporterBuildingsObject})




@login_required
def skylineAdminCheck(request, id=None):
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
		return render(request, 'skyline/adminCheck.html', {'form':form, 'NYCskylineObject': NYCskylineObject, 'buildingCount': buildingCount})


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
				return HttpResponseRedirect(reverse('skyline_AdminNext'))
			else:
				# The supplied form contained errors - just print them to the terminal.
				print form.errors
		else:
			# If the request was not a POST, display the form to enter details.
			form = NYCapproveForm(instance=NYCskylineObject)

		# Bad form (or form details), no form supplied...
		# Render the form with error messages (if any).
		return render(request, 'skyline/adminTemplate.html', {'form':form, 'NYCskylineObject': NYCskylineObject, 'buildingCount': buildingCount})
