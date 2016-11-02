from django.shortcuts import render, redirect

from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

# for CSV downloading
import unicodecsv as csv

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
def skyline_createBuildingsCSV(request):
	# Create the HttpResponse object with the appropriate CSV header.
	response = HttpResponse(content_type='text/csv')
	response['Content-Disposition'] = 'attachment; filename="NYC_permitted_buildings_on_map.csv"'

	writer = csv.writer(response, encoding='utf-8')
	writer.writerow(['created', 'updated', 'created_by', 'updated_by', 'whereBuilding', 'borough', 'bin', 'house', 'street_name', 'job', 'job_doc', 'job_type', 'block', 'lot', 'community_board', 'zip_code', 'bldg_type', 'residential', 'permit_status', 'filing_status', 'permit_type', 'filing_date', 'issuance_date', 'expiration_date', 'job_start_date', 'buildingBBL', 'buildingFootprint', 'buildingStories', 'scan_code', 'scan_code_updated', 'zoning_pdfs', 'story1', 'projectName', 'buildingImage', 'buildingZip', 'buildingAddress', 'description', 'archived'])

	#pull data 
	today = datetime.date.today()
	minyear = today.year - 1

	NYC_DOB_Permit_IssuanceObjects = NYC_DOB_Permit_Issuance.objects.filter(job_start_date__year__gte=minyear).exclude(buildingStories__exact = 0).exclude(buildingFootprint__in = ['', '-99'])


	for o in NYC_DOB_Permit_IssuanceObjects:
		if o.whereBuilding:
			neighborhoodName = o.whereBuilding.name
		else:
			neighborhoodName = None
		
		writer.writerow([o.created, o.updated, o.created_by, o.updated_by, neighborhoodName, o.borough, o.bin, o.house, o.street_name, o.job, o.job_doc, o.job_type, o.block, o.lot, o.community_board, o.zip_code, o.bldg_type, o.residential, o.permit_status, o.filing_status ,o.permit_type, o.filing_date, o.issuance_date, o.expiration_date, o.job_start_date, o.buildingBBL, o.buildingFootprint, o.buildingStories, o.scan_code, o.scan_code_updated, o.zoning_pdfs, o.story1, o.projectName, o.buildingImage, o.buildingZip, o.buildingAddress, o.description, o.archived])

	return response

@login_required
def skyline_UgcList(request):
	NYCskylineObjects = NYCskyline.objects.filter(approved=None).exclude(buildingFootprint='')
	paginator = Paginator(NYCskylineObjects, 20) # Show 10 buildings per page
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
	obj.reviewed_by = request.user
	obj.save()
	return HttpResponseRedirect(reverse('skyline_UgcList'))

@login_required
def skyline_UgcReject(request, id=None):
	obj = NYCskyline.objects.get(id=id)
	obj.approved = False
	obj.reviewed_by = request.user
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
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			try:
				lookupObject = NYCSponsoredBuildings.objects.get(pk=f.pk)
				# add user 
				if lookupObject.created_by:
					f.updated_by = request.user
				else:
					f.created_by = request.user
				# save form
				f.save()
			except NYCSponsoredBuildings.DoesNotExist:
				f.created_by = request.user
				# save form
				f.save()
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
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			lookupObject = NYCSponsoredBuildings.objects.get(pk=f.pk)
			# add user 
			if lookupObject.created_by:
				f.updated_by = request.user
			else:
				f.created_by = request.user
			# save form
			f.save()
			# pull object and check to see if it have a created_by field filled out
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
def skyline_sponsoredBuildingHeightEdit(request, id=None):
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
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			lookupObject = NYCSponsoredBuildings.objects.get(pk=f.pk)
			# add user 
			if lookupObject.created_by:
				f.updated_by = request.user
			else:
				f.created_by = request.user
			# save form
			f.save()
			# pull object and check to see if it have a created_by field filled out
			lookupObject = NYCSponsoredBuildings.objects.get(pk=f.pk)
			# route request depending on which button was clicked
			if 'save' in request.POST:
				return HttpResponseRedirect(reverse('skyline_sponsoredList'))
			elif 'pick_plot' in request.POST:
				return HttpResponseRedirect(reverse('skyline_sponsoredExactLocation', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCbuildingHeightSponsoredForm(instance=NYCSponsoredBuildingsObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/sponsoredBuildingHeightEdit.html', {'form':form, 'NYCSponsoredBuildingsObject': NYCSponsoredBuildingsObject})

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
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			lookupObject = NYCSponsoredBuildings.objects.get(pk=f.pk)
			# add user 
			if lookupObject.created_by:
				f.updated_by = request.user
			else:
				f.created_by = request.user

			# save form
			f.save()
			
			return HttpResponseRedirect(reverse('skyline_sponsoredList'))
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

	NYCSponsoredBuildingsObjects = NYCSponsoredBuildings.objects.exclude(archived=True).exclude(buildingStories__exact = 0).exclude(buildingFootprint__in = ['', '-99'])
	geojsons = []

	for obj in NYCSponsoredBuildingsObjects:
		geojsons.append(obj.buildingFootprint)
		

	return JsonResponse(geojsons, safe=False)

def skyline_getPermittedGeojsons(request, boro=None):
	today = datetime.date.today()
	minyear = today.year - 1

	NYC_DOB_Permit_IssuanceObjects = NYC_DOB_Permit_Issuance.objects.filter(job_start_date__year__gte=minyear, borough__iexact=boro).exclude(buildingStories__exact = 0).exclude(buildingFootprint__in = ['', '-99'])
	geojsons = []

	for obj in NYC_DOB_Permit_IssuanceObjects:
		buildingHeight = (3.5*obj.buildingStories) + 9.625 + (2.625 * (obj.buildingStories/25));
		changed = '{\"type\":\"FeatureCollection\",\"features\":[{\"type\": \"Feature\", \"properties\":{\"color\":\"#00cdbe\", \"roofColor\":\"#00cdbe\", \"height\":\"' + str(buildingHeight) +'\", \"zoning_pdfs\":\"visualizations/media/' + str(obj.zoning_pdfs) +'\", \"address\":\"' + obj.buildingAddress.strip() +'\", \"stories\":\"' + str(obj.buildingStories) +'\", \"story1\":\"' + str(obj.story1) +'\", \"projectName\":\"' + obj.projectName +'\", \"buildingImage\":\"visualizations/media/' + str(obj.buildingImage) +'\", \"buildingZip\":\"' + obj.buildingZip +'\", \"objectID\":\"' + str(obj.id) +'\", \"description\":\"' + obj.description +'\"}, \"geometry\": ' + obj.buildingFootprint + '}]}'
		geojsons.append(changed)
		
	return JsonResponse(geojsons, safe=False)

@login_required
def skyline_sponsoredEnd(request, id=None):
	NYCSponsoredBuildingsObject = NYCSponsoredBuildings.objects.get(pk=id)

	return render(request, 'skyline/sponsoredEnd.html', {'NYCSponsoredBuildingsObject': NYCSponsoredBuildingsObject})

@login_required
def skyline_sponsoredList(request, id=None):
	NYCSponsoredBuildingsObjects = NYCSponsoredBuildings.objects.exclude(archived=True).order_by('-updated', 'buildingName')

	paginator = Paginator(NYCSponsoredBuildingsObjects, 20) # Show 10 buildings per page
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
			#archive this sponsored content
			NYCSponsoredBuildingsObject.archived = True
			NYCSponsoredBuildingsObject.updated_by = request.user
			NYCSponsoredBuildingsObject.save()
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
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			try:
				lookupObject = NYCReporterBuildings.objects.get(pk=f.pk)
				# add user 
				if lookupObject.created_by:
					f.updated_by = request.user
				else:
					f.created_by = request.user
				# save form
				f.save()
			except NYCReporterBuildings.DoesNotExist:
				f.created_by = request.user
				# save form
				f.save()
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
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			lookupObject = NYCReporterBuildings.objects.get(pk=f.pk)
			# add user 
			if lookupObject.created_by:
				f.updated_by = request.user
			else:
				f.created_by = request.user
			# save form
			f.save()
			# pull object and check to see if it have a created_by field filled out
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
def skyline_reporterBuildingHeightEdit(request, id=None):
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
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			lookupObject = NYCReporterBuildings.objects.get(pk=f.pk)
			# add user 
			if lookupObject.created_by:
				f.updated_by = request.user
			else:
				f.created_by = request.user
			# save form
			f.save()
			# pull object and check to see if it have a created_by field filled out
			lookupObject = NYCReporterBuildings.objects.get(pk=f.pk)
			# route request depending on which button was clicked
			if 'save' in request.POST:
				return HttpResponseRedirect(reverse('skyline_reporterList'))
			elif 'pick_plot' in request.POST:
				return HttpResponseRedirect(reverse('skyline_reporterExactLocation', args=(lookupObject.pk,)))

		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCbuildingHeightReporterForm(instance=NYCReporterBuildingsObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/reporterBuildingHeightEdit.html', {'form':form, 'NYCReporterBuildingsObject': NYCReporterBuildingsObject})

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
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			lookupObject = NYCReporterBuildings.objects.get(pk=f.pk)
			# add user 
			if lookupObject.created_by:
				f.updated_by = request.user
			else:
				f.created_by = request.user
			# save form
			f.save()

			return HttpResponseRedirect(reverse('skyline_reporterList'))
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

	NYCReporterBuildingsObjects = NYCReporterBuildings.objects.exclude(archived=True).exclude(buildingStories__exact = 0).exclude(buildingFootprint__in = ['', '-99'])
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
	NYCReporterBuildingsObjects = NYCReporterBuildings.objects.exclude(archived=True).order_by('-updated', 'projectName')

	paginator = Paginator(NYCReporterBuildingsObjects, 20) # Show 10 buildings per page
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
			#archive this building
			NYCReporterBuildingsObject.archived = True
			NYCReporterBuildingsObject.updated_by = request.user
			NYCReporterBuildingsObject.save()
			return HttpResponseRedirect(reverse('skyline_reporterList'))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCremoveReporterForm(instance=NYCReporterBuildingsObject)

	return render(request, 'skyline/reporterRemove.html', {'form': form, 'NYCReporterBuildingsObject': NYCReporterBuildingsObject})


@login_required
def skyline_viewAllWhatNeighborhood(request):
	# A HTTP POST?
	if request.method == 'POST':
		form = NYCwhatNeighborhoodReporterForm(request.POST)

		# Have we been provided with a valid form?
		if form.is_valid():
			return HttpResponseRedirect(reverse('skyline_viewAll', args=(form.cleaned_data['whereBuilding'].id,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCwhatNeighborhoodReporterForm()

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/viewAllWhatNeighborhood.html', {'form':form,})

@login_required
def skyline_viewAll(request, id=None):
	#pull neighborhood
	hood = neighborhoodNYC.objects.get(pk=id)
	return render(request, 'skyline/viewAll.html', {'hood':hood,})	


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

@login_required
def skyline_permittedBuildingHeight(request, id=None):
	if id:
		NYC_DOB_Permit_IssuanceObject = NYC_DOB_Permit_Issuance.objects.get(pk=id)
	else:
		NYC_DOB_Permit_IssuanceObject = NYC_DOB_Permit_Issuance()

	# get hoodID from URL to set combo box with new value if one does not yet exist
	hoodID = request.GET.get('hoodID')

	if not NYC_DOB_Permit_IssuanceObject.whereBuilding:
		if hoodID: 
			#look up neighborhood
			hood = neighborhoodNYC.objects.get(id=int(hoodID))
			NYC_DOB_Permit_IssuanceObject.whereBuilding = hood
			NYC_DOB_Permit_IssuanceObject.save()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYC_DOB_Permit_IssuanceForm(request.POST, request.FILES, instance=NYC_DOB_Permit_IssuanceObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			lookupObject = NYC_DOB_Permit_Issuance.objects.get(pk=f.pk)
			# add user 
			if lookupObject.created_by:
				f.updated_by = request.user
			else:
				f.created_by = request.user
			# save form
			f.save()
			# pull object and check to see if it have a created_by field filled out
			lookupObject = NYC_DOB_Permit_Issuance.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_viewAll', args=(lookupObject.whereBuilding.id,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYC_DOB_Permit_IssuanceForm(instance=NYC_DOB_Permit_IssuanceObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/permittedBuildingHeight.html', {'form':form, 'NYC_DOB_Permit_IssuanceObject': NYC_DOB_Permit_IssuanceObject})

@login_required
def skyline_permittedWhatNeighborhood(request, id=None):
	if id:
		NYC_DOB_Permit_IssuanceObject = NYC_DOB_Permit_Issuance.objects.get(pk=id)
	else:
		NYC_DOB_Permit_IssuanceObject = NYC_DOB_Permit_Issuance()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCwhatNeighborhoodPermittedForm(request.POST, instance=NYC_DOB_Permit_IssuanceObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			try:
				lookupObject = NYC_DOB_Permit_Issuance.objects.get(pk=f.pk)
				# add user 
				if lookupObject.created_by:
					f.updated_by = request.user
				else:
					f.created_by = request.user
				# save form
				f.save()
			except NYC_DOB_Permit_Issuance.DoesNotExist:
				f.created_by = request.user
				# save form
				f.save()
				lookupObject = NYC_DOB_Permit_Issuance.objects.get(pk=f.pk)

			return HttpResponseRedirect(reverse('skyline_permittedBuildingHeightAnd', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCwhatNeighborhoodPermittedForm(instance=NYC_DOB_Permit_IssuanceObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/permittedWhatNeighborhood.html', {'form':form, 'NYC_DOB_Permit_IssuanceObject': NYC_DOB_Permit_IssuanceObject})

@login_required
def skyline_permittedBuildingHeightAnd(request, id=None):
	if id:
		NYC_DOB_Permit_IssuanceObject = NYC_DOB_Permit_Issuance.objects.get(pk=id)
	else:
		NYC_DOB_Permit_IssuanceObject = NYC_DOB_Permit_Issuance()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCbuildingHeightAndPermittedForm(request.POST, request.FILES, instance=NYC_DOB_Permit_IssuanceObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			lookupObject = NYC_DOB_Permit_Issuance.objects.get(pk=f.pk)
			# add user 
			if lookupObject.created_by:
				f.updated_by = request.user
			else:
				f.created_by = request.user
			# add the job start date as today to keep the building in there for the maximum amount fo time
			f.job_start_date = datetime.date.today()
			# add borough for filtering
			f.borough = lookupObject.whereBuilding.county
			# save form
			f.save()
			# pull object and check to see if it have a created_by field filled out
			lookupObject = NYC_DOB_Permit_Issuance.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_permittedExactLocation', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCbuildingHeightAndPermittedForm(instance=NYC_DOB_Permit_IssuanceObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/permittedBuildingHeightAnd.html', {'form':form, 'NYC_DOB_Permit_IssuanceObject': NYC_DOB_Permit_IssuanceObject})

@login_required
def skyline_permittedExactLocation(request, id=None):
	if id:
		NYC_DOB_Permit_IssuanceObject = NYC_DOB_Permit_Issuance.objects.get(pk=id)
	else:
		NYC_DOB_Permit_IssuanceObject = NYC_DOB_Permit_Issuance()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCexactLocationReporterForm(request.POST, instance=NYC_DOB_Permit_IssuanceObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			lookupObject = NYC_DOB_Permit_Issuance.objects.get(pk=f.pk)
			# add user 
			if lookupObject.created_by:
				f.updated_by = request.user
			else:
				f.created_by = request.user
			# save form
			f.save()
			# pull object and check to see if it have a created_by field filled out
			lookupObject = NYC_DOB_Permit_Issuance.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_AdminDashboard'))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCexactLocationReporterForm(instance=NYC_DOB_Permit_IssuanceObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/permittedExactLocation.html', {'form':form, 'NYC_DOB_Permit_IssuanceObject': NYC_DOB_Permit_IssuanceObject})

def skyline_permittedGetGeojson(request, id=None):

	obj = NYC_DOB_Permit_Issuance.objects.get(pk=id)

	if obj.buildingFootprint:
		buildingHeight = (3.5*obj.buildingStories) + 9.625 + (2.625 * (obj.buildingStories/25));
		changed = '{\"type\":\"FeatureCollection\",\"features\":[{\"type\": \"Feature\", \"properties\":{\"color\":\"#00cdbe\", \"roofColor\":\"#00cdbe\", \"height\":\"' + str(buildingHeight) +'\", \"zoning_pdfs\":\"visualizations/media/' + str(obj.zoning_pdfs) +'\", \"address\":\"' + obj.buildingAddress.strip() +'\", \"stories\":\"' + str(obj.buildingStories) +'\", \"story1\":\"' + str(obj.story1) +'\", \"projectName\":\"' + obj.projectName +'\", \"buildingImage\":\"visualizations/media/' + str(obj.buildingImage) +'\", \"buildingZip\":\"' + obj.buildingZip +'\", \"objectID\":\"' + str(obj.id) +'\", \"description\":\"' + obj.description +'\"}, \"geometry\": ' + obj.buildingFootprint + '}]}'
	else:
		changed = None

	return JsonResponse(changed, safe=False)


@login_required
def skyline_permittedEnd(request, id=None):
	NYC_DOB_Permit_IssuanceObject = NYC_DOB_Permit_Issuance.objects.get(pk=id)

	return render(request, 'skyline/permittedEnd.html', {'NYC_DOB_Permit_IssuanceObject': NYC_DOB_Permit_IssuanceObject})



def skyline_landingPage(request, id=None):
	# A HTTP POST?
	if request.method == 'POST':
		form = NYClandingPageForm(request.POST)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			print form
			#f = form.save()
			#lookupObject = NYCskyline.objects.get(pk=f.pk)
			#return HttpResponseRedirect(reverse('skyline_buildingHeight', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYClandingPageForm()

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline/index.html', {'form':form})

def skyline_browse(request, id=None):
	#pull neighborhood
	hood = neighborhoodNYC.objects.get(pk=id)
	return render(request, 'skyline/browse.html', {'hood':hood,})
