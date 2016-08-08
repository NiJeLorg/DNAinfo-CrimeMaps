from django.shortcuts import render, redirect

from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

# python CSV library
import csv

from django.db.models import Avg, Count

#import all apartment models and forms
from apartment_test_for_danny_chi.models import *
from apartment_test_for_danny_chi.forms import *

# bitly API
import bitly_api

# views for DNAinfo my first apartment
def index(request):
	return redirect('http://www.dnainfo.com/')

def intro(request):
	return render(request, 'apartment_test_for_danny_chi/intro.html', {})

def firstMove(request, id=None):
	if id:
		CHImyFirstApartmentObject = CHImyFirstApartment.objects.get(pk=id)
	else:
		CHImyFirstApartmentObject = CHImyFirstApartment()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIfirstMoveForm(request.POST, instance=CHImyFirstApartmentObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHImyFirstApartment.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('whatNeighborhood-apartment-test-for-danny-chi', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIfirstMoveForm(instance=CHImyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment_test_for_danny_chi/firstMove.html', {'form':form, 'CHImyFirstApartmentObject': CHImyFirstApartmentObject})


def whatNeighborhood(request, id=None):
	if id:
		CHImyFirstApartmentObject = CHImyFirstApartment.objects.get(pk=id)
	else:
		CHImyFirstApartmentObject = CHImyFirstApartment()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIwhatNeighborhoodForm(request.POST, instance=CHImyFirstApartmentObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHImyFirstApartment.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('exactLocation-apartment-test-for-danny-chi', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIwhatNeighborhoodForm(instance=CHImyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment_test_for_danny_chi/whatNeighborhood.html', {'form':form, 'CHImyFirstApartmentObject': CHImyFirstApartmentObject})


def exactLocation(request, id=None):
	if id:
		CHImyFirstApartmentObject = CHImyFirstApartment.objects.get(pk=id)
	else:
		CHImyFirstApartmentObject = CHImyFirstApartment()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIexactLocationForm(request.POST, instance=CHImyFirstApartmentObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHImyFirstApartment.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('yearMoved-apartment-test-for-danny-chi', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIexactLocationForm(instance=CHImyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment_test_for_danny_chi/exactLocation.html', {'form':form, 'CHImyFirstApartmentObject': CHImyFirstApartmentObject})


def yearMoved(request, id=None):
	if id:
		CHImyFirstApartmentObject = CHImyFirstApartment.objects.get(pk=id)
	else:
		CHImyFirstApartmentObject = CHImyFirstApartment()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIyearMovedForm(request.POST, instance=CHImyFirstApartmentObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHImyFirstApartment.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('bedrooms-apartment-test-for-danny-chi', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIyearMovedForm(instance=CHImyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment_test_for_danny_chi/yearMoved.html', {'form':form, 'CHImyFirstApartmentObject': CHImyFirstApartmentObject})


def bedrooms(request, id=None):
	if id:
		CHImyFirstApartmentObject = CHImyFirstApartment.objects.get(pk=id)
	else:
		CHImyFirstApartmentObject = CHImyFirstApartment()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIbedroomsForm(request.POST, instance=CHImyFirstApartmentObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHImyFirstApartment.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('rentSplit-apartment-test-for-danny-chi', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIbedroomsForm(instance=CHImyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment_test_for_danny_chi/bedrooms.html', {'form':form, 'CHImyFirstApartmentObject': CHImyFirstApartmentObject})


def rentSplit(request, id=None):
	if id:
		CHImyFirstApartmentObject = CHImyFirstApartment.objects.get(pk=id)
	else:
		CHImyFirstApartmentObject = CHImyFirstApartment()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIrentSplitForm(request.POST, instance=CHImyFirstApartmentObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHImyFirstApartment.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('iPaid-apartment-test-for-danny-chi', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIrentSplitForm(instance=CHImyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment_test_for_danny_chi/rentSplit.html', {'form':form, 'CHImyFirstApartmentObject': CHImyFirstApartmentObject})


def iPaid(request, id=None):
	if id:
		CHImyFirstApartmentObject = CHImyFirstApartment.objects.get(pk=id)
	else:
		CHImyFirstApartmentObject = CHImyFirstApartment()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHIiPaidForm(request.POST, instance=CHImyFirstApartmentObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHImyFirstApartment.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('allPaid-apartment-test-for-danny-chi', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIiPaidForm(instance=CHImyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment_test_for_danny_chi/iPaid.html', {'form':form, 'CHImyFirstApartmentObject': CHImyFirstApartmentObject})


def allPaid(request, id=None):
	if id:
		CHImyFirstApartmentObject = CHImyFirstApartment.objects.get(pk=id)
		allPaid = CHImyFirstApartmentObject.iPaid * CHImyFirstApartmentObject.rentSplit
	else:
		CHImyFirstApartmentObject = CHImyFirstApartment()
		allPaid = 0


	# A HTTP POST?
	if request.method == 'POST':
		form = CHIallPaidForm(request.POST, instance=CHImyFirstApartmentObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHImyFirstApartment.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('calc-apartment-test-for-danny-chi', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIallPaidForm(instance=CHImyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment_test_for_danny_chi/allPaid.html', {'form':form, 'CHImyFirstApartmentObject': CHImyFirstApartmentObject, 'allPaid': allPaid})

def calc(request, id=None):
	if id:
		CHImyFirstApartmentObject = CHImyFirstApartment.objects.get(pk=id)
	else:
		CHImyFirstApartmentObject = CHImyFirstApartment()

	# keep a count of how many times this ad has been served
	try:
		adCountObject = adCount.objects.get(pk=1)
	except adCount.DoesNotExist:
		adCountObject = adCount()

	adCountObject.served += 1
	adCountObject.save()

	return render(request, 'apartment_test_for_danny_chi/calc.html', {'CHImyFirstApartmentObject': CHImyFirstApartmentObject})

def end(request, id=None):
	if id:
		CHImyFirstApartmentObject = CHImyFirstApartment.objects.get(pk=id)
	else:
		CHImyFirstApartmentObject = CHImyFirstApartment()

	#here we'll need to calculate the real dollar number in 2016 as well as show the zillow numbers here

	#get cpi number for the year we need it
	if CHImyFirstApartmentObject.exactYearMoved >= 1913:
		cpiThen = cpi.objects.get(year=CHImyFirstApartmentObject.exactYearMoved)
		CHImyFirstApartmentObject.year = CHImyFirstApartmentObject.exactYearMoved
	elif CHImyFirstApartmentObject.exactYearMoved >= 1900:
		cpiThen = cpi.objects.get(year=1913)
		CHImyFirstApartmentObject.year = CHImyFirstApartmentObject.exactYearMoved
	else:
		CHImyFirstApartmentObject.year = CHImyFirstApartmentObject.whenMoved
		if CHImyFirstApartmentObject.whenMoved == '2010 - Present':
			cpiThen = cpi.objects.get(year=2012)
		elif CHImyFirstApartmentObject.whenMoved == '2000 - 2009':
			cpiThen = cpi.objects.get(year=2005)
		elif CHImyFirstApartmentObject.whenMoved == '1990 - 1999':
			cpiThen = cpi.objects.get(year=1995)
		elif CHImyFirstApartmentObject.whenMoved == '1980 - 1989':
			cpiThen = cpi.objects.get(year=1985)
		elif CHImyFirstApartmentObject.whenMoved == '1970 - 1979':
			cpiThen = cpi.objects.get(year=1975)
		elif CHImyFirstApartmentObject.whenMoved == '1960 - 1969':
			cpiThen = cpi.objects.get(year=1965)
		else:
			cpiThen = cpi.objects.get(year=1955)

	cpiNow = cpi.objects.get(year=2016)

	# calculate CPI
	CHImyFirstApartmentObject.withInflation = (cpiNow.cpi/cpiThen.cpi) * CHImyFirstApartmentObject.allPaid 

	# pull today value depending on neighborhood and bedrooms
	# bedrooms
	if CHImyFirstApartmentObject.bedrooms > 5:
		bedroomsTry = 5
	else:
		bedroomsTry = CHImyFirstApartmentObject.bedrooms

	# set using zri score to false
	CHImyFirstApartmentObject.usingzri = False

	try:
		zillowNow = zillowMedianRentListPrice.objects.get(bedrooms=bedroomsTry, RegionName=CHImyFirstApartmentObject.whereMoved.name)		
		CHImyFirstApartmentObject.todayType = CHImyFirstApartmentObject.whereMoved.name

	except zillowMedianRentListPrice.DoesNotExist: 
		if bedroomsTry == 0:
			try:
				bedroomsTry = 99
				zillowNow = zillowMedianRentListPrice.objects.get(bedrooms=bedroomsTry, RegionName=CHImyFirstApartmentObject.whereMoved.name)
				CHImyFirstApartmentObject.todayType = CHImyFirstApartmentObject.whereMoved.name
				CHImyFirstApartmentObject.usingzri = True

			except zillowMedianRentListPrice.DoesNotExist: 
				bedroomsTry = 0
				zillowNow = zillowMedianRentListPrice.objects.get(bedrooms=bedroomsTry, RegionName="city")
				CHImyFirstApartmentObject.todayType = "Citywide"
				CHImyFirstApartmentObject.usingzri = False

		else: 

			try:
				zillowNow = zillowMedianRentListPrice.objects.get(bedrooms=bedroomsTry, RegionName=CHImyFirstApartmentObject.whereMoved.county)
				CHImyFirstApartmentObject.todayType = CHImyFirstApartmentObject.whereMoved.county

			except zillowMedianRentListPrice.DoesNotExist: 
				zillowNow = zillowMedianRentListPrice.objects.get(bedrooms=bedroomsTry, RegionName="city")
				CHImyFirstApartmentObject.todayType = "Citywide"


	CHImyFirstApartmentObject.today = zillowNow.Cost

	# social urls
	url = "https://www.dnainfo.com/chicago/visualizations/dummy-url?results=" + str(id) + "/"
	# connect to Bitly API
	c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
	bitlyURL = c.shorten(url)

	return render(request, 'apartment_test_for_danny_chi/end.html', {'CHImyFirstApartmentObject': CHImyFirstApartmentObject, "bitlyURL": bitlyURL})

def results(request, id=None):
	if id:
		CHImyFirstApartmentObject = CHImyFirstApartment.objects.get(pk=id)
	else:
		CHImyFirstApartmentObject = CHImyFirstApartment()

	#here we'll need to calculate the real dollar number in 2016 as well as show the zillow numbers here

	#get cpi number for the year we need it
	if CHImyFirstApartmentObject.exactYearMoved >= 1913:
		cpiThen = cpi.objects.get(year=CHImyFirstApartmentObject.exactYearMoved)
		CHImyFirstApartmentObject.year = CHImyFirstApartmentObject.exactYearMoved
	elif CHImyFirstApartmentObject.exactYearMoved >= 1900:
		cpiThen = cpi.objects.get(year=1913)
		CHImyFirstApartmentObject.year = CHImyFirstApartmentObject.exactYearMoved
	else:
		CHImyFirstApartmentObject.year = CHImyFirstApartmentObject.whenMoved
		if CHImyFirstApartmentObject.whenMoved == '2010 - Present':
			cpiThen = cpi.objects.get(year=2012)
		elif CHImyFirstApartmentObject.whenMoved == '2000 - 2009':
			cpiThen = cpi.objects.get(year=2005)
		elif CHImyFirstApartmentObject.whenMoved == '1990 - 1999':
			cpiThen = cpi.objects.get(year=1995)
		elif CHImyFirstApartmentObject.whenMoved == '1980 - 1989':
			cpiThen = cpi.objects.get(year=1985)
		elif CHImyFirstApartmentObject.whenMoved == '1970 - 1979':
			cpiThen = cpi.objects.get(year=1975)
		elif CHImyFirstApartmentObject.whenMoved == '1960 - 1969':
			cpiThen = cpi.objects.get(year=1965)
		else:
			cpiThen = cpi.objects.get(year=1955)

	cpiNow = cpi.objects.get(year=2016)

	# calculate CPI
	CHImyFirstApartmentObject.withInflation = (cpiNow.cpi/cpiThen.cpi) * CHImyFirstApartmentObject.allPaid 

	# pull today value depending on neighborhood and bedrooms
	# bedrooms
	if CHImyFirstApartmentObject.bedrooms > 5:
		bedroomsTry = 5
	else:
		bedroomsTry = CHImyFirstApartmentObject.bedrooms
	
	# set using zri score to false
	CHImyFirstApartmentObject.usingzri = False

	try:
		zillowNow = zillowMedianRentListPrice.objects.get(bedrooms=bedroomsTry, RegionName=CHImyFirstApartmentObject.whereMoved.name)		
		CHImyFirstApartmentObject.todayType = CHImyFirstApartmentObject.whereMoved.name

	except zillowMedianRentListPrice.DoesNotExist: 
		if bedroomsTry == 0:
			try:
				bedroomsTry = 99
				zillowNow = zillowMedianRentListPrice.objects.get(bedrooms=bedroomsTry, RegionName=CHImyFirstApartmentObject.whereMoved.name)
				CHImyFirstApartmentObject.todayType = CHImyFirstApartmentObject.whereMoved.name
				CHImyFirstApartmentObject.usingzri = True

			except zillowMedianRentListPrice.DoesNotExist: 
				zillowNow = zillowMedianRentListPrice.objects.get(bedrooms=bedroomsTry, RegionName="city")
				CHImyFirstApartmentObject.todayType = "Citywide"
				CHImyFirstApartmentObject.usingzri = False

		else: 

			try:
				zillowNow = zillowMedianRentListPrice.objects.get(bedrooms=bedroomsTry, RegionName=CHImyFirstApartmentObject.whereMoved.county)
				CHImyFirstApartmentObject.todayType = CHImyFirstApartmentObject.whereMoved.county

			except zillowMedianRentListPrice.DoesNotExist: 
				zillowNow = zillowMedianRentListPrice.objects.get(bedrooms=bedroomsTry, RegionName="city")
				CHImyFirstApartmentObject.todayType = "Citywide"


	CHImyFirstApartmentObject.today = zillowNow.Cost

	# social urls
	url = "https://www.dnainfo.com/chicago/visualizations/dummy-url?results=" + str(id) + "/"
	# connect to Bitly API
	c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
	bitlyURL = c.shorten(url)



	return render(request, 'apartment_test_for_danny_chi/results.html', {'CHImyFirstApartmentObject': CHImyFirstApartmentObject, "bitlyURL": bitlyURL})


def rawdataapi(request):
	response = {}

	if request.method == 'GET':
		kwargs = {}

		datas = CHImyFirstApartment.objects.filter(**kwargs)
		for data in datas:
			if data.whereMoved:
				name = data.whereMoved.name
			else:
				name = ''
			response[data.pk] = {}
			response[data.pk]['created'] = data.created
			response[data.pk]['whenMoved'] = data.whenMoved
			response[data.pk]['whereMoved'] = name
			response[data.pk]['iDontSeeMyNeighborhood'] = data.iDontSeeMyNeighborhood
			response[data.pk]['firstApartmentLocation'] = data.firstApartmentLocation
			response[data.pk]['exactYearMoved'] = data.exactYearMoved
			response[data.pk]['bedrooms'] = data.bedrooms
			response[data.pk]['rentSplit'] = data.rentSplit
			response[data.pk]['iPaid'] = data.iPaid
			response[data.pk]['allPaid'] = data.allPaid

	return JsonResponse(response)


def rawdatacsv(request):
	# Create the HttpResponse object with the appropriate CSV header.
	response = HttpResponse(content_type='text/csv')
	response['Content-Disposition'] = 'attachment; filename="MFA_CHI_Raw_Data.csv"'

	if request.method == 'GET':
		writer = csv.writer(response)
		#header row
		headerRow = ['id', 'created', 'whenMoved', 'whereMoved', 'iDontSeeMyNeighborhood', 'firstApartmentLocation', 'exactYearMoved', 'bedrooms', 'rentSplit', 'iPaid', 'allPaid']
		writer.writerow(headerRow)
		kwargs = {}
		datas = CHImyFirstApartment.objects.filter(**kwargs)
		for data in datas:
			if data.whereMoved:
				name = data.whereMoved.name
			else:
				name = ''
			row = ['','','','','','','','','','','']
			row[0] = data.pk
			row[1] = data.created
			row[2] = data.whenMoved
			row[3] = name
			row[4] = data.iDontSeeMyNeighborhood
			row[5] = data.firstApartmentLocation
			row[6] = data.exactYearMoved
			row[7] = data.bedrooms
			row[8] = data.rentSplit
			row[9] = data.iPaid
			row[10] = data.allPaid
			writer.writerow(row)

	return response


def summarydataapi(request):
	response = {}

	if request.method == 'GET':
		kwargs = {}

		datas = CHImyFirstApartment.objects.filter(**kwargs).values('whereMoved_id', 'whenMoved', 'bedrooms').annotate(Avg('allPaid'), Count('id'))
		for data in datas:
			if data['whereMoved_id']:
				hood = neighborhoodCHI.objects.get(id=data['whereMoved_id'])
				hoodname = hood.name
			else:
				hoodname = ''

			try:
				response[hoodname][data['whenMoved']][data['bedrooms']] = {}
			except: 
				response[hoodname] = {}
				response[hoodname][data['whenMoved']] = {}
				response[hoodname][data['whenMoved']][data['bedrooms']] = {}

			response[hoodname][data['whenMoved']][data['bedrooms']]['count'] = data['id__count'] 
			response[hoodname][data['whenMoved']][data['bedrooms']]['AverageRent'] = data['allPaid__avg'] 

		datas = CHImyFirstApartment.objects.filter(**kwargs).values('whenMoved', 'bedrooms').annotate(Avg('allPaid'), Count('id'))
		response['Citywide'] = {}
		for data in datas:
			try:
				response['Citywide'][data['whenMoved']][data['bedrooms']] = {}
			except: 
				response['Citywide'][data['whenMoved']] = {}
				response['Citywide'][data['whenMoved']][data['bedrooms']] = {}

			response['Citywide'][data['whenMoved']][data['bedrooms']]['count'] = data['id__count'] 
			response['Citywide'][data['whenMoved']][data['bedrooms']]['allPaid'] = data['allPaid__avg'] 


	return JsonResponse(response)
