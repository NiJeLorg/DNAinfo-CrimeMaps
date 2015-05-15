from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.db.models import Sum

#import all crimemaps models
from crimemaps.models import *

#for creating json objects
import json

# for date parsing
import datetime
import dateutil.parser
from dateutil.relativedelta import relativedelta

# views for DNAinfo crime maps
def index(request):
	return redirect('/compstat/')

def workedFromHome(request):
	return render(request, 'crimemaps/workedFromHome.html', {})

def linkiframebuilder(request):
	#select a distinct list of end dates from the system
	compstatDates = []
	dateList = compstat.objects.values('start_date', 'end_date').distinct().order_by('-start_date')
	for date in dateList:
		compstatDates.append(date)

	#select a distinct list of end dates from the system
	doittDates = []
	dateList = doitt.objects.values('MO', 'YR').distinct().order_by('-YR', '-MO')
	for date in dateList:
		string = str(date['MO']) + '/1/' + str(date['YR'])
		parsed = dateutil.parser.parse(string).date()
		doittDates.append(parsed)

	#select a distinct list of end dates from the system
	blotterDates = []
	DD = datetime.timedelta(days=7)
	latestDate = blotter.objects.exclude(DateTime=None).latest('DateTime')
	earliestDate = blotter.objects.exclude(DateTime=None).earliest('DateTime')
	countDate = latestDate.DateTime
	while (earliestDate.DateTime < countDate):
		date = {}
		date['end_date'] = countDate
		date['start_date'] = countDate - DD
		blotterDates.append(date)
		countDate = countDate - DD 

	return render(request, 'crimemaps/linkiframebuilder.html', {'compstatDates': compstatDates, 'doittDates': doittDates, 'blotterDates': blotterDates})

def compstatPage(request):
	today = datetime.datetime.now()
	DD = datetime.timedelta(days=30)
	earlier = today - DD
	today_str = today.strftime("%x")
	earlier_str = earlier.strftime("%x")
	startDate = request.GET.get("startDate",earlier_str)
	endDate = request.GET.get("endDate",today_str)
	center = request.GET.get("center","")
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
	center = request.GET.get("center","")
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
	center = request.GET.get("center","")
	#ensure startDate and endDate are datetime objects
	startDate = dateutil.parser.parse(startDate).date()
	endDate = dateutil.parser.parse(endDate).date()

	#select a distinct list of end dates from the system
	dates = []
	latestDate = blotter.objects.exclude(DateTime=None).latest('DateTime')
	earliestDate = blotter.objects.exclude(DateTime=None).earliest('DateTime')
	countDate = latestDate.DateTime
	while (earliestDate.DateTime < countDate):
		date = {}
		date['end_date'] = countDate
		date['start_date'] = countDate - DD
		dates.append(date)
		countDate = countDate - DD 
	

	return render(request, 'crimemaps/blotter.html', {'startDate':startDate, 'endDate':endDate, 'center': center, 'dates':dates})



def compstatApi(request):
	response = {}
	if request.method == 'GET':
		startDate = request.GET.get("startDate","")
		endDate = request.GET.get("endDate","")
		# create data objects from start and end dates
		#startDateparsed = dateutil.parser.parse(startDate)
		#startDateobject = startDateparsed.date()
		endDateparsed = dateutil.parser.parse(endDate)
		endDateobject = endDateparsed.date()

		#this month start date
		fourWeeksAgoParsed = endDateparsed + relativedelta(weeks=-4, days=1)
		fourWeeksAgoObject = fourWeeksAgoParsed.date()

		#last month start date
		eightWeeksAgoParsed = endDateparsed + relativedelta(weeks=-8, days=1)
		eightWeeksAgoObject = eightWeeksAgoParsed.date()

		#last month end date
		fourWeeksAgoPlusOneDayParsed = endDateparsed + relativedelta(weeks=-4)
		fourWeeksAgoPlusOneDayObject = fourWeeksAgoPlusOneDayParsed.date()

		#pull compstat data
		thisMonthCompstats = compstat.objects.filter(start_date__gte=fourWeeksAgoObject, end_date__lte=endDateobject).values('precinct').annotate(Sum('murder'), Sum('rape'), Sum('robbery'), Sum('felony_assault'), Sum('burglary'), Sum('grand_larceny'), Sum('grand_larceny_auto'), Sum('total'))
		for stat in thisMonthCompstats:
			# add values for this month's compstats
			precinct = stat['precinct']
			response[precinct] = {}
			response[precinct]['start_date'] = fourWeeksAgoObject
			response[precinct]['end_date'] = endDateobject
			response[precinct]['murder'] = stat['murder__sum']
			response[precinct]['rape'] = stat['rape__sum']
			response[precinct]['robbery'] = stat['robbery__sum']
			response[precinct]['felony_assault'] = stat['felony_assault__sum']
			response[precinct]['burglary'] = stat['burglary__sum']
			response[precinct]['grand_larceny'] = stat['grand_larceny__sum']
			response[precinct]['grand_larceny_auto'] = stat['grand_larceny_auto__sum']
			response[precinct]['total'] = stat['total__sum']
			# show the previous month's compstats
			lastMonthCompstats = compstat.objects.filter(start_date__gte=eightWeeksAgoObject, end_date__lte=fourWeeksAgoPlusOneDayObject, precinct__exact=precinct).values('precinct').annotate(Sum('murder'), Sum('rape'), Sum('robbery'), Sum('felony_assault'), Sum('burglary'), Sum('grand_larceny'), Sum('grand_larceny_auto'), Sum('total'))
			for lastStat in lastMonthCompstats:
				response[precinct]['last_month_start_date'] = eightWeeksAgoObject
				response[precinct]['last_month_end_date'] = fourWeeksAgoPlusOneDayObject
				response[precinct]['last_month_murder'] = lastStat['murder__sum']
				response[precinct]['last_month_rape'] = lastStat['rape__sum']
				response[precinct]['last_month_robbery'] = lastStat['robbery__sum']
				response[precinct]['last_month_felony_assault'] = lastStat['felony_assault__sum']
				response[precinct]['last_month_burglary'] = lastStat['burglary__sum']
				response[precinct]['last_month_grand_larceny'] = lastStat['grand_larceny__sum']
				response[precinct]['last_month_grand_larceny_auto'] = lastStat['grand_larceny_auto__sum']
				response[precinct]['last_month_total'] = lastStat['total__sum']
				# calculate difference
				response[precinct]['diff_murder'] = int(stat['murder__sum']) - int(lastStat['murder__sum'])
				response[precinct]['diff_rape'] = int(stat['rape__sum']) - int(lastStat['rape__sum'])
				response[precinct]['diff_robbery'] = int(stat['robbery__sum']) - int(lastStat['robbery__sum'])
				response[precinct]['diff_felony_assault'] = int(stat['felony_assault__sum']) - int(lastStat['felony_assault__sum'])
				response[precinct]['diff_burglary'] = int(stat['burglary__sum']) - int(lastStat['burglary__sum'])
				response[precinct]['diff_grand_larceny'] = int(stat['grand_larceny__sum']) - int(lastStat['grand_larceny__sum'])
				response[precinct]['diff_grand_larceny_auto'] = int(stat['grand_larceny_auto__sum']) - int(lastStat['grand_larceny_auto__sum'])
				response[precinct]['diff_total'] = int(stat['total__sum']) - int(lastStat['total__sum'])

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
