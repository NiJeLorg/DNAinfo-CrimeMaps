from django.conf.urls import include, url
from skyline_chi import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^skyline/admin/chi/$', views.skyline_chi_AdminDashboard, name='skyline_chi_AdminDashboard'),
    url(r'^skyline/admin/chi/ugc/list/$', views.skyline_chi_UgcList, name='skyline_chi_UgcList'),
    url(r'^skyline/admin/chi/ugc/approve/(?P<id>\d+)/$', views.skyline_chi_UgcApprove, name='skyline_chi_UgcApprove'),
    url(r'^skyline/admin/chi/ugc/reject/(?P<id>\d+)/$', views.skyline_chi_UgcReject, name='skyline_chi_UgcReject'),
    url(r'^skyline/admin/chi/sponsored/list/$', views.skyline_chi_sponsoredList, name='skyline_chi_sponsoredList'),
    url(r'^skyline/admin/chi/sponsored/remove/(?P<id>\d+)/$', views.skyline_chi_sponsoredRemove, name='skyline_chi_sponsoredRemove'),
    url(r'^skyline/admin/chi/sponsored/whatNeighborhood/$', views.skyline_chi_sponsoredWhatNeighborhood, name='skyline_chi_sponsoredWhatNeighborhood'),
    url(r'^skyline/admin/chi/sponsored/whatNeighborhood/(?P<id>\d+)/$', views.skyline_chi_sponsoredWhatNeighborhood, name='skyline_chi_sponsoredWhatNeighborhood'),
    url(r'^skyline/admin/chi/sponsored/buildingHeight/(?P<id>\d+)/$', views.skyline_chi_sponsoredBuildingHeight, name='skyline_chi_sponsoredBuildingHeight'),
    url(r'^skyline/admin/chi/sponsored/exactLocation/(?P<id>\d+)/$', views.skyline_chi_sponsoredExactLocation, name='skyline_chi_sponsoredExactLocation'),
    url(r'^skyline/admin/chi/sponsored/getGeojson/(?P<id>\d+)/$', views.skyline_chi_sponsoredGetGeojson, name='skyline_chi_sponsoredGetGeojson'),
    url(r'^skyline/admin/chi/sponsored/end/(?P<id>\d+)/$', views.skyline_chi_sponsoredEnd, name='skyline_chi_sponsoredEnd'),
    url(r'^skyline/admin/chi/reporter/whatNeighborhood/$', views.skyline_chi_reporterWhatNeighborhood, name='skyline_chi_reporterWhatNeighborhood'),
    url(r'^skyline/admin/chi/reporter/whatNeighborhood/(?P<id>\d+)/$', views.skyline_chi_reporterWhatNeighborhood, name='skyline_chi_reporterWhatNeighborhood'),
    url(r'^skyline/admin/chi/reporter/buildingHeight/(?P<id>\d+)/$', views.skyline_chi_reporterBuildingHeight, name='skyline_chi_reporterBuildingHeight'),
    url(r'^skyline/admin/chi/reporter/exactLocation/(?P<id>\d+)/$', views.skyline_chi_reporterExactLocation, name='skyline_chi_reporterExactLocation'),
    url(r'^skyline/admin/chi/reporter/getGeojson/(?P<id>\d+)/$', views.skyline_chi_reporterGetGeojson, name='skyline_chi_reporterGetGeojson'),
    url(r'^skyline/admin/chi/reporter/end/(?P<id>\d+)/$', views.skyline_chi_reporterEnd, name='skyline_chi_reporterEnd'),
    url(r'^skyline/admin/chi/reporter/list/$', views.skyline_chi_reporterList, name='skyline_chi_reporterList'),
    url(r'^skyline/admin/chi/reporter/remove/(?P<id>\d+)/$', views.skyline_chi_reporterRemove, name='skyline_chi_reporterRemove'),
    url(r'^skyline/admin/chi/viewall/whatNeighborhood/$', views.skyline_chi_viewAllWhatNeighborhood, name='skyline_chi_viewAllWhatNeighborhood'),
    url(r'^skyline/admin/chi/viewall/whatNeighborhood/(?P<id>\d+)/$', views.skyline_chi_viewAllWhatNeighborhood, name='skyline_chi_viewAllWhatNeighborhood'),
    url(r'^skyline/admin/chi/viewall/(?P<id>\d+)/$', views.skyline_chi_viewAll, name='skyline_chi_viewAll'),
    url(r'^skyline/admin/check/chi/$', views.skyline_chi_AdminCheck, name='sskyline_chi_AdminCheck'),
    url(r'^skyline/admin/next/chi/$', views.skyline_chi_AdminNext, name='skyline_chi_AdminNext'),
    url(r'^skyline/chi/$', views.skyline_chi_intro, name='skyline_chi_intro'),
    url(r'^skyline/chi/whatNeighborhood/$', views.skyline_chi_whatNeighborhood, name='skyline_chi_whatNeighborhood'),
    url(r'^skyline/chi/whatNeighborhood/(?P<id>\d+)/$', views.skyline_chi_whatNeighborhood, name='skyline_chi_whatNeighborhood'),
    url(r'^skyline/chi/buildingHeight/(?P<id>\d+)/$', views.skyline_chi_buildingHeight, name='skyline_chi_buildingHeight'),
    url(r'^skyline/chi/exactLocation/(?P<id>\d+)/$', views.skyline_chi_exactLocation, name='skyline_chi_exactLocation'),
    url(r'^skyline/chi/getGeojson/(?P<id>\d+)/$', views.skyline_chi_getGeojson, name='skyline_chi_getGeojson'),
    url(r'^skyline/chi/getSponsoredGeojsons/$', views.skyline_chi_getSponsoredGeojsons, name='skyline_chi_getSponsoredGeojsons'),
    url(r'^skyline/chi/getPermittedGeojsons/$', views.skyline_chi_getPermittedGeojsons, name='skyline_chi_getPermittedGeojsons'),
    url(r'^skyline/chi/getReporterGeojsons/$', views.skyline_chi_getReporterGeojsons, name='skyline_chi_getReporterGeojsons'),
    url(r'^skyline/chi/end/(?P<id>\d+)/$', views.skyline_chi_end, name='skyline_chi_end'),
    url(r'^skyline/chi/results/(?P<id>\d+)/$', views.skyline_chi_results, name='skyline_chi_results'),

]
