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
    url(r'^nycfireworks2010to2014citywide/$', views.nycfireworks2010to2014citywide, name='nycfireworks2010to2014citywide'),
    url(r'^nycfireworks2015citywide/$', views.nycfireworks2015citywide, name='nycfireworks2015citywide'),
    url(r'^nycfireworks2010to2014torque/$', views.nycfireworks2010to2014torque, name='nycfireworks2010to2014torque'),
    url(r'^nycfireworks2015torque/$', views.nycfireworks2015torque, name='nycfireworks2015torque'),
    url(r'^nycfireworks2010to2014citywidetorque/$', views.nycfireworks2010to2014citywidetorque, name='nycfireworks2010to2014citywidetorque'),
    url(r'^nycfireworks2015citywidetorque/$', views.nycfireworks2015citywidetorque, name='nycfireworks2015citywidetorque'),
    url(r'^nycneigh/$', views.nycneigh, name='nycneigh'),
    url(r'^nycneighdraw/(?P<id>\d+)/$', views.nycneighdraw, name='nycneighdraw'),
    url(r'^nycneighdrawsave/(?P<id>\d+)/$', views.nycneighdrawsave, name='nycneighdrawsave'),
    url(r'^nycneighshow/(?P<id>\d+)/$', views.nycneighshow, name='nycneighshow'),
    url(r'^getnycdrawngeojson/(?P<id>\d+)/$', views.getnycdrawngeojson, name='getnycdrawngeojson'),
    url(r'^getallnycdrawngeojson/(?P<neighborhoodLive>[-\w]+)/(?P<id>\d+)/$', views.getALLnycdrawngeojson, name='getALLnycdrawngeojson'),
    url(r'^getallnycdrawngeojsonids/(?P<neighborhoodLive>[-\w]+)/(?P<id>\d+)/$', views.getALLnycdrawngeojsonIDS, name='getALLnycdrawngeojsonIDS'),
    url(r'^allnycpolygons/$', views.allnycpolygons, name='allnycpolygons'),
    url(r'^allnycgeojsons/$', views.allnycgeojsons, name='allnycgeojsons'),
    url(r'^nycpolygonsbyneigh/(?P<neighborhoodLive>[-\w]+)/$', views.nycpolygonsbyneigh, name='nycpolygonsbyneigh'),
    url(r'^nycgeojsonsbyneigh/(?P<neighborhoodLive>[-\w]+)/$', views.nycgeojsonsbyneigh, name='nycgeojsonsbyneigh'),
    url(r'^removenycdrawngeojsonbyid/(?P<id>\d+)/$', views.removenycdrawngeojsonbyid, name='removenycdrawngeojsonbyid'),
    url(r'^chineigh/$', views.chineigh, name='chineigh'),
    url(r'^chineighdraw/(?P<id>\d+)/$', views.chineighdraw, name='chineighdraw'),
    url(r'^chineighdrawsave/(?P<id>\d+)/$', views.chineighdrawsave, name='chineighdrawsave'),
    url(r'^chineighshow/(?P<id>\d+)/$', views.chineighshow, name='chineighshow'),
    url(r'^getchidrawngeojson/(?P<id>\d+)/$', views.getchidrawngeojson, name='getchidrawngeojson'),
    url(r'^getallchidrawngeojson/(?P<neighborhoodLive>[-\w]+)/(?P<id>\d+)/$', views.getALLchidrawngeojson, name='getALLchidrawngeojson'),
    url(r'^getallchidrawngeojsonids/(?P<neighborhoodLive>[-\w]+)/(?P<id>\d+)/$', views.getALLchidrawngeojsonIDS, name='getALLchidrawngeojsonIDS'),
    url(r'^allchipolygons/$', views.allchipolygons, name='allchipolygons'),
    url(r'^allchigeojsons/$', views.allchigeojsons, name='allchigeojsons'),
    url(r'^chipolygonsbyneigh/(?P<neighborhoodLive>[-\w]+)/$', views.chipolygonsbyneigh, name='nycpolygonsbyneigh'),
    url(r'^chigeojsonsbyneigh/(?P<neighborhoodLive>[-\w]+)/$', views.chigeojsonsbyneigh, name='chigeojsonsbyneigh'),
    url(r'^removechidrawngeojsonbyid/(?P<id>\d+)/$', views.removechidrawngeojsonbyid, name='removechidrawngeojsonbyid'),
    url(r'^nycneighview/(?P<neighborhoodID>[-\w]+)/$', views.nycneighview, name='nycneighview'),
    url(r'^nycneighview/$', views.nycneighview, name='nycneighview'),
    url(r'^chineighview/(?P<neighborhoodID>[-\w]+)/$', views.chineighview, name='chineighview'),
    url(r'^chineighview/$', views.chineighview, name='chineighview'),

]
