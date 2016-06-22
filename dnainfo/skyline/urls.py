from django.conf.urls import include, url
from skyline import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^skyline/admin/$', views.skylineAdmin, name='skylineAdmin'),
    url(r'^skyline/admin/next/$', views.skylineAdminNext, name='skylineAdminNext'),
    url(r'^skyline/nyc/$', views.intro, name='intro'),
    url(r'^skyline/nyc/whatNeighborhood/$', views.whatNeighborhood, name='whatNeighborhood'),
    url(r'^skyline/nyc/whatNeighborhood/(?P<id>\d+)/$', views.whatNeighborhood, name='whatNeighborhood'),
    url(r'^skyline/nyc/buildingHeight/(?P<id>\d+)/$', views.buildingHeight, name='buildingHeight'),
    url(r'^skyline/nyc/exactLocation/(?P<id>\d+)/$', views.exactLocation, name='exactLocation'),
    url(r'^skyline/nyc/getGeojson/(?P<id>\d+)/$', views.getGeojson, name='getGeojson'),
    url(r'^skyline/nyc/end/(?P<id>\d+)/$', views.end, name='end'),
    url(r'^skyline/nyc/results/(?P<id>\d+)/$', views.results, name='results'),

]


