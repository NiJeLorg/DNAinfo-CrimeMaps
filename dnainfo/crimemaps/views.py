from django.shortcuts import render, redirect
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.db.models import Sum, Count
import operator
from django.db.models import Q
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect


#import all crimemaps models and forms
from crimemaps.models import *
from crimemaps.forms import *

#for creating json objects
import json

# for date parsing
import datetime
from datetime import date
import dateutil.parser
from dateutil.relativedelta import relativedelta
from dateutil import rrule

#for timezone support
import pytz
from django.utils import timezone

#CSRF decorator
from django.views.decorators.csrf import ensure_csrf_cookie

# bitly API
import bitly_api


# views for DNAinfo crime maps
def index(request):
	return redirect('http://www.dnainfo.com/')

def workedFromHome(request):
	return render(request, 'crimemaps/workedFromHome.html', {})

def chiWorkedFromHome(request):
	return render(request, 'crimemaps/chiWorkedFromHome.html', {})

def transportToWork(request):
	return render(request, 'crimemaps/transportToWork.html', {})

def chiTransportToWork(request):
	return render(request, 'crimemaps/chiTransportToWork.html', {})

def linkiframebuilder(request):
	# time zone
	time_zone = pytz.timezone('America/New_York')

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
	now = timezone.now()
	if latestDate.DateTime > now:
		countDate = now
	else:
		countDate = latestDate.DateTime

	# ensure earliest date isn't something way off
	tenyearsago = now - datetime.timedelta(days=3650)
	if tenyearsago > earliestDate.DateTime:
		earliestDate.DateTime = tenyearsago

	while (earliestDate.DateTime < countDate):
		date = {}
		date['end_date'] = countDate
		date['start_date'] = countDate - DD
		blotterDates.append(date)
		countDate = countDate - DD 

	return render(request, 'crimemaps/linkiframebuilder.html', {'compstatDates': compstatDates, 'doittDates': doittDates, 'blotterDates': blotterDates})

def chilinkiframebuilder(request):
	return render(request, 'crimemaps/chilinkiframebuilder.html', {})

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
	# time zone
	time_zone = pytz.timezone('America/New_York')

	today = timezone.now()
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
	now = time_zone.localize(datetime.datetime.now())
	if latestDate.DateTime > now:
		countDate = today
	else:
		countDate = latestDate.DateTime

	# ensure earliest date isn't something way off
	tenyearsago = now - datetime.timedelta(days=3650)
	if tenyearsago > earliestDate.DateTime:
		earliestDate.DateTime = tenyearsago

	while (earliestDate.DateTime < countDate):
		date = {}
		date['end_date'] = countDate
		date['start_date'] = countDate - DD
		dates.append(date)
		countDate = countDate - DD 
	 
	return render(request, 'crimemaps/blotter.html', {'startDate':startDate, 'endDate':endDate, 'center': center, 'dates':dates})


def chiShootingsPage(request):
	#set up dates and times for initial filtering and for time slider set up
	today = datetime.datetime.now()
	sixMonthsAgo = today + relativedelta(months=-6)
	today_str = today.strftime("%x")
	sixMonthsAgo_str = sixMonthsAgo.strftime("%x")
	startDate = request.GET.get("startDate",sixMonthsAgo_str)
	endDate = request.GET.get("endDate",today_str)
	center = request.GET.get("center","")
	#ensure startDate and endDate are datetime objects
	startDate = dateutil.parser.parse(startDate).date()
	endDate = dateutil.parser.parse(endDate).date()

	# pull the earliest date for time slider
	earliestShooting = chiShootings.objects.earliest('Date')

	# get values for combo box
	districts = chiShootings.objects.values('District').distinct().order_by('District')
	communitynos = chiShootings.objects.values('CommunityNo', 'CommunityName').distinct().order_by('CommunityName')
	locations = chiShootings.objects.values('Location').distinct().order_by('Location')
	

	return render(request, 'crimemaps/chiShootings.html', {'startDate':startDate, 'endDate':endDate, 'center': center, 'earliestShooting':earliestShooting, 'districts':districts, 'communitynos':communitynos, 'locations': locations})




def compstatApi(request):
	response = {}
	if request.method == 'GET':
		startDate = request.GET.get("startDate","")
		endDate = request.GET.get("endDate","")
		# create data objects from start and end dates
		##### 6/17/15 #### Moved to using 28 day counts for compstat
		# Date range for first four weeks should be startDate to endDate
		startDateparsed = dateutil.parser.parse(startDate)
		startDateobject = startDateparsed.date()

		endDateparsed = dateutil.parser.parse(endDate)
		endDateobject = endDateparsed.date()

		#four weeks ago plus one day (for beginning date of first 28 day period)
		fourWeeksAgoPlusOneDayParsed = endDateparsed + relativedelta(weeks=-4, days=1)
		fourWeeksAgoPlusOneDayObject = fourWeeksAgoPlusOneDayParsed.date()

		#Date range for four weeks ago should be four weeks ago to five weeks ago
		#five weeks ago (start date)
		fiveWeeksAgoParsed = endDateparsed + relativedelta(weeks=-5, days=1)
		fiveWeeksAgoObject = fiveWeeksAgoParsed.date()

		#four weeks ago (end date)
		fourWeeksAgoParsed = endDateparsed + relativedelta(weeks=-4)
		fourWeeksAgoObject = fourWeeksAgoParsed.date()

		#eight weeks ago (beginning of previous period)
		eightWeeksAgoParsed = endDateparsed + relativedelta(weeks=-8, days=1)
		eightWeeksAgoObject = eightWeeksAgoParsed.date()

		# for missing value from precinct 9 check for start dates on 2015-04-20
		fourTwenty = datetime.date(2015, 4, 20)

		#pull compstat data
		thisMonthCompstats = compstat.objects.filter(start_date__gte=startDateobject, end_date__lte=endDateobject).values('precinct').annotate(Sum('murder'), Sum('rape'), Sum('robbery'), Sum('felony_assault'), Sum('burglary'), Sum('grand_larceny'), Sum('grand_larceny_auto'), Sum('total'))
		for stat in thisMonthCompstats:
			# add values for this month's compstats
			precinct = stat['precinct']
			# TEMPORARILY SKIP 9TH PRECINCT if either start date is on 2015-04-20
			if precinct == '009' and (startDateobject == fourTwenty or fiveWeeksAgoObject == fourTwenty):
				#do nothing
				nothingVar = 'nothing'
			else:
				response[precinct] = {}
				response[precinct]['start_date'] = fourWeeksAgoPlusOneDayObject
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
				lastMonthCompstats = compstat.objects.filter(start_date__gte=fiveWeeksAgoObject, end_date__lte=fourWeeksAgoObject, precinct__exact=precinct).values('precinct').annotate(Sum('murder'), Sum('rape'), Sum('robbery'), Sum('felony_assault'), Sum('burglary'), Sum('grand_larceny'), Sum('grand_larceny_auto'), Sum('total'))
				for lastStat in lastMonthCompstats:
					response[precinct]['last_month_start_date'] = eightWeeksAgoObject
					response[precinct]['last_month_end_date'] = fourWeeksAgoObject
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
	# time zone
	time_zone = pytz.timezone('America/New_York')
	#add in the items geojson requires 
	response = {}
	response['type'] = "FeatureCollection"
	response['features'] = []

	if request.method == 'GET':
		startDate = request.GET.get("startDate","")
		endDate = request.GET.get("endDate","")
		# create data objects from start and end dates
		startDateparsed = dateutil.parser.parse(startDate)
		startDateobject = time_zone.localize(startDateparsed)
		endDateparsed = dateutil.parser.parse(endDate)
		endDateobject = time_zone.localize(endDateparsed)

		#pull doitt data
		blotters = blotter.objects.filter(DateTime__range=[startDateobject,endDateobject])
		for stat in blotters:
			rawTime = stat.DateTime
			# parse dates into strings
			data = {}
			data['type'] = 'Feature'
			data['properties'] = {}
			data['properties']['Precinct'] = stat.Precinct
			data['properties']['Address'] = stat.Address
			data['properties']['DateTime'] = rawTime.astimezone(time_zone).replace(tzinfo=None)
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


def chiShootingsApi(request):
	# time zone
	time_zone = pytz.timezone('US/Central')
	#add in the items geojson requires 
	response = {}
	response['type'] = "FeatureCollection"
	response['features'] = []

	if request.method == 'GET':
		#gather potential filter variables
		startDate = request.GET.get("startDate","")
		endDate = request.GET.get("endDate","")
		district = request.GET.get("district","")
		beat = request.GET.get("beat","")
		location = request.GET.get("location","")
		neighborhood = request.GET.get("neighborhood","")
		communityno = request.GET.get("communityno","")
		communityname = request.GET.get("communityname","")
		mintotalvict = request.GET.get("mintotalvict","")
		maxtotalvict = request.GET.get("maxtotalvict","")
		minhomvics = request.GET.get("minhomvics","")
		maxhomvics = request.GET.get("maxhomvics","")
		month = request.GET.get("month","")
		year = request.GET.get("year","")
		hour = request.GET.get("hour","")
		dayofweek = request.GET.get("dayofweek","")
		policeinvolved = request.GET.get("policeinvolved","")


		# create data objects from start and end dates
		startDateparsed = time_zone.localize(dateutil.parser.parse(startDate))
		endDateparsed = time_zone.localize(dateutil.parser.parse(endDate))

		#add kwargs and hour query
		kwargs = {}
		# show date range selected
		kwargs['Date__range'] = [startDateparsed,endDateparsed]

		# add to kwargs if filters exist
		if district != '':
			districtArray = district.split(',')
			kwargs['District__in'] = districtArray

		if beat != '':
			beatArray = beat.split(',')
			kwargs['Beat__in'] = beatArray

		if location != '':
			locationArray = location.split(',')
			kwargs['Location__in'] = locationArray

		if neighborhood != '':
			neighborhoodArray = neighborhood.split(',')
			kwargs['Neighborhood__in'] = neighborhoodArray

		if communityno != '':
			communitynoArray = communityno.split(',')
			kwargs['CommunityNo__in'] = communitynoArray

		if communityname != '':
			communitynameArray = communityname.split(',')
			kwargs['CommunityName__in'] = communitynameArray

		if mintotalvict != '':
			kwargs['TotalVict__gte'] = mintotalvict

		if maxtotalvict != '':
			kwargs['TotalVict__lte'] = maxtotalvict

		if minhomvics != '':
			kwargs['HomVics__gte'] = minhomvics

		if maxhomvics != '':
			kwargs['HomVics__lte'] = maxhomvics

		if month != '':
			kwargs['Month__exact'] = month

		if year != '':
			kwargs['Year__exact'] = year

		if hour != '':
			hourArray = hour.split(',')
			kwargs['Hour__in'] = hourArray

		if dayofweek != '':
			kwargs['DayOfWeek__exact'] = dayofweek

		if policeinvolved != '':
			kwargs['PoliceInvolved__exact'] = policeinvolved


		#pull shootings data
		shootings = chiShootings.objects.filter(**kwargs)
		for shooting in shootings:
			rawTime = shooting.Date
			data = {}
			data['type'] = 'Feature'
			data['properties'] = {}
			data['properties']['Date'] = rawTime.astimezone(time_zone).replace(tzinfo=None)
			data['properties']['Address'] = shooting.Address
			data['properties']['RD'] = shooting.RD
			data['properties']['District'] = shooting.District
			data['properties']['Beat'] = shooting.Beat
			data['properties']['IUCR'] = shooting.IUCR
			data['properties']['Location'] = shooting.Location
			data['properties']['Status'] = shooting.Status
			data['properties']['Domestic'] = shooting.Domestic
			data['properties']['HomVics'] = shooting.HomVics
			data['properties']['OtherShoo'] = shooting.OtherShoo
			data['properties']['TotalVict'] = shooting.TotalVict
			data['properties']['Month'] = shooting.Month
			data['properties']['Day'] = shooting.Day
			data['properties']['Year'] = shooting.Year
			data['properties']['Hour'] = shooting.Hour
			data['properties']['DayOfWeek'] = shooting.DayOfWeek
			data['properties']['MonthYear'] = shooting.MonthYear
			data['properties']['URL'] = shooting.URL
			data['properties']['Notes'] = shooting.Notes
			data['properties']['Neighborhood'] = shooting.Neighborhood
			data['properties']['CommunityNo'] = shooting.CommunityNo
			data['properties']['CommunityName'] = shooting.CommunityName
			data['properties']['PoliceInvolved'] = shooting.PoliceInvolved
			data['geometry'] = {}
			data['geometry']['type'] = 'Point'
			data['geometry']['coordinates'] = [shooting.Long, shooting.Lat]
			response['features'].append(data)


	return JsonResponse(response)


def chiShootingsAggregateApi(request):
	# time zone
	time_zone = pytz.timezone('US/Central')
	#add in the items geojson requires 
	response = {}
	if request.method == 'GET':
		startDate = request.GET.get("startDate","")
		endDate = request.GET.get("endDate","")
		district = request.GET.get("district","")
		beat = request.GET.get("beat","")
		location = request.GET.get("location","")
		neighborhood = request.GET.get("neighborhood","")
		communityno = request.GET.get("communityno","")
		communityname = request.GET.get("communityname","")
		mintotalvict = request.GET.get("mintotalvict","")
		maxtotalvict = request.GET.get("maxtotalvict","")
		minhomvics = request.GET.get("minhomvics","")
		maxhomvics = request.GET.get("minhomvics","")
		month = request.GET.get("month","")
		year = request.GET.get("year","")
		hour = request.GET.get("hour","")
		dayofweek = request.GET.get("dayofweek","")
		policeinvolved = request.GET.get("policeinvolved","")

		#add kwargs
		kwargs = {}

		# add to kwargs if filters exist
		if district != '':
			districtArray = district.split(',')
			kwargs['District__in'] = districtArray

		if beat != '':
			beatArray = beat.split(',')
			kwargs['Beat__in'] = beatArray

		if location != '':
			locationArray = location.split(',')
			kwargs['Location__in'] = locationArray

		if neighborhood != '':
			neighborhoodArray = neighborhood.split(',')
			kwargs['Neighborhood__in'] = neighborhoodArray

		if communityno != '':
			communitynoArray = communityno.split(',')
			kwargs['CommunityNo__in'] = communitynoArray

		if communityname != '':
			communitynameArray = communityname.split(',')
			kwargs['CommunityName__in'] = communitynameArray

		if mintotalvict != '':
			kwargs['TotalVict__gte'] = mintotalvict

		if maxtotalvict != '':
			kwargs['TotalVict__lte'] = maxtotalvict

		if minhomvics != '':
			kwargs['HomVics__gte'] = minhomvics

		if maxhomvics != '':
			kwargs['HomVics__lte'] = maxhomvics

		if month != '':
			kwargs['Month__exact'] = month

		if year != '':
			kwargs['Year__exact'] = year

		if hour != '':
			hourArray = hour.split(',')
			kwargs['Hour__in'] = hourArray

		if dayofweek != '':
			kwargs['DayOfWeek__exact'] = dayofweek

		if policeinvolved != '':
			kwargs['PoliceInvolved__exact'] = policeinvolved

		#pull yearly shootings data
		#iterate thorugh years and push numbers to json
		# pull the earliest date for time slider
		earliestShooting = chiShootings.objects.earliest('Date')
		now = time_zone.localize(datetime.datetime.now())

		for dt in rrule.rrule(rrule.YEARLY, dtstart=earliestShooting.Date, until=now):
			Year = dt.strftime("%Y")
			kwargs['Year__exact'] = Year
			yearlyShootings = chiShootings.objects.filter(**kwargs).values('CommunityNo').annotate(num_shootings = Count('ID'), sum_homicide = Sum('HomVics'), sum_victims = Sum('TotalVict'))

			for stat in yearlyShootings:
				communityno = stat['CommunityNo']
				if communityno in response:
					response[communityno][Year] = {}
				else:
					response[communityno] = {}
					response[communityno][Year] = {}
				response[communityno][Year]['num_shootings'] = stat['num_shootings']
				response[communityno][Year]['sum_homicide'] = stat['sum_homicide']
				response[communityno][Year]['sum_victims'] = stat['sum_victims']

		# remove years from kwargs
		#kwargs.pop("Year__exact", None)

		# add in monthly data for previous 6 months
		firstDaysixMonthsAgo = now + relativedelta(day=1, months=-6)
		for dt in rrule.rrule(rrule.MONTHLY, dtstart=firstDaysixMonthsAgo, until=now):
			Month = int(dt.strftime("%m"))
			Year = dt.strftime("%Y")
			kwargs['Month__exact'] = Month
			kwargs['Year__exact'] = Year

			monthlyShootings = chiShootings.objects.filter(**kwargs).values('CommunityNo').annotate(num_shootings = Count('ID'), sum_homicide = Sum('HomVics'), sum_victims = Sum('TotalVict'))

			for stat in monthlyShootings:
				communityno = stat['CommunityNo']
				if communityno in response:
					response[communityno][Month] = {}
					response[communityno][Month][Year] = {}
				else:
					response[communityno] = {}
					response[communityno][Month] = {}
					response[communityno][Month][Year] = {}
				response[communityno][Month][Year]['num_shootings'] = stat['num_shootings']
				response[communityno][Month][Year]['sum_homicide'] = stat['sum_homicide']
				response[communityno][Month][Year]['sum_victims'] = stat['sum_victims']



	return JsonResponse(response)



def chiShootingsCitywideAggregateApi(request):
	# time zone
	time_zone = pytz.timezone('US/Central')
	#add in the items geojson requires 
	response = {}
	if request.method == 'GET':
		startDate = request.GET.get("startDate","")
		endDate = request.GET.get("endDate","")
		district = request.GET.get("district","")
		beat = request.GET.get("beat","")
		location = request.GET.get("location","")
		neighborhood = request.GET.get("neighborhood","")
		communityno = request.GET.get("communityno","")
		communityname = request.GET.get("communityname","")
		mintotalvict = request.GET.get("mintotalvict","")
		maxtotalvict = request.GET.get("maxtotalvict","")
		minhomvics = request.GET.get("minhomvics","")
		maxhomvics = request.GET.get("minhomvics","")
		month = request.GET.get("month","")
		year = request.GET.get("year","")
		hour = request.GET.get("hour","")
		dayofweek = request.GET.get("dayofweek","")
		policeinvolved = request.GET.get("policeinvolved","")

		#add kwargs
		kwargs = {}

		# add to kwargs if filters exist
		if district != '':
			districtArray = district.split(',')
			kwargs['District__in'] = districtArray

		if beat != '':
			beatArray = beat.split(',')
			kwargs['Beat__in'] = beatArray

		if location != '':
			locationArray = location.split(',')
			kwargs['Location__in'] = locationArray

		if neighborhood != '':
			neighborhoodArray = neighborhood.split(',')
			kwargs['Neighborhood__in'] = neighborhoodArray

		if communityno != '':
			communitynoArray = communityno.split(',')
			kwargs['CommunityNo__in'] = communitynoArray

		if communityname != '':
			communitynameArray = communityname.split(',')
			kwargs['CommunityName__in'] = communitynameArray

		if mintotalvict != '':
			kwargs['TotalVict__gte'] = mintotalvict

		if maxtotalvict != '':
			kwargs['TotalVict__lte'] = maxtotalvict

		if minhomvics != '':
			kwargs['HomVics__gte'] = minhomvics

		if maxhomvics != '':
			kwargs['HomVics__lte'] = maxhomvics

		if month != '':
			kwargs['Month__exact'] = month

		if year != '':
			kwargs['Year__exact'] = year

		if hour != '':
			hourArray = hour.split(',')
			kwargs['Hour__in'] = hourArray

		if dayofweek != '':
			kwargs['DayOfWeek__exact'] = dayofweek

		if policeinvolved != '':
			kwargs['PoliceInvolved__exact'] = policeinvolved

		#pull yearly shootings data
		#iterate thorugh years and push numbers to json
		# pull the earliest date for time slider
		earliestShooting = chiShootings.objects.earliest('Date')
		now = time_zone.localize(datetime.datetime.now())

		for dt in rrule.rrule(rrule.YEARLY, dtstart=earliestShooting.Date, until=now):
			Year = dt.strftime("%Y")
			kwargs['Year__exact'] = Year
			yearlyShootings = chiShootings.objects.filter(**kwargs).aggregate(num_shootings = Count('ID'), sum_homicide = Sum('HomVics'), sum_victims = Sum('TotalVict'))

			response[Year] = {}
			response[Year]['num_shootings'] = yearlyShootings['num_shootings']
			response[Year]['sum_homicide'] = yearlyShootings['sum_homicide']
			response[Year]['sum_victims'] = yearlyShootings['sum_victims']

		# remove years from kwargs
		#kwargs.pop("Year__exact", None)

		# add in monthly data for previous 6 months
		firstDaysixMonthsAgo = now + relativedelta(day=1, months=-6)
		for dt in rrule.rrule(rrule.MONTHLY, dtstart=firstDaysixMonthsAgo, until=now):
			Month = int(dt.strftime("%m"))
			Year = dt.strftime("%Y")
			kwargs['Month__exact'] = Month
			kwargs['Year__exact'] = Year

			monthlyShootings = chiShootings.objects.filter(**kwargs).aggregate(num_shootings = Count('ID'), sum_homicide = Sum('HomVics'), sum_victims = Sum('TotalVict'))

			response[Month] = {}
			response[Month][Year] = {}
			response[Month][Year]['num_shootings'] = monthlyShootings['num_shootings']
			response[Month][Year]['sum_homicide'] = monthlyShootings['sum_homicide']
			response[Month][Year]['sum_victims'] = monthlyShootings['sum_victims']



	return JsonResponse(response)


def nycfireworks2010to2014(request):
	return render(request, 'crimemaps/nycfireworks2010to2014.html', {})

def nycfireworks2015(request):
	return render(request, 'crimemaps/nycfireworks2015.html', {})

def nycfireworks2010to2014citywide(request):
	return render(request, 'crimemaps/nycfireworks2010to2014citywide.html', {})

def nycfireworks2015citywide(request):
	return render(request, 'crimemaps/nycfireworks2015citywide.html', {})

def nycfireworks2010to2014torque(request):
	return render(request, 'crimemaps/nycfireworks2010to2014torque.html', {})

def nycfireworks2015torque(request):
	return render(request, 'crimemaps/nycfireworks2015torque.html', {})

def nycfireworks2010to2014citywidetorque(request):
	return render(request, 'crimemaps/nycfireworks2010to2014citywidetorque.html', {})

def nycfireworks2015citywidetorque(request):
	return render(request, 'crimemaps/nycfireworks2015citywidetorque.html', {})

def nycneigh(request, id=None):
	if id:
		neighborhoodDrawObject = neighborhoodDrawNYC.objects.get(pk=id)
	else:
		neighborhoodDrawObject = neighborhoodDrawNYC()

	# A HTTP POST?
	if request.method == 'POST':
		form = nycNeighDrawForm(request.POST, instance=neighborhoodDrawObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = neighborhoodDrawNYC.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('nycneighdraw', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = nycNeighDrawForm(instance=neighborhoodDrawObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'crimemaps/nycneigh.html', {'form':form})


@ensure_csrf_cookie
def nycneighdraw(request, id=None):
	neighborhoodDrawObject = neighborhoodDrawNYC.objects.get(pk=id)

	return render(request, 'crimemaps/nycneighdraw.html', {'neighborhoodDrawObject': neighborhoodDrawObject, 'id':id})


def nycneighdrawsave(request, id=None):

	# A HTTP POST?
	if request.method == 'POST':
		# update record with geojson
		neighborhoodDrawNYC.objects.filter(pk=id).update(drawnGeojson=request.POST['geojson'])
		empty = {}
	else:
		empty = {}

	# Bad form (or form details), no form supplied...
	return JsonResponse(request.POST)


def nycneighshow(request, id=None):
	neighborhoodDrawObject = neighborhoodDrawNYC.objects.get(pk=id)

	neighborhoodDrawObjectForm = neighborhoodDrawNYC()
	form = nycNeighDrawForm(instance=neighborhoodDrawObjectForm)

	return render(request, 'crimemaps/nycneighshow.html', {'neighborhoodDrawObject': neighborhoodDrawObject, 'id':id, 'form':form})

def allnycpolygons(request):

	return render(request, 'crimemaps/allnycpolygons.html', {})


def getnycdrawngeojson(request, id=None):

	neighborhoodDrawObject = neighborhoodDrawNYC.objects.get(pk=id)

	return JsonResponse(neighborhoodDrawObject.drawnGeojson, safe=False)


def getALLnycdrawngeojson(request, neighborhoodLive=None, id=None):
	neighborhood = neighborhoodNYC.objects.get(dnaurl=neighborhoodLive)

	allDrawnNeighborhoods = neighborhoodDrawNYC.objects.filter(neighborhoodLive=neighborhood, approved=True).exclude(id=id)[:100]
	geojsons = []
	for drawn in allDrawnNeighborhoods:
		geojsons.append(drawn.drawnGeojson) 

	return JsonResponse(geojsons, safe=False)


def getALLnycdrawngeojsonIDS(request, neighborhoodLive=None, id=None):
	neighborhood = neighborhoodNYC.objects.get(dnaurl=neighborhoodLive)

	allDrawnNeighborhoods = neighborhoodDrawNYC.objects.filter(neighborhoodLive=neighborhood, approved=True).exclude(id=id)[:100]
	ids = []
	for drawn in allDrawnNeighborhoods:
		ids.append(drawn.id) 

	return JsonResponse(ids, safe=False)


def allnycpolygons(request):

	return render(request, 'crimemaps/allnycpolygons.html', {})

def allnycgeojsons(request):

	#allDrawnNeighborhoods = neighborhoodDrawNYC.objects.all()
	allDrawnNeighborhoods = neighborhoodDrawNYC.objects.filter(id__gte=28001, id__lte=29000)
	geojsons = []
	for drawn in allDrawnNeighborhoods:
		changed = drawn.drawnGeojson.replace('\"properties\":{}', '\"properties\":{\"ID\":\"'+ str(drawn.id) +'\", \"neighborhoodLive\":\"'+ str(drawn.neighborhoodLive.name) +'\", \"otherNeighborhood\":\"' + strip_non_ascii(drawn.otherNeighborhood) +'\"}')
		geojsons.append(changed) 

	return JsonResponse(geojsons, safe=False)

def nycpolygonsbyneigh(request, neighborhoodLive=None):

	return render(request, 'crimemaps/nycpolygonsbyneigh.html', {'neighborhoodLive': neighborhoodLive})

def nycgeojsonsbyneigh(request, neighborhoodLive=None):
	neighborhood = neighborhoodNYC.objects.get(dnaurl=neighborhoodLive)

	allDrawnNeighborhoods = neighborhoodDrawNYC.objects.filter(neighborhoodLive=neighborhood, approved=True).exclude(drawnGeojson='')
	geojsons = []
	for drawn in allDrawnNeighborhoods:
		changed = drawn.drawnGeojson.replace('\"properties\":{}', '\"properties\":{\"ID\":\"'+ str(drawn.id) +'\", \"approved\":\"'+ str(drawn.approved) +'\", \"neighborhoodLive\":\"'+ str(drawn.neighborhoodLive.name) +'\", \"otherNeighborhood\":\"' + strip_non_ascii(drawn.otherNeighborhood) +'\", \"yearsLived\":\"' + str(drawn.yearsLived) +'\"}')
		geojsons.append(changed) 

	return JsonResponse(geojsons, safe=False)

def removenycdrawngeojsonbyid(request, id=None):

	removeGeojson = neighborhoodDrawNYC.objects.filter(id=id).delete()

	removed = {"removed": id}

	return JsonResponse(removed, safe=False)


def chineigh(request, id=None):
	if id:
		neighborhoodDrawObject = neighborhoodDrawCHI.objects.get(pk=id)
	else:
		neighborhoodDrawObject = neighborhoodDrawCHI()

	# A HTTP POST?
	if request.method == 'POST':
		form = chiNeighDrawForm(request.POST, instance=neighborhoodDrawObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = neighborhoodDrawCHI.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('chineighdraw', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = chiNeighDrawForm(instance=neighborhoodDrawObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'crimemaps/chineigh.html', {'form':form})


@ensure_csrf_cookie
def chineighdraw(request, id=None):
	neighborhoodDrawObject = neighborhoodDrawCHI.objects.get(pk=id)

	return render(request, 'crimemaps/chineighdraw.html', {'neighborhoodDrawObject': neighborhoodDrawObject, 'id':id})


def chineighdrawsave(request, id=None):

	# A HTTP POST?
	if request.method == 'POST':
		# update record with geojson
		neighborhoodDrawCHI.objects.filter(pk=id).update(drawnGeojson=request.POST['geojson'])
		empty = {}
	else:
		empty = {}

	# Bad form (or form details), no form supplied...
	return JsonResponse(request.POST)


def chineighshow(request, id=None):
	neighborhoodDrawObject = neighborhoodDrawCHI.objects.get(pk=id)

	neighborhoodDrawObjectForm = neighborhoodDrawCHI()
	form = chiNeighDrawForm(instance=neighborhoodDrawObjectForm)

	return render(request, 'crimemaps/chineighshow.html', {'neighborhoodDrawObject': neighborhoodDrawObject, 'id':id, 'form':form})


def getchidrawngeojson(request, id=None):

	neighborhoodDrawObject = neighborhoodDrawCHI.objects.get(pk=id)

	return JsonResponse(neighborhoodDrawObject.drawnGeojson, safe=False)


def getALLchidrawngeojson(request, neighborhoodLive=None, id=None):
	neighborhood = neighborhoodCHI.objects.get(dnaurl=neighborhoodLive)

	allDrawnNeighborhoods = neighborhoodDrawCHI.objects.filter(neighborhoodLive=neighborhood, approved=True).exclude(id=id)[:100]
	geojsons = []
	for drawn in allDrawnNeighborhoods:
		geojsons.append(drawn.drawnGeojson) 

	return JsonResponse(geojsons, safe=False)


def getALLchidrawngeojsonIDS(request, neighborhoodLive=None, id=None):
	neighborhood = neighborhoodCHI.objects.get(dnaurl=neighborhoodLive)

	allDrawnNeighborhoods = neighborhoodDrawCHI.objects.filter(neighborhoodLive=neighborhood, approved=True).exclude(id=id)[:100]
	ids = []
	for drawn in allDrawnNeighborhoods:
		ids.append(drawn.id) 

	return JsonResponse(ids, safe=False)


def allchipolygons(request):

	return render(request, 'crimemaps/allchipolygons.html', {})

def allchigeojsons(request):

	allDrawnNeighborhoods = neighborhoodDrawCHI.objects.all()
	geojsons = []
	for drawn in allDrawnNeighborhoods:
		changed = drawn.drawnGeojson.replace('\"properties\":{}', '\"properties\":{\"ID\":\"'+ str(drawn.id) +'\", \"neighborhoodLive\":\"'+ str(drawn.neighborhoodLive.name) +'\", \"otherNeighborhood\":\"' + strip_non_ascii(drawn.otherNeighborhood) +'\"}')
		geojsons.append(changed) 

	return JsonResponse(geojsons, safe=False)

def chipolygonsbyneigh(request, neighborhoodLive=None):

	return render(request, 'crimemaps/chipolygonsbyneigh.html', {'neighborhoodLive': neighborhoodLive})

def chigeojsonsbyneigh(request, neighborhoodLive=None):
	neighborhood = neighborhoodCHI.objects.get(dnaurl=neighborhoodLive)

	allDrawnNeighborhoods = neighborhoodDrawCHI.objects.filter(neighborhoodLive=neighborhood, approved=True).exclude(drawnGeojson='')
	geojsons = []
	for drawn in allDrawnNeighborhoods:
		changed = drawn.drawnGeojson.replace('\"properties\":{}', '\"properties\":{\"ID\":\"'+ str(drawn.id) +'\", \"approved\":\"'+ str(drawn.approved) +'\", \"neighborhoodLive\":\"'+ str(drawn.neighborhoodLive.name) +'\", \"otherNeighborhood\":\"' + strip_non_ascii(drawn.otherNeighborhood) +'\", \"yearsLived\":\"' + str(drawn.yearsLived) +'\"}')
		geojsons.append(changed) 

	return JsonResponse(geojsons, safe=False)


def removechidrawngeojsonbyid(request, id=None):

	removeGeojson = neighborhoodDrawCHI.objects.filter(id=id).delete()

	removed = {"removed": id}

	return JsonResponse(removed, safe=False)


def strip_non_ascii(string):
	''' Returns the string without non ASCII characters'''
	stripped = (c for c in string if ord(c) == 32 or 48 <= ord(c) <= 57 or 65 <= ord(c) <= 90  or 97 <= ord(c) <= 122)
	return ''.join(stripped)


def nycneighview(request, neighborhoodID=None):
	STATIC_URL = settings.STATIC_URL

	neighborhoodDrawObject = neighborhoodDrawNYC()

	if neighborhoodID:
		neighborhood = neighborhoodNYC.objects.get(pk=neighborhoodID)
	else:
		neighborhood = neighborhoodNYC.objects.get(dnaurl='park-slope')

	# get count of approved geojsons drawn
	countDrawnNeighborhoods = neighborhoodDrawNYC.objects.filter(neighborhoodLive=neighborhood).exclude(drawnGeojson='').count()

	# A HTTP POST?
	if request.method == 'POST':
		form = nycNeighViewForm(request.POST, instance=neighborhoodDrawObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			neighborhoodID = request.POST['neighborhoodLive']
			return HttpResponseRedirect(reverse('nycneighview', args=(neighborhoodID,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = nycNeighViewForm(instance=neighborhoodDrawObject)


	return render(request, 'crimemaps/nycneighview.html', {'neighborhood': neighborhood, 'STATIC_URL': STATIC_URL, 'form': form, 'countDrawnNeighborhoods': countDrawnNeighborhoods})


def chineighview(request, neighborhoodID=None):
	STATIC_URL = settings.STATIC_URL

	neighborhoodDrawObject = neighborhoodDrawCHI()

	if neighborhoodID:
		neighborhood = neighborhoodCHI.objects.get(pk=neighborhoodID)
	else:
		neighborhood = neighborhoodCHI.objects.get(dnaurl='wrigleyville')

	# get count of approved geojsons drawn
	countDrawnNeighborhoods = neighborhoodDrawCHI.objects.filter(neighborhoodLive=neighborhood).exclude(drawnGeojson='').count()

	# A HTTP POST?
	if request.method == 'POST':
		form = chiNeighViewForm(request.POST, instance=neighborhoodDrawObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			neighborhoodID = request.POST['neighborhoodLive']
			return HttpResponseRedirect(reverse('chineighview', args=(neighborhoodID,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = chiNeighViewForm(instance=neighborhoodDrawObject)


	return render(request, 'crimemaps/chineighview.html', {'neighborhood': neighborhood, 'STATIC_URL': STATIC_URL, 'form': form, 'countDrawnNeighborhoods': countDrawnNeighborhoods})


def chizillowzip(request):
	quarter = request.GET.get("quarter","")
	if quarter:
		#ensure date is a datetime object
		# quarter is of the for MMM-MMM YYYY
		quarter = quarter.split("-")
		quarteryear = quarter[1].split(" ")
		#using the first month create a date object that uses the first day of the quarter 
		quarter = quarter[0] + ' 1, ' + quarteryear[1]
		quarter = dateutil.parser.parse(quarter).date()
	else:
		quarter = datetime.datetime.now().date()

	return render(request, 'crimemaps/chizillowzip.html', {'quarter':quarter})


def chizillowzipapi(request):
	#add in the items geojson requires 
	response = {}

	if request.method == 'GET':
		#gather potential filter variables
		quarter = request.GET.get("quarter","")

		# create data objects from start and end dates
		quarterparsed = dateutil.parser.parse(quarter).date()

		#add kwargs and hour query
		kwargs = {}
		# show date range selected
		kwargs['quarter__exact'] = quarterparsed

		#pull shootings data
		datas = CHIZIPZillowData.objects.filter(**kwargs)
		for data in datas:
			zip = data.zip
			response[zip] = {}
			response[zip]['quarter'] = quarterparsed
			response[zip]['neighborhoodscovered'] = data.neighborhoodscovered
			response[zip]['population2013censusestimate'] = data.population2013censusestimate
			response[zip]['percentlivinginsamehouseoneyearago2013censusestimate'] = data.percentlivinginsamehouseoneyearago2013censusestimate
			response[zip]['medianhouseholdincome2013censusestimate'] = data.medianhouseholdincome2013censusestimate
			response[zip]['changeinvaluesquarefootoverpreviousyear'] = data.changeinvaluesquarefootoverpreviousyear
			response[zip]['changeavgrentsqfootoverpreviousyear'] = data.changeavgrentsqfootoverpreviousyear
			response[zip]['percentofhomessoldinpastyear'] = data.percentofhomessoldinpastyear
			response[zip]['estimatedvaluesquarefoot'] = data.estimatedvaluesquarefoot
			response[zip]['estimatedvalueofallhomes'] = data.estimatedvalueofallhomes
			response[zip]['avgrentsqfoot'] = data.avgrentsqfoot
			response[zip]['medianlistprice'] = data.medianlistprice
			response[zip]['mediansaleprice'] = data.mediansaleprice

	return JsonResponse(response)


def chicookcounty(request):
	#form of monthYear is Jan-2015
	monthYearGet = request.GET.get("monthYear","")
	if monthYearGet:
		#ensure date is a datetime object
		monthYear = monthYearGet
	else:
		monthYear = datetime.datetime.now()
		monthYear = monthYear.strftime("%b-%Y")


	june2015 = datetime.datetime(2015, 6, 1)
	now = datetime.datetime.now()	

	# get array of dates for combo box creation
	dates = []
	for dt in rrule.rrule(rrule.MONTHLY, dtstart=june2015, until=now):
		my = (dt.strftime("%b-%Y"), dt.strftime("%b %Y"))
		dates.append(my)

	dates = reversed(dates)
		
	return render(request, 'crimemaps/chicookcounty.html', {'monthYear':monthYear, 'dates':dates})


def chicookcountyapi(request):
	#add in the items geojson requires 
	response = {}
	response['type'] = "FeatureCollection"
	response['features'] = []

	if request.method == 'GET':
		#gather potential filter variables
		monthYearGet = request.GET.get("monthYear","")
		minamount = request.GET.get("minamount","")
		maxamount = request.GET.get("maxamount","")
		commercial = request.GET.get("commercial","")
		industrial = request.GET.get("industrial","")
		other = request.GET.get("other","")
		residential_condo = request.GET.get("residential_condo","")
		residential_multifamily = request.GET.get("residential_multifamily","")
		residential_single_family = request.GET.get("residential_single_family","")
		vacant = request.GET.get("vacant","")


		# create data objects from month dates
		monthYearArray = monthYearGet.split("-")
		startDate = monthYearArray[0] + ' 1, ' + monthYearArray[1]
		startDateparsed = dateutil.parser.parse(startDate).date()
		endDateparsed = startDateparsed + relativedelta(days=-1, months=1)

		#get empty Qs ready
		query = Q()
		executed_query = Q()
		amount_query = Q()
		minamount_query = Q()
		maxamount_query = Q()
		commercial_query = Q()
		industrial_query = Q()
		other_query = Q()
		residential_condo_query = Q()
		residential_multifamily_query = Q()
		residential_single_family_query = Q()
		vacant_query = Q()

		# show date range selected
		executed_query = Q(executed__range = [startDateparsed,endDateparsed])

		# add to kwargs if filters exist
		if minamount != '':
			minamount_query = Q(amount__gte = minamount)

		if maxamount != '':
			maxamount_query = Q(amount__lte = maxamount)

		amount_query = minamount_query & maxamount_query

		#for classes, split string and search for any that match
		if commercial == 'true':
			commercial_query = Q(classNum__contains = '2-01') | Q(classNum__contains = '7-') | Q(classNum__contains = '8-') | Q(classNum__contains = '5-17') | Q(classNum__contains = '5-22') | Q(classNum__contains = '5-23') | Q(classNum__contains = '5-29') | Q(classNum__contains = '5-30') | Q(classNum__contains = '5-31') | Q(classNum__contains = '5-90') | Q(classNum__contains = '5-91') | Q(classNum__contains = '5-92') | Q(classNum__contains = '5-97') | Q(classNum__contains = '5-99')

		if industrial == 'true':
			industrial_query = Q(classNum__contains = '6-') | Q(classNum__contains = '5-50') | Q(classNum__contains = '5-80') | Q(classNum__contains = '5-81') | Q(classNum__contains = '5-83') | Q(classNum__contains = '5-87') | Q(classNum__contains = '5-89') | Q(classNum__contains = '5-93')

		if other == 'true':
			other_query = Q(classNum__contains = '0-00') | Q(classNum__contains = '2-24') | Q(classNum__contains = '2-36') | Q(classNum__contains = '2-90') | Q(classNum__contains = '2-97') | Q(classNum__contains = '4-') | Q(classNum__contains = 'Ex') | Q(classNum__contains = 'RR')

		if residential_condo == 'true':
			residential_condo_query = Q(classNum__contains = '2-99')

		if residential_multifamily == 'true':
			residential_multifamily_query = Q(classNum__contains = '2-11') | Q(classNum__contains = '2-12') | Q(classNum__contains = '2-13') | Q(classNum__contains = '2-25') | Q(classNum__contains = '3-13') | Q(classNum__contains = '3-14') | Q(classNum__contains = '3-15') | Q(classNum__contains = '3-18') | Q(classNum__contains = '3-90') | Q(classNum__contains = '3-96') | Q(classNum__contains = '3-97') | Q(classNum__contains = '3-99') | Q(classNum__contains = '9-')

		if residential_single_family == 'true':
			residential_single_family_query = Q(classNum__contains = '2-02') | Q(classNum__contains = '2-03') | Q(classNum__contains = '2-04') | Q(classNum__contains = '2-05') | Q(classNum__contains = '2-06') | Q(classNum__contains = '2-07') | Q(classNum__contains = '2-08') | Q(classNum__contains = '2-09') | Q(classNum__contains = '2-10') | Q(classNum__contains = '2-34') | Q(classNum__contains = '2-78') | Q(classNum__contains = '2-88') | Q(classNum__contains = '2-95')

		if vacant == 'true':
			vacant_query = Q(classNum__contains = '1-00') | Q(classNum__contains = '1-09') | Q(classNum__contains = '2-00') | Q(classNum__contains = '2-39') | Q(classNum__contains = '2-40') | Q(classNum__contains = '2-41') | Q(classNum__contains = '3-00') | Q(classNum__contains = '3-01') | Q(classNum__contains = '5-80') | Q(classNum__contains = '5-90')

		# if any types are selected use in query -- if not ensure none are selected
		if commercial == 'true' or industrial == 'true' or other == 'true' or residential_condo == 'true' or residential_multifamily == 'true' or residential_single_family == 'true' or vacant == 'true':
			query = executed_query & amount_query & (commercial_query | industrial_query | other_query | residential_condo_query | residential_multifamily_query | residential_single_family_query | vacant_query)
		else:
			# no data will be returned with primary key = -99
			query = Q(pk__exact=-99)

		#pull data
		datas = CHICookCountyRealEstateData.objects.filter(query)
		for d in datas:
			data = {}
			data['type'] = 'Feature'
			data['properties'] = {}
			data['properties']['doc'] = d.doc
			data['properties']['classNum'] = d.classNum
			data['properties']['description'] = d.description
			data['properties']['buildingsize'] = d.buildingsize
			data['properties']['lotsize'] = d.lotsize
			data['properties']['fulladdress'] = d.fulladdress
			data['properties']['amount'] = d.amount
			data['properties']['recorded'] = d.recorded
			data['properties']['executed'] = d.executed
			data['properties']['seller'] = d.seller
			data['properties']['buyer'] = d.buyer
			data['properties']['pin'] = d.pin
			data['properties']['address'] = d.address
			data['properties']['unit'] = d.unit
			data['properties']['pricepersqft'] = d.pricepersqft
			data['geometry'] = {}
			data['geometry']['type'] = 'Point'
			data['geometry']['coordinates'] = [d.longitude, d.latitude]
			response['features'].append(data)


	return JsonResponse(response)


def nycstreeteasy(request):
	dateperiod = request.GET.get("dateperiod","")
	if dateperiod:
		#ensure date is a datetime object
		# dateperiod is of the for MMM-MMM YYYY
		dateperiod = dateperiod.split("-")
		dateperiodyear = dateperiod[1].split(" ")
		#using the first month create a date object that uses the first day of the quarter 
		dateperiod = dateperiod[0] + ' 1, ' + dateperiodyear[1]
		dateperiod = dateutil.parser.parse(dateperiod).date()
	else:
		dateperiod = datetime.datetime.now().date()


	return render(request, 'crimemaps/nycstreeteasy.html', {'dateperiod':dateperiod})


def nycstreeteasyapi(request):
	#add in the items geojson requires 
	response = {}

	if request.method == 'GET':
		#gather potential filter variables
		dateperiod = request.GET.get("dateperiod","")

		# create data objects from start and end dates
		dateperiodparsed = dateutil.parser.parse(dateperiod).date()

		#add kwargs and hour query
		kwargs = {}
		# show date range selected
		kwargs['dateperiod__exact'] = dateperiodparsed

		#pull shootings data
		datas = NYCStreetEasyRealEstateData.objects.filter(**kwargs)
		for data in datas:
			area = data.area
			response[area] = {}
			response[area]['dateperiod'] = dateperiodparsed
			response[area]['medianaskingrent'] = data.medianaskingrent
			response[area]['medianaskingrentchcange'] = data.medianaskingrentchcange

	return JsonResponse(response)


def traindemo(request):
	return render(request, 'crimemaps/traindemo.html', {})

def traindemo_half_full(request):
	return render(request, 'crimemaps/traindemo_half_full.html', {})

def traindemo_full(request):
	return render(request, 'crimemaps/traindemo_full.html', {})

def chi_l_line(request, id=None):
	if id:
		CHItrainSitStandObject = CHItrainSitStand.objects.get(pk=id)
	else:
		CHItrainSitStandObject = CHItrainSitStand()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHITrainLineForm(request.POST, instance=CHItrainSitStandObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHItrainSitStand.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('chi_l_arrived', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHITrainLineForm(instance=CHItrainSitStandObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'crimemaps/chi_l_line.html', {'form':form, 'CHItrainSitStandObject': CHItrainSitStandObject})

def chi_l_arrived(request, id=None):
	if id:
		CHItrainSitStandObject = CHItrainSitStand.objects.get(pk=id)
	else:
		CHItrainSitStandObject = CHItrainSitStand()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHITrainTimeForm(request.POST, instance=CHItrainSitStandObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHItrainSitStand.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('chi_l_length', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHITrainTimeForm(instance=CHItrainSitStandObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'crimemaps/chi_l_arrived.html', {'form':form, 'CHItrainSitStandObject': CHItrainSitStandObject})


def chi_l_length(request, id=None):
	if id:
		CHItrainSitStandObject = CHItrainSitStand.objects.get(pk=id)
		if CHItrainSitStandObject.train == "Yellow Line":
			return HttpResponseRedirect(reverse('chi_l_empty_car', args=(CHItrainSitStandObject.pk,)))
	else:
		CHItrainSitStandObject = CHItrainSitStand()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHITrainLengthForm(request.POST, instance=CHItrainSitStandObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHItrainSitStand.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('chi_l_empty_car', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHITrainLengthForm(instance=CHItrainSitStandObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'crimemaps/chi_l_length.html', {'form':form, 'CHItrainSitStandObject': CHItrainSitStandObject})


def chi_l_empty_car(request, id=None):
	if id:
		CHItrainSitStandObject = CHItrainSitStand.objects.get(pk=id)
	else:
		CHItrainSitStandObject = CHItrainSitStand()

	# A HTTP POST?
	if request.method == 'POST':
		form = CHITrainEmptyTrainForm(request.POST, instance=CHItrainSitStandObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHItrainSitStand.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('chi_l_half_full_car', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHITrainEmptyTrainForm(instance=CHItrainSitStandObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'crimemaps/chi_l_empty_car.html', {'form':form, 'CHItrainSitStandObject': CHItrainSitStandObject})


def chi_l_half_full_car(request, id=None):
	if id:
		CHItrainSitStandObject = CHItrainSitStand.objects.get(pk=id)
		positionOneType = CHItrainSitStandObject.positionOneType
	else:
		CHItrainSitStandObject = CHItrainSitStand()
		positionOneType = ''

	# A HTTP POST?
	if request.method == 'POST':
		form = CHITrainHalfFullTrainForm(request.POST, instance=CHItrainSitStandObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHItrainSitStand.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('chi_l_full_car', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHITrainHalfFullTrainForm(instance=CHItrainSitStandObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'crimemaps/chi_l_half_full_car.html', {'form':form, 'positionOneType': positionOneType, 'CHItrainSitStandObject': CHItrainSitStandObject})

def chi_l_full_car(request, id=None):
	if id:
		CHItrainSitStandObject = CHItrainSitStand.objects.get(pk=id)
		positionOne = CHItrainSitStandObject.positionOne
		positionTwo = CHItrainSitStandObject.positionTwo
	else:
		CHItrainSitStandObject = CHItrainSitStand()
		positionOne = ''
		positionTwo = ''


	# A HTTP POST?
	if request.method == 'POST':
		form = CHITrainFullTrainForm(request.POST, instance=CHItrainSitStandObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = CHItrainSitStand.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('chi_l_end', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = CHITrainFullTrainForm(instance=CHItrainSitStandObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'crimemaps/chi_l_full_car.html', {'form':form, 'positionOne': positionOne, 'positionTwo': positionTwo, 'CHItrainSitStandObject': CHItrainSitStandObject})

def chi_l_calculating(request, id=None):
	if id:
		CHItrainSitStandObject = CHItrainSitStand.objects.get(pk=id)
	else:
		CHItrainSitStandObject = CHItrainSitStand()

	return render(request, 'crimemaps/chi_l_calculating.html', {'CHItrainSitStandObject':CHItrainSitStandObject, 'id': id})


def chi_l_end(request, id=None):
	if id:
		CHItrainSitStandObject = CHItrainSitStand.objects.get(pk=id)

		url = "https://www.dnainfo.com/chicago/visualizations/where-i-sit-stand-train?results=" + str(id)
		# connect to Bitly API
		c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
		bitlyURL = c.shorten(url)

	else:
		CHItrainSitStandObject = CHItrainSitStand()
		bitlyURL = {}

	return render(request, 'crimemaps/chi_l_end.html', {'CHItrainSitStandObject':CHItrainSitStandObject, 'id': id, 'bitlyURL': bitlyURL})

def chi_l_results(request, id=None):
	if id:
		CHItrainSitStandObject = CHItrainSitStand.objects.get(pk=id)


	else:
		CHItrainSitStandObject = CHItrainSitStand()
		bitlyURL = {}

	return render(request, 'crimemaps/chi_l_results.html', {'CHItrainSitStandObject':CHItrainSitStandObject, 'id': id})

def chi_l_analysis(request, lineSelected="Blue Line"):

	return render(request, 'crimemaps/chi_l_analysis.html', {'lineSelected':lineSelected})


def chi_l_results_api(request):
	#add in the items geojson requires 
	response = {}
	response['seats'] = {}
	response['seat_types'] = {}

	if request.method == 'GET':
		#gather potential filter variables
		train = request.GET.get("train","")
		rideTime = request.GET.get("rideTime","")
		rideLength = request.GET.get("rideLength","")
		capacity = request.GET.get("capacity","empty")

		#add kwargs and query terms
		kwargs = {}
		# show date range selected
		if train:
			kwargs['train__exact'] = train

		if rideTime:
			kwargs['rideTime__exact'] = rideTime

		if rideLength:
			kwargs['rideLength__exact'] = rideLength

		respondentsPositionOne = CHItrainSitStand.objects.filter(**kwargs).exclude(positionOne=0).count()
		response['respondentsPositionOne'] = respondentsPositionOne

		respondentsPositionTwo = CHItrainSitStand.objects.filter(**kwargs).exclude(positionTwo=0).count()
		response['respondentsPositionTwo'] = respondentsPositionTwo

		respondentsPositionThree = CHItrainSitStand.objects.filter(**kwargs).exclude(positionThree=0).count()
		response['respondentsPositionThree'] = respondentsPositionThree

		if capacity == "empty":
			# get count of exact seat locations
			countPositionOne = CHItrainSitStand.objects.filter(**kwargs).exclude(positionOne=0).values("positionOne").annotate(Count('positionOne'))
			for count in countPositionOne:
				key = count['positionOne']
				response['seats'][key] = count['positionOne__count']

			#get count of type of seat selected
			countPositionOneType = CHItrainSitStand.objects.filter(**kwargs).exclude(positionOne=0).values("positionOneType").annotate(Count('positionOneType'))
			for count in countPositionOneType:
				key = count['positionOneType']
				response['seat_types'][key] = count['positionOneType__count']


		if capacity == "half-full":
			countPositionTwo = CHItrainSitStand.objects.filter(**kwargs).exclude(positionTwo=0).values("positionTwo").annotate(Count('positionTwo'))
			for count in countPositionTwo:
				key = count['positionTwo']
				response['seats'][key] = count['positionTwo__count']

			#get count of type of seat selected
			countPositionTwoType = CHItrainSitStand.objects.filter(**kwargs).exclude(positionTwo=0).values("positionTwoType").annotate(Count('positionTwoType'))
			for count in countPositionTwoType:
				key = count['positionTwoType']
				response['seat_types'][key] = count['positionTwoType__count']


		if capacity == "full":
			countPositionThree = CHItrainSitStand.objects.filter(**kwargs).exclude(positionThree=0).values("positionThree").annotate(Count('positionThree'))
			for count in countPositionThree:
				key = count['positionThree']
				response['seats'][key] = count['positionThree__count']

			#get count of type of seat selected
			countPositionThreeType = CHItrainSitStand.objects.filter(**kwargs).exclude(positionThree=0).values("positionThreeType").annotate(Count('positionThreeType'))
			for count in countPositionThreeType:
				key = count['positionThreeType']
				response['seat_types'][key] = count['positionThreeType__count']


	return JsonResponse(response)



def nyc_subway_line(request, id=None):
	if id:
		NYCtrainSitStandObject = NYCtrainSitStand.objects.get(pk=id)
	else:
		NYCtrainSitStandObject = NYCtrainSitStand()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCTrainLineForm(request.POST, instance=NYCtrainSitStandObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCtrainSitStand.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('nyc_subway_arrived', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCTrainLineForm(instance=NYCtrainSitStandObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'crimemaps/nyc_subway_line.html', {'form':form, 'NYCtrainSitStandObject': NYCtrainSitStandObject})


def nyc_subway_arrived(request, id=None):
	if id:
		NYCtrainSitStandObject = NYCtrainSitStand.objects.get(pk=id)
	else:
		NYCtrainSitStandObject = NYCtrainSitStand()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCTrainTimeForm(request.POST, instance=NYCtrainSitStandObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCtrainSitStand.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('nyc_subway_length', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCTrainTimeForm(instance=NYCtrainSitStandObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'crimemaps/nyc_subway_arrived.html', {'form':form, 'NYCtrainSitStandObject': NYCtrainSitStandObject})


def nyc_subway_length(request, id=None):
	if id:
		NYCtrainSitStandObject = NYCtrainSitStand.objects.get(pk=id)
		if NYCtrainSitStandObject.train == "Yellow Line":
			return HttpResponseRedirect(reverse('NYC_l_empty_car', args=(NYCtrainSitStandObject.pk,)))
	else:
		NYCtrainSitStandObject = NYCtrainSitStand()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCTrainLengthForm(request.POST, instance=NYCtrainSitStandObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCtrainSitStand.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('nyc_subway_empty_car', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCTrainLengthForm(instance=NYCtrainSitStandObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'crimemaps/nyc_subway_length.html', {'form':form, 'NYCtrainSitStandObject': NYCtrainSitStandObject})


def nyc_subway_empty_car(request, id=None):
	if id:
		NYCtrainSitStandObject = NYCtrainSitStand.objects.get(pk=id)
	else:
		NYCtrainSitStandObject = NYCtrainSitStand()

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCTrainEmptyTrainForm(request.POST, instance=NYCtrainSitStandObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCtrainSitStand.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('nyc_subway_half_full_car', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCTrainEmptyTrainForm(instance=NYCtrainSitStandObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'crimemaps/nyc_subway_empty_car.html', {'form':form, 'NYCtrainSitStandObject': NYCtrainSitStandObject})



def nyc_subway_half_full_car(request, id=None):
	if id:
		NYCtrainSitStandObject = NYCtrainSitStand.objects.get(pk=id)
		positionOneType = NYCtrainSitStandObject.positionOneType
	else:
		NYCtrainSitStandObject = NYCtrainSitStand()
		positionOneType = ''

	# A HTTP POST?
	if request.method == 'POST':
		form = NYCTrainHalfFullTrainForm(request.POST, instance=NYCtrainSitStandObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCtrainSitStand.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('nyc_subway_full_car', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCTrainHalfFullTrainForm(instance=NYCtrainSitStandObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'crimemaps/nyc_subway_half_full_car.html', {'form':form, 'positionOneType': positionOneType, 'NYCtrainSitStandObject': NYCtrainSitStandObject})


def nyc_subway_full_car(request, id=None):
	if id:
		NYCtrainSitStandObject = NYCtrainSitStand.objects.get(pk=id)
		positionOne = NYCtrainSitStandObject.positionOne
		positionTwo = NYCtrainSitStandObject.positionTwo
	else:
		NYCtrainSitStandObject = NYCtrainSitStand()
		positionOne = ''
		positionTwo = ''


	# A HTTP POST?
	if request.method == 'POST':
		form = NYCTrainFullTrainForm(request.POST, instance=NYCtrainSitStandObject)

		# Have we been provided with a valid form?
		if form.is_valid():
			# Save the new data to the database.
			f = form.save()
			lookupObject = NYCtrainSitStand.objects.get(pk=f.pk)
			return HttpResponseRedirect(reverse('nyc_subway_end', args=(lookupObject.pk,)))
		else:
			# The supplied form contained errors - just print them to the terminal.
			print form.errors
	else:
		# If the request was not a POST, display the form to enter details.
		form = NYCTrainFullTrainForm(instance=NYCtrainSitStandObject)

	# Bad form (or form details), no form supplied...
	# Render the form with error messages (if any).
	return render(request, 'crimemaps/nyc_subway_full_car.html', {'form':form, 'positionOne': positionOne, 'positionTwo': positionTwo, 'NYCtrainSitStandObject': NYCtrainSitStandObject})


def nyc_subway_end(request, id=None):
	if id:
		NYCtrainSitStandObject = NYCtrainSitStand.objects.get(pk=id)

		url = "https://www.dnainfo.com/new-york/visualizations/where-i-sit-stand-train?results=" + str(id)
		# connect to Bitly API
		c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
		bitlyURL = c.shorten(url)

	else:
		NYCtrainSitStandObject = NYCtrainSitStand()
		bitlyURL = {}

	return render(request, 'crimemaps/nyc_subway_end.html', {'NYCtrainSitStandObject':NYCtrainSitStandObject, 'id': id, 'bitlyURL': bitlyURL})

def nyc_subway_results(request, id=None):
	if id:
		NYCtrainSitStandObject = NYCtrainSitStand.objects.get(pk=id)

	else:
		NYCtrainSitStandObject = NYCtrainSitStand()
		bitlyURL = {}

	return render(request, 'crimemaps/nyc_subway_results.html', {'NYCtrainSitStandObject':NYCtrainSitStandObject, 'id': id})


def nyc_subway_analysis(request, lineSelected="A"):

	return render(request, 'crimemaps/nyc_subway_analysis.html', {'lineSelected':lineSelected})

def nyc_subway_results_api(request):
	#add in the items geojson requires 
	response = {}
	response['seats'] = {}
	response['seat_types'] = {}

	if request.method == 'GET':
		#gather potential filter variables
		train = request.GET.get("train","")
		rideTime = request.GET.get("rideTime","")
		rideLength = request.GET.get("rideLength","")
		capacity = request.GET.get("capacity","empty")

		#add kwargs and query terms
		kwargs = {}
		# show date range selected
		if train:
			kwargs['train__exact'] = train

		if rideTime:
			kwargs['rideTime__exact'] = rideTime

		if rideLength:
			kwargs['rideLength__exact'] = rideLength


		respondentsPositionOne = NYCtrainSitStand.objects.filter(**kwargs).exclude(positionOne=0).count()
		response['respondentsPositionOne'] = respondentsPositionOne

		respondentsPositionTwo = NYCtrainSitStand.objects.filter(**kwargs).exclude(positionTwo=0).count()
		response['respondentsPositionTwo'] = respondentsPositionTwo

		respondentsPositionThree = NYCtrainSitStand.objects.filter(**kwargs).exclude(positionThree=0).count()
		response['respondentsPositionThree'] = respondentsPositionThree


		if capacity == "empty":
			# get count of exact seat locations
			countPositionOne = NYCtrainSitStand.objects.filter(**kwargs).exclude(positionOne=0).values("positionOne").annotate(Count('positionOne'))
			for count in countPositionOne:
				key = count['positionOne']
				response['seats'][key] = count['positionOne__count']

			#get count of type of seat selected
			countPositionOneType = NYCtrainSitStand.objects.filter(**kwargs).exclude(positionOne=0).values("positionOneType").annotate(Count('positionOneType'))
			for count in countPositionOneType:
				key = count['positionOneType']
				response['seat_types'][key] = count['positionOneType__count']


		if capacity == "half-full":
			countPositionTwo = NYCtrainSitStand.objects.filter(**kwargs).exclude(positionTwo=0).values("positionTwo").annotate(Count('positionTwo'))
			for count in countPositionTwo:
				key = count['positionTwo']
				response['seats'][key] = count['positionTwo__count']

			#get count of type of seat selected
			countPositionTwoType = NYCtrainSitStand.objects.filter(**kwargs).exclude(positionTwo=0).values("positionTwoType").annotate(Count('positionTwoType'))
			for count in countPositionTwoType:
				key = count['positionTwoType']
				response['seat_types'][key] = count['positionTwoType__count']


		if capacity == "full":
			countPositionThree = NYCtrainSitStand.objects.filter(**kwargs).exclude(positionThree=0).values("positionThree").annotate(Count('positionThree'))
			for count in countPositionThree:
				key = count['positionThree']
				response['seats'][key] = count['positionThree__count']

			#get count of type of seat selected
			countPositionThreeType = NYCtrainSitStand.objects.filter(**kwargs).exclude(positionThree=0).values("positionThreeType").annotate(Count('positionThreeType'))
			for count in countPositionThreeType:
				key = count['positionThreeType']
				response['seat_types'][key] = count['positionThreeType__count']


	return JsonResponse(response)


def createNYCTrainBitlyLink(request):
	if request.method == 'GET':
		#gather potential filter variables
		train = request.GET.get("train","")
		# rideTime = request.GET.get("rideTime","")
		# rideLength = request.GET.get("rideLength","")
		# capacity = request.GET.get("capacity","empty")

		url = "https://www.dnainfo.com/new-york/visualizations/where-i-sit-stand-train/analysis/" + train 
		# connect to Bitly API
		c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
		bitlyURL = c.shorten(url)

		output = bitlyURL['url']

	else:
		output = ''

	return HttpResponse(output)


def createCHITrainBitlyLink(request):
	if request.method == 'GET':
		#gather potential filter variables
		train = request.GET.get("train","")
		# rideTime = request.GET.get("rideTime","")
		# rideLength = request.GET.get("rideLength","")
		# capacity = request.GET.get("capacity","empty")

		url = "https://www.dnainfo.com/chicago/visualizations/where-i-sit-stand-train/analysis/" + train
		# connect to Bitly API
		c = bitly_api.Connection('ondnainfo', 'R_cdbdcaaef8d04d97b363b989f2fba3db')
		bitlyURL = c.shorten(url)

		output = bitlyURL['url']

	else:
		output = ''

	return HttpResponse(output)

