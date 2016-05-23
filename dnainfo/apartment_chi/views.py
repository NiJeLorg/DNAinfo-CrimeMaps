from django.shortcuts import render, redirect

from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect

#import all apartment models and forms
from apartment_chi.models import *
from apartment_chi.forms import *

# bitly API
import bitly_api

# views for DNAinfo my first apartment
def index(request):
	return redirect('http://www.dnainfo.com/')

def intro(request):
	return render(request, 'apartment_chi/intro.html', {})

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
			return HttpResponseRedirect(reverse('whatNeighborhood_chi', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIfirstMoveForm(instance=CHImyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment_chi/firstMove.html', {'form':form, 'CHImyFirstApartmentObject': CHImyFirstApartmentObject})


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
			return HttpResponseRedirect(reverse('exactLocation_chi', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIwhatNeighborhoodForm(instance=CHImyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment_chi/whatNeighborhood.html', {'form':form, 'CHImyFirstApartmentObject': CHImyFirstApartmentObject})


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
			return HttpResponseRedirect(reverse('yearMoved_chi', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIexactLocationForm(instance=CHImyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment_chi/exactLocation.html', {'form':form, 'CHImyFirstApartmentObject': CHImyFirstApartmentObject})


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
			return HttpResponseRedirect(reverse('bedrooms_chi', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIyearMovedForm(instance=CHImyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment_chi/yearMoved.html', {'form':form, 'CHImyFirstApartmentObject': CHImyFirstApartmentObject})


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
			return HttpResponseRedirect(reverse('rentSplit_chi', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIbedroomsForm(instance=CHImyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment_chi/bedrooms.html', {'form':form, 'CHImyFirstApartmentObject': CHImyFirstApartmentObject})


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
			return HttpResponseRedirect(reverse('iPaid_chi', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIrentSplitForm(instance=CHImyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment_chi/rentSplit.html', {'form':form, 'CHImyFirstApartmentObject': CHImyFirstApartmentObject})


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
			return HttpResponseRedirect(reverse('allPaid_chi', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIiPaidForm(instance=CHImyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment_chi/iPaid.html', {'form':form, 'CHImyFirstApartmentObject': CHImyFirstApartmentObject})


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
			return HttpResponseRedirect(reverse('calc_chi', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHIallPaidForm(instance=CHImyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment_chi/allPaid.html', {'form':form, 'CHImyFirstApartmentObject': CHImyFirstApartmentObject, 'allPaid': allPaid})

def calc(request, id=None):
	if id:
		CHImyFirstApartmentObject = CHImyFirstApartment.objects.get(pk=id)
	else:
		CHImyFirstApartmentObject = CHImyFirstApartment()

	return render(request, 'apartment_chi/calc.html', {'CHImyFirstApartmentObject': CHImyFirstApartmentObject})

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
	url = "https://sprnt-2273-apartment-visualization.build.qa.dnainfo.com/chicago/visualizations/apartment-rent-real-estate-price-changes?results=" + str(id) + "/"
	# connect to Bitly API
	c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
	bitlyURL = c.shorten(url)

	return render(request, 'apartment_chi/end.html', {'CHImyFirstApartmentObject': CHImyFirstApartmentObject, "bitlyURL": bitlyURL})

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
	url = "https://sprnt-2273-apartment-visualization.build.qa.dnainfo.com/chicago/visualizations/apartment-rent-real-estate-price-changes?results=" + str(id) + "/"
	# connect to Bitly API
	c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
	bitlyURL = c.shorten(url)



	return render(request, 'apartment_chi/results.html', {'CHImyFirstApartmentObject': CHImyFirstApartmentObject, "bitlyURL": bitlyURL})
