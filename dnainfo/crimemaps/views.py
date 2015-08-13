from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.db.models import Sum, Count
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

#CSRF decorator
from django.views.decorators.csrf import ensure_csrf_cookie

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
	now = time_zone.localize(datetime.datetime.now())
	if latestDate.DateTime > now:
		countDate = today
	else:
		countDate = latestDate.DateTime

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
	now = time_zone.localize(datetime.datetime.now())
	if latestDate.DateTime > now:
		countDate = today
	else:
		countDate = latestDate.DateTime

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
	firstOfYear = date(date.today().year, 1, 1)
	today_str = today.strftime("%x")
	firstOfYear_str = firstOfYear.strftime("%x")
	startDate = request.GET.get("startDate",firstOfYear_str)
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
		startDateobject = startDateparsed.date()
		endDateparsed = dateutil.parser.parse(endDate)
		endDateobject = endDateparsed.date()

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
		startDateparsed = dateutil.parser.parse(startDate)
		startDateobject = startDateparsed.date()
		endDateparsed = dateutil.parser.parse(endDate)
		endDateobject = endDateparsed.date()

		#add kwargs and hour query
		kwargs = {}
		# show date range selected
		kwargs['Date__range'] = [startDateobject,endDateobject]

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

		# create data objects from start and end dates
		startDateparsed = dateutil.parser.parse(startDate)
		startDateobject = startDateparsed.date()
		endDateparsed = dateutil.parser.parse(endDate)
		endDateobject = endDateparsed.date()

		#add kwargs
		kwargs = {}
		# show date range selected
		#kwargs['Date__range'] = [startDateobject,endDateobject]

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

		# create data objects from start and end dates
		startDateparsed = dateutil.parser.parse(startDate)
		startDateobject = startDateparsed.date()
		endDateparsed = dateutil.parser.parse(endDate)
		endDateobject = endDateparsed.date()

		#add kwargs
		kwargs = {}
		# show date range selected
		#kwargs['Date__range'] = [startDateobject,endDateobject]

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

	allDrawnNeighborhoods = neighborhoodDrawNYC.objects.all()
	geojsons = []
	for drawn in allDrawnNeighborhoods:
		changed = drawn.drawnGeojson.replace('\"properties\":{}', '\"properties\":{\"ID\":\"'+ str(drawn.id) +'\", \"neighborhoodLive\":\"'+ str(drawn.neighborhoodLive.name) +'\", \"otherNeighborhood\":\"'+ drawn.otherNeighborhood +'\"}')
		geojsons.append(changed) 

	return JsonResponse(geojsons, safe=False)

def nycpolygonsbyneigh(request, neighborhoodLive=None):

	return render(request, 'crimemaps/nycpolygonsbyneigh.html', {'neighborhoodLive': neighborhoodLive})

def nycgeojsonsbyneigh(request, neighborhoodLive=None):
	neighborhood = neighborhoodNYC.objects.get(dnaurl=neighborhoodLive)

	allDrawnNeighborhoods = neighborhoodDrawNYC.objects.filter(neighborhoodLive=neighborhood)
	geojsons = []
	for drawn in allDrawnNeighborhoods:
		changed = drawn.drawnGeojson.replace('\"properties\":{}', '\"properties\":{\"ID\":\"'+ str(drawn.id) +'\", \"created\":\"'+ str(drawn.created) +'\", \"neighborhoodLive\":\"'+ str(drawn.neighborhoodLive.name) +'\", \"otherNeighborhood\":\"'+ drawn.otherNeighborhood +'\", \"yearsLived\":\"'+ str(drawn.yearsLived) +'\", \"approved\":\"'+ str(drawn.approved) +'\"}')
		geojsons.append(changed) 

	return JsonResponse(geojsons, safe=False)


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
		changed = drawn.drawnGeojson.replace('\"properties\":{}', '\"properties\":{\"ID\":\"'+ str(drawn.id) +'\", \"neighborhoodLive\":\"'+ str(drawn.neighborhoodLive.name) +'\", \"otherNeighborhood\":\"'+ drawn.otherNeighborhood +'\"}')
		geojsons.append(changed) 

	return JsonResponse(geojsons, safe=False)

def chipolygonsbyneigh(request, neighborhoodLive=None):

	return render(request, 'crimemaps/chipolygonsbyneigh.html', {'neighborhoodLive': neighborhoodLive})

def chigeojsonsbyneigh(request, neighborhoodLive=None):
	neighborhood = neighborhoodCHI.objects.get(dnaurl=neighborhoodLive)

	allDrawnNeighborhoods = neighborhoodDrawCHI.objects.filter(neighborhoodLive=neighborhood)
	geojsons = []
	for drawn in allDrawnNeighborhoods:
		changed = drawn.drawnGeojson.replace('\"properties\":{}', '\"properties\":{\"ID\":\"'+ str(drawn.id) +'\", \"created\":\"'+ str(drawn.created) +'\", \"neighborhoodLive\":\"'+ str(drawn.neighborhoodLive.name) +'\", \"otherNeighborhood\":\"'+ drawn.otherNeighborhood +'\", \"yearsLived\":\"'+ str(drawn.yearsLived) +'\", \"approved\":\"'+ str(drawn.approved) +'\"}')
		geojsons.append(changed) 

	return JsonResponse(geojsons, safe=False)
