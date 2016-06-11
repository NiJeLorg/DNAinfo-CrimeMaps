from django.conf.urls import include, url
from skyline import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^nyc-skyline/$', views.intro, name='intro'),
    url(r'^nyc-skyline/whatNeighborhood/$', views.whatNeighborhood, name='whatNeighborhood'),
    url(r'^nyc-skyline/whatNeighborhood/(?P<id>\d+)/$', views.whatNeighborhood, name='whatNeighborhood'),
    url(r'^nyc-skyline/buildingHeight/(?P<id>\d+)/$', views.buildingHeight, name='buildingHeight'),
    url(r'^nyc-skyline/exactLocation/(?P<id>\d+)/$', views.exactLocation, name='exactLocation'),
    url(r'^nyc-skyline/getGeojson/(?P<id>\d+)/$', views.getGeojson, name='getGeojson'),
    url(r'^nyc-skyline/end/(?P<id>\d+)/$', views.end, name='end'),
    url(r'^nyc-skyline/results/(?P<id>\d+)/$', views.results, name='results'),

]


