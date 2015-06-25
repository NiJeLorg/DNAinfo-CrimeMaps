from django.conf.urls import include, url
from crimemaps import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^chitransporttowork/$', views.chiTransportToWork, name='chiTransportToWork'),
    url(r'^nyctransporttowork/$', views.transportToWork, name='transportToWork'),
    url(r'^nycworkedfromhome/$', views.workedFromHome, name='workedFromHome'),
    url(r'^chiworkedfromhome/$', views.chiWorkedFromHome, name='chiWorkedFromHome'),
    url(r'^nycbuilder/$', views.linkiframebuilder, name='linkiframebuilder'),
    url(r'^chibuilder/$', views.chilinkiframebuilder, name='chilinkiframebuilder'),
    url(r'^compstat/$', views.compstatPage, name='compstat'),
    url(r'^compstatapi/$', views.compstatApi, name='compstatApi'),
    url(r'^doitt/$', views.doittPage, name='doitt'),
    url(r'^doittapi/$', views.doittApi, name='doittApi'),
    url(r'^blotter/$', views.blotterPage, name='blotter'),
    url(r'^blotterapi/$', views.blotterApi, name='blotterApi'),
    url(r'^chishootings/$', views.chiShootingsPage, name='chiShootingsPage'),
    url(r'^chishootingsapi/$', views.chiShootingsApi, name='chiShootingsApi'),
    url(r'^chishootingsaggregateapi/$', views.chiShootingsAggregateApi, name='chiShootingsAggregateApi'),
    url(r'^chishootingcitywidesaggregateapi/$', views.chiShootingsCitywideAggregateApi, name='chiShootingsCitywideAggregateApi'),
    url(r'^nycfireworks2010to2014/$', views.nycfireworks2010to2014, name='nycfireworks2010to2014'),
    url(r'^nycfireworks2015/$', views.nycfireworks2015, name='nycfireworks2015'),
]
