from django.shortcuts import render, redirect

from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect

#import all apartment models and forms
from apartment.models import *
from apartment.forms import *

# bitly API
import bitly_api

# views for DNAinfo my first apartment
def index(request):
	return redirect('http://www.dnainfo.com/')

def intro(request):
	return render(request, 'apartment/intro.html', {})

def firstMove(request, id=None):
	if id:
		NYCmyFirstApartmentObject = NYCmyFirstApartment.objects.get(pk=id)
	else:
		NYCmyFirstApartmentObject = NYCmyFirstApartment()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCfirstMoveForm(request.POST, instance=NYCmyFirstApartmentObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCmyFirstApartment.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('whatNeighborhood', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCfirstMoveForm(instance=NYCmyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment/firstMove.html', {'form':form, 'NYCmyFirstApartmentObject': NYCmyFirstApartmentObject})


def whatNeighborhood(request, id=None):
	if id:
		NYCmyFirstApartmentObject = NYCmyFirstApartment.objects.get(pk=id)
	else:
		NYCmyFirstApartmentObject = NYCmyFirstApartment()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCwhatNeighborhoodForm(request.POST, instance=NYCmyFirstApartmentObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCmyFirstApartment.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('exactLocation', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCwhatNeighborhoodForm(instance=NYCmyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment/whatNeighborhood.html', {'form':form, 'NYCmyFirstApartmentObject': NYCmyFirstApartmentObject})


def exactLocation(request, id=None):
	if id:
		NYCmyFirstApartmentObject = NYCmyFirstApartment.objects.get(pk=id)
	else:
		NYCmyFirstApartmentObject = NYCmyFirstApartment()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCexactLocationForm(request.POST, instance=NYCmyFirstApartmentObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCmyFirstApartment.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('yearMoved', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCexactLocationForm(instance=NYCmyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment/exactLocation.html', {'form':form, 'NYCmyFirstApartmentObject': NYCmyFirstApartmentObject})


def yearMoved(request, id=None):
	if id:
		NYCmyFirstApartmentObject = NYCmyFirstApartment.objects.get(pk=id)
	else:
		NYCmyFirstApartmentObject = NYCmyFirstApartment()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCyearMovedForm(request.POST, instance=NYCmyFirstApartmentObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCmyFirstApartment.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('bedrooms', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCyearMovedForm(instance=NYCmyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment/yearMoved.html', {'form':form, 'NYCmyFirstApartmentObject': NYCmyFirstApartmentObject})


def bedrooms(request, id=None):
	if id:
		NYCmyFirstApartmentObject = NYCmyFirstApartment.objects.get(pk=id)
	else:
		NYCmyFirstApartmentObject = NYCmyFirstApartment()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCbedroomsForm(request.POST, instance=NYCmyFirstApartmentObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCmyFirstApartment.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('rentSplit', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCbedroomsForm(instance=NYCmyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment/bedrooms.html', {'form':form, 'NYCmyFirstApartmentObject': NYCmyFirstApartmentObject})


def rentSplit(request, id=None):
	if id:
		NYCmyFirstApartmentObject = NYCmyFirstApartment.objects.get(pk=id)
	else:
		NYCmyFirstApartmentObject = NYCmyFirstApartment()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCrentSplitForm(request.POST, instance=NYCmyFirstApartmentObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCmyFirstApartment.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('iPaid', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCrentSplitForm(instance=NYCmyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment/rentSplit.html', {'form':form, 'NYCmyFirstApartmentObject': NYCmyFirstApartmentObject})


def iPaid(request, id=None):
	if id:
		NYCmyFirstApartmentObject = NYCmyFirstApartment.objects.get(pk=id)
	else:
		NYCmyFirstApartmentObject = NYCmyFirstApartment()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCiPaidForm(request.POST, instance=NYCmyFirstApartmentObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCmyFirstApartment.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('allPaid', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCiPaidForm(instance=NYCmyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment/iPaid.html', {'form':form, 'NYCmyFirstApartmentObject': NYCmyFirstApartmentObject})


def allPaid(request, id=None):
	if id:
		NYCmyFirstApartmentObject = NYCmyFirstApartment.objects.get(pk=id)
		allPaid = NYCmyFirstApartmentObject.iPaid * NYCmyFirstApartmentObject.rentSplit
	else:
		NYCmyFirstApartmentObject = NYCmyFirstApartment()
		allPaid = 0


	# A HTTP POST?
	if request.method == 'POST':
		form = NYCallPaidForm(request.POST, instance=NYCmyFirstApartmentObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCmyFirstApartment.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('calc', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCallPaidForm(instance=NYCmyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment/allPaid.html', {'form':form, 'NYCmyFirstApartmentObject': NYCmyFirstApartmentObject, 'allPaid': allPaid})

def calc(request, id=None):
	if id:
		NYCmyFirstApartmentObject = NYCmyFirstApartment.objects.get(pk=id)
	else:
		NYCmyFirstApartmentObject = NYCmyFirstApartment()

	return render(request, 'apartment/calc.html', {'NYCmyFirstApartmentObject': NYCmyFirstApartmentObject})

def end(request, id=None):
	if id:
		NYCmyFirstApartmentObject = NYCmyFirstApartment.objects.get(pk=id)
	else:
		NYCmyFirstApartmentObject = NYCmyFirstApartment()

	#here we'll need to calculate the real dollar number in 2016 as well as show the zillow numbers here

	#get cpi number for the year we need it
	if NYCmyFirstApartmentObject.exactYearMoved >= 1913:
		cpiThen = cpi.objects.get(year=NYCmyFirstApartmentObject.exactYearMoved)
		NYCmyFirstApartmentObject.year = NYCmyFirstApartmentObject.exactYearMoved
	elif NYCmyFirstApartmentObject.exactYearMoved >= 1900:
		cpiThen = cpi.objects.get(year=1913)
		NYCmyFirstApartmentObject.year = NYCmyFirstApartmentObject.exactYearMoved
	else:
		NYCmyFirstApartmentObject.year = NYCmyFirstApartmentObject.whenMoved
		if NYCmyFirstApartmentObject.whenMoved == '2010 - Present':
			cpiThen = cpi.objects.get(year=2012)
		elif NYCmyFirstApartmentObject.whenMoved == '2000 - 2009':
			cpiThen = cpi.objects.get(year=2005)
		elif NYCmyFirstApartmentObject.whenMoved == '1990 - 1999':
			cpiThen = cpi.objects.get(year=1995)
		elif NYCmyFirstApartmentObject.whenMoved == '1980 - 1989':
			cpiThen = cpi.objects.get(year=1985)
		elif NYCmyFirstApartmentObject.whenMoved == '1970 - 1979':
			cpiThen = cpi.objects.get(year=1975)
		elif NYCmyFirstApartmentObject.whenMoved == '1960 - 1969':
			cpiThen = cpi.objects.get(year=1965)
		else:
			cpiThen = cpi.objects.get(year=1955)

	cpiNow = cpi.objects.get(year=2016)

	# calculate CPI
	NYCmyFirstApartmentObject.withInflation = (cpiNow.cpi/cpiThen.cpi) * NYCmyFirstApartmentObject.allPaid 

	# pull today value depending on neighborhood and bedrooms
	# bedrooms
	if NYCmyFirstApartmentObject.bedrooms > 5:
		bedroomsTry = 5
	else:
		bedroomsTry = NYCmyFirstApartmentObject.bedrooms

	try:
		zillowNow = zillowMedianRentListPrice.objects.get(bedrooms=bedroomsTry, RegionName=NYCmyFirstApartmentObject.whereMoved.name)		
		NYCmyFirstApartmentObject.todayType = NYCmyFirstApartmentObject.whereMoved.name

	except zillowMedianRentListPrice.DoesNotExist: 
		try:
			zillowNow = zillowMedianRentListPrice.objects.get(bedrooms=bedroomsTry, RegionName=NYCmyFirstApartmentObject.whereMoved.county)
			NYCmyFirstApartmentObject.todayType = NYCmyFirstApartmentObject.whereMoved.county

		except zillowMedianRentListPrice.DoesNotExist: 
			zillowNow = zillowMedianRentListPrice.objects.get(bedrooms=bedroomsTry, RegionName="city")
			NYCmyFirstApartmentObject.todayType = "Citywide"

	NYCmyFirstApartmentObject.today = zillowNow.Cost

	# social urls
	url = "https://visualizations.dnainfo.com/my-first-apartment/results/" + str(id) + "/"
	# connect to Bitly API
	c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
	bitlyURL = c.shorten(url)



	return render(request, 'apartment/end.html', {'NYCmyFirstApartmentObject': NYCmyFirstApartmentObject, "bitlyURL": bitlyURL})

def results(request, id=None):
	if id:
		NYCmyFirstApartmentObject = NYCmyFirstApartment.objects.get(pk=id)
	else:
		NYCmyFirstApartmentObject = NYCmyFirstApartment()

	#here we'll need to calculate the real dollar number in 2016 as well as show the zillow numbers here

	#get cpi number for the year we need it
	if NYCmyFirstApartmentObject.exactYearMoved >= 1913:
		cpiThen = cpi.objects.get(year=NYCmyFirstApartmentObject.exactYearMoved)
		NYCmyFirstApartmentObject.year = NYCmyFirstApartmentObject.exactYearMoved
	elif NYCmyFirstApartmentObject.exactYearMoved >= 1900:
		cpiThen = cpi.objects.get(year=1913)
		NYCmyFirstApartmentObject.year = NYCmyFirstApartmentObject.exactYearMoved
	else:
		NYCmyFirstApartmentObject.year = NYCmyFirstApartmentObject.whenMoved
		if NYCmyFirstApartmentObject.whenMoved == '2010 - Present':
			cpiThen = cpi.objects.get(year=2012)
		elif NYCmyFirstApartmentObject.whenMoved == '2000 - 2009':
			cpiThen = cpi.objects.get(year=2005)
		elif NYCmyFirstApartmentObject.whenMoved == '1990 - 1999':
			cpiThen = cpi.objects.get(year=1995)
		elif NYCmyFirstApartmentObject.whenMoved == '1980 - 1989':
			cpiThen = cpi.objects.get(year=1985)
		elif NYCmyFirstApartmentObject.whenMoved == '1970 - 1979':
			cpiThen = cpi.objects.get(year=1975)
		elif NYCmyFirstApartmentObject.whenMoved == '1960 - 1969':
			cpiThen = cpi.objects.get(year=1965)
		else:
			cpiThen = cpi.objects.get(year=1955)

	cpiNow = cpi.objects.get(year=2016)

	# calculate CPI
	NYCmyFirstApartmentObject.withInflation = (cpiNow.cpi/cpiThen.cpi) * NYCmyFirstApartmentObject.allPaid 

	# pull today value depending on neighborhood and bedrooms
	# bedrooms
	if NYCmyFirstApartmentObject.bedrooms > 5:
		bedroomsTry = 5
	else:
		bedroomsTry = NYCmyFirstApartmentObject.bedrooms
	
	try:
		zillowNow = zillowMedianRentListPrice.objects.get(bedrooms=bedroomsTry, RegionName=NYCmyFirstApartmentObject.whereMoved.name)		
		NYCmyFirstApartmentObject.todayType = NYCmyFirstApartmentObject.whereMoved.name

	except zillowMedianRentListPrice.DoesNotExist: 
		try:
			zillowNow = zillowMedianRentListPrice.objects.get(bedrooms=bedroomsTry, RegionName=NYCmyFirstApartmentObject.whereMoved.county)
			NYCmyFirstApartmentObject.todayType = NYCmyFirstApartmentObject.whereMoved.county

		except zillowMedianRentListPrice.DoesNotExist: 
			zillowNow = zillowMedianRentListPrice.objects.get(bedrooms=bedroomsTry, RegionName="city")
			NYCmyFirstApartmentObject.todayType = "Citywide"

	NYCmyFirstApartmentObject.today = zillowNow.Cost

	# social urls
	url = "https://visualizations.dnainfo.com/my-first-apartment/results/" + str(id) + "/"
	# connect to Bitly API
	c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
	bitlyURL = c.shorten(url)



	return render(request, 'apartment/results.html', {'NYCmyFirstApartmentObject': NYCmyFirstApartmentObject, "bitlyURL": bitlyURL})
