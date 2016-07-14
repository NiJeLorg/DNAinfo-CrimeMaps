from django.conf.urls import include, url
from skyline import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^skyline/admin/nyc/$', views.skylineAdminDashboard, name='skyline_AdminDashboard'),
    url(r'^skyline/admin/nyc/sponsored/list/$', views.skyline_sponsoredList, name='skyline_sponsoredList'),
    url(r'^skyline/admin/nyc/sponsored/remove/(?P<id>\d+)/$', views.skyline_sponsoredRemove, name='skyline_sponsoredRemove'),
    url(r'^skyline/admin/nyc/sponsored/whatNeighborhood/$', views.skyline_sponsoredWhatNeighborhood, name='skyline_sponsoredWhatNeighborhood'),
    url(r'^skyline/admin/nyc/sponsored/whatNeighborhood/(?P<id>\d+)/$', views.skyline_sponsoredWhatNeighborhood, name='skyline_sponsoredWhatNeighborhood'),
    url(r'^skyline/admin/nyc/sponsored/buildingHeight/(?P<id>\d+)/$', views.skyline_sponsoredBuildingHeight, name='skyline_sponsoredBuildingHeight'),
    url(r'^skyline/admin/nyc/sponsored/exactLocation/(?P<id>\d+)/$', views.skyline_sponsoredExactLocation, name='skyline_sponsoredExactLocation'),
    url(r'^skyline/admin/nyc/sponsored/getGeojson/(?P<id>\d+)/$', views.skyline_sponsoredGetGeojson, name='skyline_sponsoredGetGeojson'),
    url(r'^skyline/admin/nyc/sponsored/end/(?P<id>\d+)/$', views.skyline_sponsoredEnd, name='skyline_sponsoredEnd'),
    url(r'^skyline/admin/check/$', views.skylineAdminCheck, name='skyline_AdminCheck'),
    url(r'^skyline/admin/next/$', views.skylineAdminNext, name='skyline_AdminNext'),
    url(r'^skyline/nyc/$', views.skyline_intro, name='skyline_intro'),
    url(r'^skyline/nyc/whatNeighborhood/$', views.skyline_whatNeighborhood, name='skyline_whatNeighborhood'),
    url(r'^skyline/nyc/whatNeighborhood/(?P<id>\d+)/$', views.skyline_whatNeighborhood, name='skyline_whatNeighborhood'),
    url(r'^skyline/nyc/buildingHeight/(?P<id>\d+)/$', views.skyline_buildingHeight, name='skyline_buildingHeight'),
    url(r'^skyline/nyc/exactLocation/(?P<id>\d+)/$', views.skyline_exactLocation, name='skyline_exactLocation'),
    url(r'^skyline/nyc/getGeojson/(?P<id>\d+)/$', views.skyline_getGeojson, name='skyline_getGeojson'),
    url(r'^skyline/nyc/getSponsoredGeojsons/$', views.skyline_getSponsoredGeojsons, name='skyline_getSponsoredGeojsons'),
    url(r'^skyline/nyc/end/(?P<id>\d+)/$', views.skyline_end, name='skyline_end'),
    url(r'^skyline/nyc/results/(?P<id>\d+)/$', views.skyline_results, name='skyline_results'),

]


