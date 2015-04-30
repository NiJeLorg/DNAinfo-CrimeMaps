from django.shortcuts import render
from django.http import JsonResponse

#import all crimemaps models
from crimemaps.models import *

#for creating json objects
import json

# for date parsing
import datetime
import dateutil.parser

# views for DNAinfo crime maps
def compstatPage(request):
	today = datetime.datetime.now()
	DD = datetime.timedelta(days=30)
	earlier = today - DD
	today_str = today.strftime("%x")
	earlier_str = earlier.strftime("%x")
	startDate = request.GET.get("startDate",earlier_str)
	endDate = request.GET.get("endDate",today_str)
	#ensure startDate and endDate are datetime objects
	startDate = dateutil.parser.parse(startDate).date()
	endDate = dateutil.parser.parse(endDate).date()

	#select a distinct list of end dates from the system
	dates = []
	dateList = compstat.objects.values('start_date', 'end_date').distinct().order_by('-start_date')
	for date in dateList:
		dates.append(date)

	return render(request, 'crimemaps/compstat.html', {'startDate':startDate, 'endDate':endDate, 'dates':dates})


def doittPage(request):
	today = datetime.datetime.now()
	today_str = today.strftime("%M %Y")
	monthYearGet = request.GET.get("monthYear",today_str)
	#ensure date is a datetime object
	monthDayYear = '1 ' + monthYearGet
	monthYear = dateutil.parser.parse(monthDayYear).date()

	#select a distinct list of end dates from the system
	dates = []
	dateList = doitt.objects.values('MO', 'YR').distinct().order_by('-YR', '-MO')
	for date in dateList:
		string = str(date['MO']) + '/1/' + str(date['YR'])
		parsed = dateutil.parser.parse(string).date()
		dates.append(parsed)

	return render(request, 'crimemaps/doitt.html', {'monthYear':monthYear, 'dates':dates})

def blotterPage(request):
	today = datetime.datetime.now()
	DD = datetime.timedelta(days=7)
	earlier = today - DD
	today_str = today.strftime("%x")
	earlier_str = earlier.strftime("%x")
	startDate = request.GET.get("startDate",earlier_str)
	endDate = request.GET.get("endDate",today_str)
	#ensure startDate and endDate are datetime objects
	startDate = dateutil.parser.parse(startDate).date()
	endDate = dateutil.parser.parse(endDate).date()

	#select a distinct list of end dates from the system
	dates = []
	latestDate = blotter.objects.latest('DateTime')
	earliestDate = blotter.objects.earliest('DateTime')
	countDate = latestDate.DateTime
	while (earliestDate.DateTime < countDate):
		date = {}
		date['end_date'] = countDate
		date['start_date'] = countDate - DD
		dates.append(date)
		countDate = countDate - DD 
	

	return render(request, 'crimemaps/blotter.html', {'startDate':startDate, 'endDate':endDate, 'dates':dates})



def compstatApi(request):
	response = {}
	if request.method == 'GET':
		startDate = request.GET.get("startDate","")
		endDate = request.GET.get("endDate","")
		# create data objects from start and end dates
		startDateparsed = dateutil.parser.parse(startDate)
		startDateobject = startDateparsed.date()
		endDateparsed = dateutil.parser.parse(endDate)
		endDateobject = endDateparsed.date()

		#pull compstat data
		compstats = compstat.objects.filter(start_date__gte=startDateobject, end_date__lte=endDateobject)
		for stat in compstats:
			# parse dates into strings
			response[stat.precinct] = {}
			response[stat.precinct]['start_date'] = stat.start_date
			response[stat.precinct]['end_date'] = stat.end_date
			response[stat.precinct]['murder'] = stat.murder
			response[stat.precinct]['rape'] = stat.rape
			response[stat.precinct]['robbery'] = stat.robbery
			response[stat.precinct]['felony_assault'] = stat.felony_assault
			response[stat.precinct]['burglary'] = stat.burglary
			response[stat.precinct]['grand_larceny'] = stat.grand_larceny
			response[stat.precinct]['grand_larceny_auto'] = stat.grand_larceny_auto
			response[stat.precinct]['total'] = stat.total
			response[stat.precinct]['transit'] = stat.transit
			response[stat.precinct]['housing'] = stat.housing
			response[stat.precinct]['petit_larceny'] = stat.petit_larceny
			response[stat.precinct]['misdemeanor_assault'] = stat.misdemeanor_assault
			response[stat.precinct]['misdemeanor_sex_crimes'] = stat.misdemeanor_sex_crimes
			response[stat.precinct]['shooting_victims'] = stat.shooting_victims
			response[stat.precinct]['shooting_inc'] = stat.shooting_inc
			response[stat.precinct]['murder_last_year'] = stat.murder_last_year
			response[stat.precinct]['rape_last_year'] = stat.rape_last_year
			response[stat.precinct]['robbery_last_year'] = stat.robbery_last_year
			response[stat.precinct]['felony_assault_last_year'] = stat.felony_assault_last_year
			response[stat.precinct]['burglary_last_year'] = stat.burglary_last_year
			response[stat.precinct]['grand_larceny_last_year'] = stat.grand_larceny_last_year
			response[stat.precinct]['grand_larceny_auto_last_year'] = stat.grand_larceny_auto_last_year
			response[stat.precinct]['total_last_year'] = stat.total_last_year
			response[stat.precinct]['transit_last_year'] = stat.transit_last_year
			response[stat.precinct]['housing_last_year'] = stat.housing_last_year
			response[stat.precinct]['petit_larceny_last_year'] = stat.petit_larceny_last_year
			response[stat.precinct]['misdemeanor_assault_last_year'] = stat.misdemeanor_assault_last_year
			response[stat.precinct]['misdemeanor_sex_crimes_last_year'] = stat.misdemeanor_sex_crimes_last_year
			response[stat.precinct]['shooting_victims_last_year'] = stat.shooting_victims_last_year
			response[stat.precinct]['shooting_inc_last_year'] = stat.shooting_inc_last_year

	return JsonResponse(response)


def doittApi(request):
	#add in the items geojson requires 
	response = {}
	response['type'] = "FeatureCollection"
	response['features'] = []

	if request.method == 'GET':
		monthYear = request.GET.get("monthYear","")
		monthDayYear = '1 ' + monthYear
		# create data objects from start and end dates
		dateparsed = dateutil.parser.parse(monthDayYear)
		month = dateparsed.month
		year = dateparsed.year

		#pull doitt data
		doitts = doitt.objects.filter(MO__exact=month, YR__exact=year)
		for stat in doitts:
			# parse dates into strings
			data = {}
			data['type'] = 'Feature'
			data['properties'] = {}
			data['properties']['YR'] = stat.YR
			data['properties']['MO'] = stat.MO
			data['properties']['X'] = stat.X
			data['properties']['Y'] = stat.Y
			data['properties']['TOT'] = stat.TOT
			data['properties']['CR'] = stat.CR
			data['geometry'] = {}
			data['geometry']['type'] = 'Point'
			data['geometry']['coordinates'] = [stat.longitude, stat.latitude]
			response['features'].append(data)


	return JsonResponse(response)


def blotterApi(request):
	#add in the items geojson requires 
	response = {}
	response['type'] = "FeatureCollection"
	response['features'] = []

	if request.method == 'GET':
		startDate = request.GET.get("startDate","")
		endDate = request.GET.get("endDate","")
		# create data objects from start and end dates
		startDateparsed = dateutil.parser.parse(startDate)
		startDateobject = startDateparsed.date()
		endDateparsed = dateutil.parser.parse(endDate)
		endDateobject = endDateparsed.date()

		#pull doitt data
		blotters = blotter.objects.filter(DateTime__range=[startDateobject,endDateobject])
		for stat in blotters:
			# parse dates into strings
			data = {}
			data['type'] = 'Feature'
			data['properties'] = {}
			data['properties']['Precinct'] = stat.Precinct
			data['properties']['Address'] = stat.Address
			data['properties']['DateTime'] = stat.DateTime
			data['properties']['BlotterWeek'] = stat.BlotterWeek
			data['properties']['CrimeType'] = stat.CrimeType
			data['properties']['PoliceSaid'] = stat.PoliceSaid
			data['properties']['Arrest'] = stat.Arrest
			data['properties']['JSDate'] = stat.JSDate
			data['geometry'] = {}
			data['geometry']['type'] = 'Point'
			data['geometry']['coordinates'] = [stat.Longitude, stat.Latitude]
			response['features'].append(data)


	return JsonResponse(response)
