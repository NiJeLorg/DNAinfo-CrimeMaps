from django.shortcuts import render, redirect

from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, JsonResponse

#import all apartment models and forms
from skyline_chi.models import *
from skyline_chi.forms import *

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

def skyline_chi_intro(request):
	return render(request, 'skyline_chi/intro.html', {})

def skyline_chi_whatNeighborhood(request, id=None):
	if id:
		CHIskylineObject = CHIskyline.objects.get(pk=id)
	else:
		CHIskylineObject = CHIskyline()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIwhatNeighborhoodForm(request.POST, instance=CHIskylineObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHIskyline.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_chi_buildingHeight', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIwhatNeighborhoodForm(instance=CHIskylineObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/whatNeighborhood.html', {'form':form, 'CHIskylineObject': CHIskylineObject})


def skyline_chi_buildingHeight(request, id=None):
	if id:
		CHIskylineObject = CHIskyline.objects.get(pk=id)
	else:
		CHIskylineObject = CHIskyline()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIbuildingHeightForm(request.POST, instance=CHIskylineObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHIskyline.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_chi_exactLocation', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIbuildingHeightForm(instance=CHIskylineObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/buildingHeight.html', {'form':form, 'CHIskylineObject': CHIskylineObject})


def skyline_chi_exactLocation(request, id=None):
	if id:
		CHIskylineObject = CHIskyline.objects.get(pk=id)
	else:
		CHIskylineObject = CHIskyline()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIexactLocationForm(request.POST, instance=CHIskylineObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHIskyline.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_chi_end', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIexactLocationForm(instance=CHIskylineObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/exactLocation.html', {'form':form, 'CHIskylineObject': CHIskylineObject})


def skyline_chi_getGeojson(request, id=None):

	CHIskylineObject = CHIskyline.objects.get(pk=id)

	return JsonResponse(CHIskylineObject.buildingFootprint, safe=False)


def skyline_chi_end(request, id=None):
	if id:
		CHIskylineObject = CHIskyline.objects.get(pk=id)
	else:
		CHIskylineObject = CHIskyline()

	# social urls
	url = "https://visualizations.dnainfo.com/skyline/chi/results/" + str(id) + "/"
	# connect to Bitly API
	c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
	bitlyURL = c.shorten(url)

	return render(request, 'skyline_chi/end.html', {'CHIskylineObject': CHIskylineObject, "bitlyURL": bitlyURL})

def skyline_chi_results(request, id=None):
	if id:
		CHIskylineObject = CHIskyline.objects.get(pk=id)
	else:
		CHIskylineObject = CHIskyline()


	# social urls
	url = "https://visualizations.dnainfo.com/skyline/chi/results/" + str(id) + "/"
	# connect to Bitly API
	c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
	bitlyURL = c.shorten(url)

	return render(request, 'skyline_chi/results.html', {'CHIskylineObject': CHIskylineObject, "bitlyURL": bitlyURL})

@login_required
def skyline_chi_AdminDashboard(request):
	return render(request, 'skyline_chi/adminDashboard.html', {})

@login_required
def skyline_chi_UgcList(request):
	CHIskylineObjects = CHIskyline.objects.filter(approved=None).exclude(buildingFootprint='')
	paginator = Paginator(CHIskylineObjects, 10) # Show 10 buildings per page
	page = request.GET.get('page')
	try:
		objs = paginator.page(page)
	except PageNotAnInteger:
		# If page is not an integer, deliver first page.
		objs = paginator.page(1)
	except EmptyPage:
		# If page is out of range (e.g. 9999), deliver last page of results.
		objs = paginator.page(paginator.num_pages)


	return render(request, 'skyline_chi/ugcList.html', {'CHIskylineObjects': objs})

@login_required
def skyline_chi_UgcApprove(request, id=None):
	obj = CHIskyline.objects.get(id=id)
	obj.approved = True
	obj.save()
	return HttpResponseRedirect(reverse('skyline_chi_UgcList'))

@login_required
def skyline_chi_UgcReject(request, id=None):
	obj = CHIskyline.objects.get(id=id)
	obj.approved = False
	obj.save()
	return HttpResponseRedirect(reverse('skyline_chi_UgcList'))

@login_required
def skyline_chi_sponsoredWhatNeighborhood(request, id=None):
	if id:
		CHISponsoredBuildingsObject = CHISponsoredBuildings.objects.get(pk=id)
	else:
		CHISponsoredBuildingsObject = CHISponsoredBuildings()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIwhatNeighborhoodSponsoredForm(request.POST, instance=CHISponsoredBuildingsObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			try:
				lookupObject = CHISponsoredBuildings.objects.get(pk=f.pk)
				# add user 
				if lookupObject.created_by:
					f.updated_by = request.user
				else:
					f.created_by = request.user
				# save form
				f.save()
			except CHISponsoredBuildings.DoesNotExist:
				f.created_by = request.user
				# save form
				f.save()
				lookupObject = CHISponsoredBuildings.objects.get(pk=f.pk)

			return HttpResponseRedirect(reverse('skyline_chi_sponsoredBuildingHeight', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIwhatNeighborhoodSponsoredForm(instance=CHISponsoredBuildingsObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/sponsoredWhatNeighborhood.html', {'form':form, 'CHISponsoredBuildingsObject': CHISponsoredBuildingsObject})

@login_required
def skyline_chi_sponsoredBuildingHeight(request, id=None):
	if id:
		CHISponsoredBuildingsObject = CHISponsoredBuildings.objects.get(pk=id)
	else:
		CHISponsoredBuildingsObject = CHISponsoredBuildings()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIbuildingHeightSponsoredForm(request.POST, request.FILES, instance=CHISponsoredBuildingsObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			lookupObject = CHISponsoredBuildings.objects.get(pk=f.pk)
			# add user 
			if lookupObject.created_by:
				f.updated_by = request.user
			else:
				f.created_by = request.user
			# save form
			f.save()
			# pull object and check to see if it have a created_by field filled out
			lookupObject = CHISponsoredBuildings.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_chi_sponsoredExactLocation', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIbuildingHeightSponsoredForm(instance=CHISponsoredBuildingsObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/sponsoredBuildingHeight.html', {'form':form, 'CHISponsoredBuildingsObject': CHISponsoredBuildingsObject})

@login_required
def skyline_chi_sponsoredExactLocation(request, id=None):
	if id:
		CHISponsoredBuildingsObject = CHISponsoredBuildings.objects.get(pk=id)
	else:
		CHISponsoredBuildingsObject = CHISponsoredBuildings()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIexactLocationSponsoredForm(request.POST, instance=CHISponsoredBuildingsObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			lookupObject = CHISponsoredBuildings.objects.get(pk=f.pk)
			# add user 
			if lookupObject.created_by:
				f.updated_by = request.user
			else:
				f.created_by = request.user
			# save form
			f.save()
			# pull object and check to see if it have a created_by field filled out
			lookupObject = CHISponsoredBuildings.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_chi_sponsoredEnd', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIexactLocationSponsoredForm(instance=CHISponsoredBuildingsObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/sponsoredExactLocation.html', {'form':form, 'CHISponsoredBuildingsObject': CHISponsoredBuildingsObject})

def skyline_chi_sponsoredGetGeojson(request, id=None):

	CHISponsoredBuildingsObject = CHISponsoredBuildings.objects.get(pk=id)

	return JsonResponse(CHISponsoredBuildingsObject.buildingFootprint, safe=False)

def skyline_chi_getSponsoredGeojsons(request, id=None):

	CHISponsoredBuildingsObjects = CHISponsoredBuildings.objects.exclude(archived=True).exclude(buildingStories__exact = 0).exclude(buildingFootprint__in = ['', '-99'])
	geojsons = []

	for obj in CHISponsoredBuildingsObjects:
		geojsons.append(obj.buildingFootprint)
		

	return JsonResponse(geojsons, safe=False)

def skyline_chi_getPermittedGeojsons(request):
	today = datetime.date.today()
	minyear = today.year - 1

	CHI_Building_Permits_NewObjects = CHI_Building_Permits_New.objects.filter(issue_date__year__gte=minyear).exclude(buildingStories__exact = 0).exclude(buildingFootprint__in = ['', '-99'])
	geojsons = []

	for obj in CHI_Building_Permits_NewObjects:
		buildingHeight = (3.5*obj.buildingStories) + 9.625 + (2.625 * (obj.buildingStories/25));
		changed = '{\"type\":\"FeatureCollection\",\"features\":[{\"type\": \"Feature\", \"properties\":{\"color\":\"#00cdbe\", \"roofColor\":\"#00cdbe\", \"height\":\"' + str(buildingHeight) +'\", \"zoning_pdfs\":\"' + str(obj.zoning_pdfs) +'\", \"address\":\"' + obj.buildingAddress.strip() +'\", \"stories\":\"' + str(obj.buildingStories) +'\", \"story1\":\"' + str(obj.story1) +'\", \"projectName\":\"' + obj.projectName +'\", \"buildingImage\":\"visualizations/media/' + str(obj.buildingImage) +'\", \"objectID\":\"' + str(obj.pk) +'\", \"description\":\"' + obj.description +'\"}, \"geometry\": ' + obj.buildingFootprint + '}]}'
		geojsons.append(changed)
		
	return JsonResponse(geojsons, safe=False)

@login_required
def skyline_chi_sponsoredEnd(request, id=None):
	CHISponsoredBuildingsObject = CHISponsoredBuildings.objects.get(pk=id)

	return render(request, 'skyline_chi/sponsoredEnd.html', {'CHISponsoredBuildingsObject': CHISponsoredBuildingsObject})

@login_required
def skyline_chi_sponsoredList(request, id=None):
	CHISponsoredBuildingsObjects = CHISponsoredBuildings.objects.exclude(archived=True).order_by('-updated_by', 'buildingName')

	paginator = Paginator(CHISponsoredBuildingsObjects, 10) # Show 10 buildings per page
	page = request.GET.get('page')
	try:
		objs = paginator.page(page)
	except PageNotAnInteger:
		# If page is not an integer, deliver first page.
		objs = paginator.page(1)
	except EmptyPage:
		# If page is out of range (e.g. 9999), deliver last page of results.
		objs = paginator.page(paginator.num_pages)

	return render(request, 'skyline_chi/sponsoredList.html', {'CHISponsoredBuildingsObjects': objs})

@login_required
def skyline_chi_sponsoredRemove(request, id=None):
	CHISponsoredBuildingsObject = CHISponsoredBuildings.objects.get(pk=id)

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIremoveSponsoredForm(request.POST, instance=CHISponsoredBuildingsObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			#archive this building
			CHISponsoredBuildingsObject.archived = True
			CHISponsoredBuildingsObject.updated_by = request.user
			CHISponsoredBuildingsObject.save()
			return HttpResponseRedirect(reverse('skyline_chi_sponsoredList'))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIremoveSponsoredForm(instance=CHISponsoredBuildingsObject)

	return render(request, 'skyline_chi/sponsoredRemove.html', {'form': form, 'CHISponsoredBuildingsObject': CHISponsoredBuildingsObject})


@login_required
def skyline_chi_reporterWhatNeighborhood(request, id=None):
	if id:
		CHIReporterBuildingsObject = CHIReporterBuildings.objects.get(pk=id)
	else:
		CHIReporterBuildingsObject = CHIReporterBuildings()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIwhatNeighborhoodReporterForm(request.POST, instance=CHIReporterBuildingsObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			try:
				lookupObject = CHIReporterBuildings.objects.get(pk=f.pk)
				# add user 
				if lookupObject.created_by:
					f.updated_by = request.user
				else:
					f.created_by = request.user
				# save form
				f.save()
			except CHIReporterBuildings.DoesNotExist:
				f.created_by = request.user
				# save form
				f.save()
				lookupObject = CHIReporterBuildings.objects.get(pk=f.pk)

			return HttpResponseRedirect(reverse('skyline_chi_reporterBuildingHeight', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIwhatNeighborhoodReporterForm(instance=CHIReporterBuildingsObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/reporterWhatNeighborhood.html', {'form':form, 'CHIReporterBuildingsObject': CHIReporterBuildingsObject})

@login_required
def skyline_chi_reporterBuildingHeight(request, id=None):
	if id:
		CHIReporterBuildingsObject = CHIReporterBuildings.objects.get(pk=id)
	else:
		CHIReporterBuildingsObject = CHIReporterBuildings()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIbuildingHeightReporterForm(request.POST, request.FILES, instance=CHIReporterBuildingsObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			lookupObject = CHIReporterBuildings.objects.get(pk=f.pk)
			# add user 
			if lookupObject.created_by:
				f.updated_by = request.user
			else:
				f.created_by = request.user
			# save form
			f.save()
			# pull object and check to see if it have a created_by field filled out
			lookupObject = CHIReporterBuildings.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_chi_reporterExactLocation', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIbuildingHeightReporterForm(instance=CHIReporterBuildingsObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/reporterBuildingHeight.html', {'form':form, 'CHIReporterBuildingsObject': CHIReporterBuildingsObject})

@login_required
def skyline_chi_reporterExactLocation(request, id=None):
	if id:
		CHIReporterBuildingsObject = CHIReporterBuildings.objects.get(pk=id)
	else:
		CHIReporterBuildingsObject = CHIReporterBuildings()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIexactLocationReporterForm(request.POST, instance=CHIReporterBuildingsObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			lookupObject = CHIReporterBuildings.objects.get(pk=f.pk)
			# add user 
			if lookupObject.created_by:
				f.updated_by = request.user
			else:
				f.created_by = request.user
			# save form
			f.save()
			# pull object and check to see if it have a created_by field filled out
			lookupObject = CHIReporterBuildings.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_chi_reporterEnd', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIexactLocationReporterForm(instance=CHIReporterBuildingsObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/reporterExactLocation.html', {'form':form, 'CHIReporterBuildingsObject': CHIReporterBuildingsObject})

def skyline_chi_reporterGetGeojson(request, id=None):

	CHIReporterBuildingsObject = CHIReporterBuildings.objects.get(pk=id)

	return JsonResponse(CHIReporterBuildingsObject.buildingFootprint, safe=False)

def skyline_chi_getReporterGeojsons(request, id=None):

	CHIReporterBuildingsObjects = CHIReporterBuildings.objects.exclude(archived=True).exclude(buildingStories__exact = 0).exclude(buildingFootprint__in = ['', '-99'])
	geojsons = []

	for obj in CHIReporterBuildingsObjects:
		geojsons.append(obj.buildingFootprint)
		

	return JsonResponse(geojsons, safe=False)

@login_required
def skyline_chi_reporterEnd(request, id=None):
	CHIReporterBuildingsObject = CHIReporterBuildings.objects.get(pk=id)

	return render(request, 'skyline_chi/reporterEnd.html', {'CHIReporterBuildingsObject': CHIReporterBuildingsObject})

@login_required
def skyline_chi_reporterList(request, id=None):
	CHIReporterBuildingsObjects = CHIReporterBuildings.objects.exclude(archived=True).order_by('-updated_by', 'projectName')

	paginator = Paginator(CHIReporterBuildingsObjects, 10) # Show 10 buildings per page
	page = request.GET.get('page')
	try:
		objs = paginator.page(page)
	except PageNotAnInteger:
		# If page is not an integer, deliver first page.
		objs = paginator.page(1)
	except EmptyPage:
		# If page is out of range (e.g. 9999), deliver last page of results.
		objs = paginator.page(paginator.num_pages)

	return render(request, 'skyline_chi/reporterList.html', {'CHIReporterBuildingsObjects': objs})

@login_required
def skyline_chi_reporterRemove(request, id=None):
	CHIReporterBuildingsObject = CHIReporterBuildings.objects.get(pk=id)

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIremoveReporterForm(request.POST, instance=CHIReporterBuildingsObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			#archive this building
			CHIReporterBuildingsObject.archived = True
			CHIReporterBuildingsObject.updated_by = request.user
			CHIReporterBuildingsObject.save()
			return HttpResponseRedirect(reverse('skyline_chi_reporterList'))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIremoveReporterForm(instance=CHIReporterBuildingsObject)

	return render(request, 'skyline_chi/reporterRemove.html', {'form': form, 'CHIReporterBuildingsObject': CHIReporterBuildingsObject})


@login_required
def skyline_chi_viewAllWhatNeighborhood(request):
	# A HTTP POST?
	if request.method == 'POST':
		form = CHIwhatNeighborhoodReporterForm(request.POST)

		# Have we been provided with a valid form?
		if form.is_valid():
			return HttpResponseRedirect(reverse('skyline_chi_viewAll', args=(form.cleaned_data['whereBuilding'].id,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIwhatNeighborhoodReporterForm()

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/viewAllWhatNeighborhood.html', {'form':form,})

@login_required
def skyline_chi_viewAll(request, id=None):
	#pull neighborhood
	hood = neighborhoodCHI.objects.get(pk=id)
	return render(request, 'skyline_chi/viewAll.html', {'hood':hood,})	



@login_required
def skyline_chi_AdminCheck(request, id=None):
	buildingCount = CHIskyline.objects.filter(approved=None).exclude(buildingFootprint='').count()
	if buildingCount == 0:
		return render(request, 'skyline_chi/adminNoBuildings.html', {})
	else:
		if id:
			CHIskylineObject = CHIskyline.objects.get(pk=id)
		else:
			qs = CHIskyline.objects.filter(approved=None).exclude(buildingFootprint='')[:1]
			r = list(qs)
			CHIskylineObject = r[0]

		form = CHIapproveForm(instance=CHIskylineObject)

		# Bad form (or form details), no form supplied...
		# Render the form with error messages (if any).
		return render(request, 'skyline_chi/adminCheck.html', {'form':form, 'CHIskylineObject': CHIskylineObject, 'buildingCount': buildingCount})


@login_required
def skyline_chi_AdminNext(request, id=None):
	buildingCount = CHIskyline.objects.filter(approved=None).exclude(buildingFootprint='').count()
	if buildingCount == 0:
		return render(request, 'skyline_chi/adminNoBuildings.html', {})
	else:
		if id:
			CHIskylineObject = CHIskyline.objects.get(pk=id)
		else:
			qs = CHIskyline.objects.filter(approved=None).exclude(buildingFootprint='')[:1]
			r = list(qs)
			CHIskylineObject = r[0]

		# A HTTP POST?
		if request.method == 'POST':
			form = CHIapproveForm(request.POST, instance=CHIskylineObject)

			# Have we been provided with a valid form?
			if form.is_valid():
				# Save the new data to the database.
				f = form.save()
				lookupObject = CHIskyline.objects.get(pk=f.pk)
				return HttpResponseRedirect(reverse('skyline_chi_AdminNext'))
			else:
				# The supplied form contained errors - just print them to the terminal.
				print form.errors
		else:
			# If the request was not a POST, display the form to enter details.
			form = CHIapproveForm(instance=CHIskylineObject)

		# Bad form (or form details), no form supplied...
		# Render the form with error messages (if any).
		return render(request, 'skyline_chi/adminTemplate.html', {'form':form, 'CHIskylineObject': CHIskylineObject, 'buildingCount': buildingCount})


@login_required
def skyline_chi_permittedBuildingHeight(request, id=None):
	if id:
		CHI_Building_Permits_NewObject = CHI_Building_Permits_New.objects.get(pk=id)
	else:
		CHI_Building_Permits_NewObject = CHI_Building_Permits_New()

	# get hoodID from URL to set combo box with new value if one does not yet exist
	hoodID = request.GET.get('hoodID')

	if not CHI_Building_Permits_NewObject.whereBuilding:
		if hoodID: 
			CHI_Building_Permits_NewObject.whereBuilding = int(hoodID)
			CHI_Building_Permits_NewObject.save()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHI_Building_Permits_NewForm(request.POST, request.FILES, instance=CHI_Building_Permits_NewObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			lookupObject = CHI_Building_Permits_New.objects.get(pk=f.pk)
			# add user 
			if lookupObject.created_by:
				f.updated_by = request.user
			else:
				f.created_by = request.user
			# save form
			f.save()
			# pull object and check to see if it have a created_by field filled out
			lookupObject = CHI_Building_Permits_New.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_chi_viewAll', args=(lookupObject.whereBuilding.id,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHI_Building_Permits_NewForm(instance=CHI_Building_Permits_NewObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/permittedBuildingHeight.html', {'form':form, 'CHI_Building_Permits_NewObject': CHI_Building_Permits_NewObject})


@login_required
def skyline_chi_permittedWhatNeighborhood(request, id=None):
	if id:
		CHI_Building_Permits_NewObject = CHI_Building_Permits_New.objects.get(pk=id)
	else:
		CHI_Building_Permits_NewObject = CHI_Building_Permits_New()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIwhatNeighborhoodPermittedForm(request.POST, instance=CHI_Building_Permits_NewObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			try:
				lookupObject = CHI_Building_Permits_New.objects.get(pk=f.pk)
				# add user 
				if lookupObject.created_by:
					f.updated_by = request.user
				else:
					f.created_by = request.user
				# save form
				f.save()
			except CHI_Building_Permits_New.DoesNotExist:
				f.created_by = request.user
				# save form
				f.save()
				formID = f.pk
				lookupObject = CHI_Building_Permits_New.objects.get(pk=formID)

			return HttpResponseRedirect(reverse('skyline_chi_permittedBuildingHeightAnd', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIwhatNeighborhoodPermittedForm(instance=CHI_Building_Permits_NewObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/permittedWhatNeighborhood.html', {'form':form, 'CHI_Building_Permits_NewObject': CHI_Building_Permits_NewObject})

@login_required
def skyline_chi_permittedBuildingHeightAnd(request, id=None):
	if id:
		CHI_Building_Permits_NewObject = CHI_Building_Permits_New.objects.get(pk=id)
	else:
		CHI_Building_Permits_NewObject = CHI_Building_Permits_New()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIbuildingHeightAndPermittedForm(request.POST, request.FILES, instance=CHI_Building_Permits_NewObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			lookupObject = CHI_Building_Permits_New.objects.get(pk=f.pk)
			# add user 
			if lookupObject.created_by:
				f.updated_by = request.user
			else:
				f.created_by = request.user
			# add the issue date as today to keep the building in there for the maximum amount of time
			f.issue_date = datetime.date.today()
			# save form
			f.save()
			# pull object and check to see if it have a created_by field filled out
			lookupObject = CHI_Building_Permits_New.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_chi_permittedExactLocation', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIbuildingHeightAndPermittedForm(instance=CHI_Building_Permits_NewObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/permittedBuildingHeightAnd.html', {'form':form, 'CHI_Building_Permits_NewObject': CHI_Building_Permits_NewObject})

@login_required
def skyline_chi_permittedExactLocation(request, id=None):
	if id:
		CHI_Building_Permits_NewObject = CHI_Building_Permits_New.objects.get(pk=id)
	else:
		CHI_Building_Permits_NewObject = CHI_Building_Permits_New()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIexactLocationPermittedForm(request.POST, instance=CHI_Building_Permits_NewObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save(commit=False)
			# pull object and check to see if it have a created_by field filled out
			lookupObject = CHI_Building_Permits_New.objects.get(pk=f.pk)
			# add user 
			if lookupObject.created_by:
				f.updated_by = request.user
			else:
				f.created_by = request.user
			# save form
			f.save()
			# pull object and check to see if it have a created_by field filled out
			lookupObject = CHI_Building_Permits_New.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('skyline_chi_permittedEnd', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIexactLocationPermittedForm(instance=CHI_Building_Permits_NewObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/permittedExactLocation.html', {'form':form, 'CHI_Building_Permits_NewObject': CHI_Building_Permits_NewObject})

def skyline_chi_permittedGetGeojson(request, id=None):

	obj = CHI_Building_Permits_New.objects.get(pk=id)

	if obj.buildingFootprint:
		buildingHeight = (3.5*obj.buildingStories) + 9.625 + (2.625 * (obj.buildingStories/25));
		changed = '{\"type\":\"FeatureCollection\",\"features\":[{\"type\": \"Feature\", \"properties\":{\"color\":\"#00cdbe\", \"roofColor\":\"#00cdbe\", \"height\":\"' + str(buildingHeight) +'\", \"zoning_pdfs\":\"' + str(obj.zoning_pdfs) +'\", \"address\":\"' + obj.buildingAddress.strip() +'\", \"stories\":\"' + str(obj.buildingStories) +'\", \"story1\":\"' + str(obj.story1) +'\", \"projectName\":\"' + obj.projectName +'\", \"buildingImage\":\"visualizations/media/' + str(obj.buildingImage) +'\", \"objectID\":\"' + str(obj.pk) +'\", \"description\":\"' + obj.description +'\"}, \"geometry\": ' + obj.buildingFootprint + '}]}'
	else:
		changed = None

	return JsonResponse(changed, safe=False)


@login_required
def skyline_chi_permittedEnd(request, id=None):
	CHI_Building_Permits_NewObject = CHI_Building_Permits_New.objects.get(pk=id)

	return render(request, 'skyline_chi/permittedEnd.html', {'CHI_Building_Permits_NewObject': CHI_Building_Permits_NewObject})


