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
			return HttpResponseRedirect(reverse('whatNeighborhood', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCrentSplitForm(instance=NYCmyFirstApartmentObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'apartment/rentSplit.html', {'form':form, 'NYCmyFirstApartmentObject': NYCmyFirstApartmentObject})
