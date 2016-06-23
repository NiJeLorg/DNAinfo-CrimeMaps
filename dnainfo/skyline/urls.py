from django.conf.urls import include, url
from skyline import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^skyline/admin/$', views.skylineAdmin, name='skylineAdmin'),
    url(r'^skyline/admin/next/$', views.skylineAdminNext, name='skylineAdminNext'),
    url(r'^skyline/nyc/$', views.skyline_intro, name='skyline_intro'),
    url(r'^skyline/nyc/whatNeighborhood/$', views.skyline_whatNeighborhood, name='skyline_whatNeighborhood'),
    url(r'^skyline/nyc/whatNeighborhood/(?P<id>\d+)/$', views.skyline_whatNeighborhood, name='skyline_whatNeighborhood'),
    url(r'^skyline/nyc/buildingHeight/(?P<id>\d+)/$', views.skyline_buildingHeight, name='skyline_buildingHeight'),
    url(r'^skyline/nyc/exactLocation/(?P<id>\d+)/$', views.skyline_exactLocation, name='skyline_exactLocation'),
    url(r'^skyline/nyc/getGeojson/(?P<id>\d+)/$', views.skyline_getGeojson, name='skyline_getGeojson'),
    url(r'^skyline/nyc/end/(?P<id>\d+)/$', views.skyline_end, name='skyline_end'),
    url(r'^skyline/nyc/results/(?P<id>\d+)/$', views.skyline_results, name='skyline_results'),

]


