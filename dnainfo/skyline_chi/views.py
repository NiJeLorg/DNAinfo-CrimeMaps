from django.shortcuts import render, redirect

from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

# for CSV downloading
import unicodecsv as csv

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

#for email
from django.core.mail import send_mail

#for pulling only the max 
from django.db.models import Max 


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
	return render(request, 'skyline_chi/add_a_building_intro.html', {'form':form, 'CHIskylineObject': CHIskylineObject})


def skyline_chi_buildingHeight(request, id=None):
	if id:
		CHIskylineObject = CHIskyline.objects.get(pk=id)
	else:
		CHIskylineObject = CHIskyline()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIbuildingHeightForm(request.POST, request.FILES, instance=CHIskylineObject)

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
			return HttpResponseRedirect(reverse('skyline_chi_return_result', args=(lookupObject.pk,)))
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
	url = "https://www.dnainfo.com/chicago/visualizations/skyline?result&hood=" + str(id)
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
	url = "https://www.dnainfo.com/chicago/visualizations/skyline?result&hood=" + str(id)
	# connect to Bitly API
	c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
	bitlyURL = c.shorten(url)

	return render(request, 'skyline_chi/results.html', {'CHIskylineObject': CHIskylineObject, "bitlyURL": bitlyURL})

@login_required
def skylineAdminDashboard(request):
	return render(request, 'skyline_chi/adminDashboard.html', {})

@login_required
def skyline_chi_createBuildingsCSV(request):
	# Create the HttpResponse object with the appropriate CSV header.
	response = HttpResponse(content_type='text/csv')
	response['Content-Disposition'] = 'attachment; filename="CHI_permitted_buildings_on_map.csv"'

	writer = csv.writer(response, encoding='utf-8')
	writer.writerow(['ID_ODP', 'created', 'updated', 'created_by', 'updated_by', 'whereBuilding', 'permit', 'permit_type', 'issue_date', 'estimated_cost', 'street_number', 'street_direction', 'street_name', 'suffix', 'work_description', 'pin1', 'pin_added', 'latitude', 'longitude', 'buildingFootprint', 'buildingStories', 'zoning_pdfs', 'story1', 'projectName', 'buildingImage', 'buildingAddress', 'description', 'archived'])

	#pull data 
	today = datetime.date.today()
	minyear = today.year - 2

	CHI_Building_Permits_NewObjects = CHI_Building_Permits_New.objects.filter(issue_date__year__gte=minyear).exclude(buildingStories__exact = 0).exclude(buildingFootprint__in = ['', '-99'])


	for o in CHI_Building_Permits_NewObjects:
		if o.whereBuilding:
			neighborhoodName = o.whereBuilding.name
		else:
			neighborhoodName = None
		
		writer.writerow([o.ID_ODP, o.created, o.updated, o.created_by, o.updated_by, neighborhoodName, o.permit, o.permit_type, o.issue_date, o.estimated_cost, o.street_number, o.street_direction, o.street_name, o.suffix, o.work_description, o.pin1, o.pin_added, o.latitude, o.longitude, o.buildingFootprint, o.buildingStories, o.zoning_pdfs, o.story1, o.projectName, o.buildingImage, o.buildingAddress, o.description, o.archived])

	return response

@login_required
def skyline_chi_UgcList(request):
	CHIskylineObjects = CHIskyline.objects.filter(approved=None).exclude(buildingFootprint='').order_by('-updated', 'projectName')
	paginator = Paginator(CHIskylineObjects, 20) # Show 10 buildings per page
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
def skyline_chi_UgcViewAll(request):
	CHIskylineObjects = CHIskyline.objects.exclude(buildingFootprint='').order_by('-updated', 'projectName')
	paginator = Paginator(CHIskylineObjects, 20) # Show 10 buildings per page
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
	obj.reviewed_by = request.user
	obj.save()
	# email user if their building is approved

	if obj.userEmail:
		url = "https://www.dnainfo.com/chicago/visualizations/skyline?result&hood="+str(obj.id)
		subject = "[DNAinfo] The building you added to our 3-D map was approved!"
		html_message = "Hello "+ obj.userEmail +",<br /><br />The building you added to our 3-D map of buildings was approved, and you can now <a href='"+ url +"'>see that building</a> marked as \"Proposed\" on the map. Thank you for your contribution!<br /><br />DNAinfo.com"
		message = "Hello "+ obj.userEmail +", The building you added to our 3-D map of buildings was approved, and you can now see that building marked as \"Proposed\" on the map here: "+ url +". Thank you for your contribution! DNAinfo.com"

		send_mail(subject, message, 'dnainfovisualizations@gmail.com', [obj.userEmail], fail_silently=True, html_message=html_message)

	return HttpResponseRedirect(reverse('skyline_chi_UgcList'))

@login_required
def skyline_chi_UgcReject(request, id=None):
	obj = CHIskyline.objects.get(id=id)
	obj.approved = False
	obj.reviewed_by = request.user
	obj.save()
	return HttpResponseRedirect(reverse('skyline_chi_UgcList'))

@login_required
def skyline_chi_UgcEdit(request, id=None):
	if id:
		CHIskylineObject = CHIskyline.objects.get(pk=id)
	else:
		CHIskylineObject = CHIskyline()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIbuildingHeightForm(request.POST, request.FILES, instance=CHIskylineObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHIskyline.objects.get(pk=f.pk)
			# route request depending on which button was clicked
			if 'save' in request.POST:
				return HttpResponseRedirect(reverse('skyline_chi_UgcList'))
			elif 'pick_plot' in request.POST:
				return HttpResponseRedirect(reverse('skyline_chi_exactLocation', args=(lookupObject.pk,)))

		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIbuildingHeightForm(instance=CHIskylineObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/buildingHeightEdit.html', {'form':form, 'CHIskylineObject': CHIskylineObject})

@login_required
def skyline_chi_createNewsletterCSV(request):
	# Create the HttpResponse object with the appropriate CSV header.
	response = HttpResponse(content_type='text/csv')
	response['Content-Disposition'] = 'attachment; filename="CHI_skyline_chi_newsletter_requests.csv"'

	writer = csv.writer(response, encoding='utf-8')
	writer.writerow(['created', 'neighborhood', 'email', 'newsletter'])

	#pull data 
	CHIskylineObjects = CHIskyline.objects.exclude(userEmail__exact='')

	for o in CHIskylineObjects:
		if o.whereBuilding:
			neighborhoodName = o.whereBuilding.name
		else:
			neighborhoodName = None
		
		writer.writerow([o.created, neighborhoodName, o.userEmail, o.newsletter])

	return response


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
def skyline_chi_sponsoredBuildingHeightEdit(request, id=None):
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
			# route request depending on which button was clicked
			if 'save' in request.POST:
				return HttpResponseRedirect(reverse('skyline_chi_sponsoredList'))
			elif 'pick_plot' in request.POST:
				return HttpResponseRedirect(reverse('skyline_chi_sponsoredExactLocation', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIbuildingHeightSponsoredForm(instance=CHISponsoredBuildingsObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/sponsoredBuildingHeightEdit.html', {'form':form, 'CHISponsoredBuildingsObject': CHISponsoredBuildingsObject})

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
			
			return HttpResponseRedirect(reverse('skyline_chi_sponsoredList'))
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

def skyline_chi_getSponsoredGeojsons(request):

	CHISponsoredBuildingsObjects = CHISponsoredBuildings.objects.exclude(archived=True).exclude(buildingStories__exact = 0).exclude(buildingFootprint__in = ['', '-99'])
	geojsons = []

	for obj in CHISponsoredBuildingsObjects:
		geojsons.append(obj.buildingFootprint)
		

	return JsonResponse(geojsons, safe=False)

def skyline_chi_getPermittedGeojsons(request):
	today = datetime.date.today()
	minyear = today.year - 2

	unique_id_list = []
	pin_lookup = ''
	# getting unique list of ID numbers (and PIN numbers) with the highest cost only
	uniqueID_ODP = CHI_Building_Permits_New.objects.order_by('pin1', '-estimated_cost').values('ID_ODP', 'pin1', 'pin_added', 'estimated_cost').filter(issue_date__year__gte=minyear).exclude(buildingStories__exact = 0).exclude(buildingFootprint__in = ['', '-99'])

	for obj in uniqueID_ODP:
		if obj['pin_added'] != '':
			unique_id_list.append(obj['ID_ODP'])
		elif obj['pin1'] != pin_lookup:
			unique_id_list.append(obj['ID_ODP'])
			pin_lookup = obj['pin1']


	CHI_Building_Permits_NewObjects = CHI_Building_Permits_New.objects.filter(ID_ODP__in = unique_id_list).filter(issue_date__year__gte=minyear).exclude(buildingStories__exact = 0).exclude(buildingFootprint__in = ['', '-99'])
	geojsons = []

	for obj in CHI_Building_Permits_NewObjects:
		if obj.buildingStories < 30:
			buildingHeight = obj.buildingStories*10
		else:
			buildingHeight = (3.5*obj.buildingStories) + 9.625 + (2.625 * (obj.buildingStories/25))

		changed = '{\"type\":\"FeatureCollection\",\"features\":[{\"type\": \"Feature\", \"properties\":{\"color\":\"#00cdbe\", \"roofColor\":\"#00cdbe\", \"height\":\"' + str(buildingHeight) +'\", \"zoning_pdfs\":\"' + str(obj.zoning_pdfs) +'\", \"address\":\"' + obj.buildingAddress.strip() +'\", \"stories\":\"' + str(obj.buildingStories) +'\", \"story1\":\"' + str(obj.story1) +'\", \"projectName\":\"' + obj.projectName +'\", \"buildingImage\":\"visualizations/media/' + str(obj.buildingImage) +'\", \"objectID\":\"' + str(obj.pk) +'\", \"description\":\"' + obj.description +'\" , \"estimated_cost\":\"' + str(obj.estimated_cost) +'\"}, \"geometry\": ' + obj.buildingFootprint + '}]}'
		geojsons.append(changed)
		
	return JsonResponse(geojsons, safe=False)

def skyline_chi_getUGCApprovedGeojsons(request):

	CHIskylineObjects = CHIskyline.objects.filter(approved=True)
	geojsons = []

	for obj in CHIskylineObjects:
		geojsons.append(obj.buildingFootprint)
		
	return JsonResponse(geojsons, safe=False)

@login_required
def skyline_chi_sponsoredEnd(request, id=None):
	CHISponsoredBuildingsObject = CHISponsoredBuildings.objects.get(pk=id)

	return render(request, 'skyline_chi/sponsoredEnd.html', {'CHISponsoredBuildingsObject': CHISponsoredBuildingsObject})

@login_required
def skyline_chi_sponsoredList(request, id=None):
	CHISponsoredBuildingsObjects = CHISponsoredBuildings.objects.exclude(archived=True).order_by('-updated', 'buildingName')

	paginator = Paginator(CHISponsoredBuildingsObjects, 20) # Show 10 buildings per page
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
			#archive this sponsored content
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
def skyline_chi_reporterBuildingHeightEdit(request, id=None):
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
			# route request depending on which button was clicked
			if 'save' in request.POST:
				return HttpResponseRedirect(reverse('skyline_chi_reporterList'))
			elif 'pick_plot' in request.POST:
				return HttpResponseRedirect(reverse('skyline_chi_reporterExactLocation', args=(lookupObject.pk,)))

		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIbuildingHeightReporterForm(instance=CHIReporterBuildingsObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/reporterBuildingHeightEdit.html', {'form':form, 'CHIReporterBuildingsObject': CHIReporterBuildingsObject})

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

			return HttpResponseRedirect(reverse('skyline_chi_reporterList'))
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
	CHIReporterBuildingsObjects = CHIReporterBuildings.objects.exclude(archived=True).order_by('-updated', 'projectName')

	paginator = Paginator(CHIReporterBuildingsObjects, 20) # Show 10 buildings per page
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
def skylineAdminCheck(request, id=None):
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
def skylineAdminNext(request, id=None):
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
			#look up neighborhood
			hood = neighborhoodCHI.objects.get(id=int(hoodID))
			CHI_Building_Permits_NewObject.whereBuilding = hood
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
				lookupObject = CHI_Building_Permits_New.objects.get(pk=f.pk)

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
			# add the job start date as today to keep the building in there for the maximum amount fo time
			f.job_start_date = datetime.date.today()
			# add borough for filtering
			f.borough = lookupObject.whereBuilding.county
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
		form = CHIexactLocationReporterForm(request.POST, instance=CHI_Building_Permits_NewObject)

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
			return HttpResponseRedirect(reverse('skyline_chi_AdminDashboard'))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIexactLocationReporterForm(instance=CHI_Building_Permits_NewObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/permittedExactLocation.html', {'form':form, 'CHI_Building_Permits_NewObject': CHI_Building_Permits_NewObject})

def skyline_chi_permittedGetGeojson(request, id=None):

	obj = CHI_Building_Permits_New.objects.get(pk=id)

	if obj.buildingFootprint:
		if obj.buildingStories < 30:
			buildingHeight = obj.buildingStories*10
		else:
			buildingHeight = (3.5*obj.buildingStories) + 9.625 + (2.625 * (obj.buildingStories/25))

		changed = '{\"type\":\"FeatureCollection\",\"features\":[{\"type\": \"Feature\", \"properties\":{\"color\":\"#00cdbe\", \"roofColor\":\"#00cdbe\", \"height\":\"' + str(buildingHeight) +'\", \"zoning_pdfs\":\"visualizations/media/' + str(obj.zoning_pdfs) +'\", \"address\":\"' + obj.buildingAddress.strip() +'\", \"stories\":\"' + str(obj.buildingStories) +'\", \"story1\":\"' + str(obj.story1) +'\", \"projectName\":\"' + obj.projectName +'\", \"buildingImage\":\"visualizations/media/' + str(obj.buildingImage) +'\", \"buildingZip\":\"' + obj.buildingZip +'\", \"objectID\":\"' + str(obj.id) +'\", \"description\":\"' + obj.description +'\"}, \"geometry\": ' + obj.buildingFootprint + '}]}'
	else:
		changed = None

	return JsonResponse(changed, safe=False)


@login_required
def skyline_chi_permittedEnd(request, id=None):
	CHI_Building_Permits_NewObject = CHI_Building_Permits_New.objects.get(pk=id)

	return render(request, 'skyline_chi/permittedEnd.html', {'CHI_Building_Permits_NewObject': CHI_Building_Permits_NewObject})



def skyline_chi_landingPage(request, id=None):
	# A HTTP POST?
	if request.method == 'POST':
		form = CHIlandingPageForm(request.POST)

		# Have we been provided with a valid form?
		if form.is_valid():
			whereBuilding = request.POST['whereBuilding']
			return HttpResponseRedirect(reverse('skyline_chi_browse', args=(whereBuilding,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIlandingPageForm()
		form1 = CHIlandingPageForm()

		url = "https://www.dnainfo.com/chicago/visualizations/skyline/"
		# connect to Bitly API
		c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
		bitlyURL = c.shorten(url)	

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'skyline_chi/index.html', {'form':form, 'form1':form1, 'bitlyURL':bitlyURL})

def skyline_chi_browse(request, id=None):
	# check for xcoor and y coor to be passed
	getlat = request.GET.get('lat', 0)
	getlon = request.GET.get('lon', 0)
	buildingShared = request.GET.get('buildingShared', 'false');

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIlandingPageForm(request.POST)

		# Have we been provided with a valid form?
		if form.is_valid():
			whereBuilding = request.POST['whereBuilding']
			return HttpResponseRedirect(reverse('skyline_chi_browse', args=(whereBuilding,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIlandingPageForm()

	#pull neighborhood
	hood = neighborhoodCHI.objects.get(pk=id)
	return render(request, 'skyline_chi/browse.html', {'hood':hood,'form':form,'getlat':getlat,'getlon':getlon,'buildingShared':buildingShared})

def skyline_chi_return_result(request, id=None):
	# check for xcoor and y coor to be passed
	getlat = request.GET.get('lat', 0)
	getlon = request.GET.get('lon', 0)

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIlandingPageForm(request.POST)

		# Have we been provided with a valid form?
		if form.is_valid():
			whereBuilding = request.POST['whereBuilding']
			return HttpResponseRedirect(reverse('skyline_chi_browse', args=(whereBuilding,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIlandingPageForm()

	CHIskylineObject = CHIskyline.objects.get(pk=id)
	return render(request, 'skyline_chi/return_result.html', {'CHIskylineObject':CHIskylineObject,'form':form})

