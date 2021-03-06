from django.conf.urls import include, url
from skyline import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^skyline/nyc/new-building/$', views.skyline_intro, name='skyline_intro'),
    url(r'^skyline/nyc/whatNeighborhood/$', views.skyline_whatNeighborhood, name='skyline_whatNeighborhood'),
    url(r'^skyline/nyc/whatNeighborhood/(?P<id>\d+)/$', views.skyline_whatNeighborhood, name='skyline_whatNeighborhood'),
    url(r'^skyline/nyc/buildingHeight/(?P<id>\d+)/$', views.skyline_buildingHeight, name='skyline_buildingHeight'),
    url(r'^skyline/nyc/exactLocation/(?P<id>\d+)/$', views.skyline_exactLocation, name='skyline_exactLocation'),
    url(r'^skyline/nyc/getGeojson/(?P<id>\d+)/$', views.skyline_getGeojson, name='skyline_getGeojson'),
    url(r'^skyline/nyc/getSponsoredGeojsons/$', views.skyline_getSponsoredGeojsons, name='skyline_getSponsoredGeojsons'),
    url(r'^skyline/nyc/getPermittedGeojsons/(?P<boro>[-\w]+)/$', views.skyline_getPermittedGeojsons, name='skyline_getPermittedGeojsons'),
    url(r'^skyline/nyc/getReporterGeojsons/$', views.skyline_getReporterGeojsons, name='skyline_getReporterGeojsons'),
    url(r'^skyline/nyc/getUGCApprovedGeojsons/$', views.skyline_getUGCApprovedGeojsons, name='skyline_getUGCApprovedGeojsons'),
    url(r'^skyline/nyc/end/(?P<id>\d+)/$', views.skyline_end, name='skyline_end'),
    url(r'^skyline/nyc/results/(?P<id>\d+)/$', views.skyline_results, name='skyline_results'),
    #admin urls
    url(r'^skyline/admin/nyc/$', views.skylineAdminDashboard, name='skyline_AdminDashboard'),
    url(r'^skyline/admin/nyc/ugc/viewall/$', views.skyline_UgcViewAll, name='skyline_UgcViewAll'),
    url(r'^skyline/admin/nyc/ugc/list/$', views.skyline_UgcList, name='skyline_UgcList'),
    url(r'^skyline/admin/nyc/ugc/approve/(?P<id>\d+)/$', views.skyline_UgcApprove, name='skyline_UgcApprove'),
    url(r'^skyline/admin/nyc/ugc/reject/(?P<id>\d+)/$', views.skyline_UgcReject, name='skyline_UgcReject'),
    url(r'^skyline/admin/nyc/ugc/edit/(?P<id>\d+)/$', views.skyline_UgcEdit, name='skyline_UgcEdit'),
    url(r'^skyline/admin/nyc/sponsored/list/$', views.skyline_sponsoredList, name='skyline_sponsoredList'),
    url(r'^skyline/admin/nyc/sponsored/remove/(?P<id>\d+)/$', views.skyline_sponsoredRemove, name='skyline_sponsoredRemove'),
    url(r'^skyline/admin/nyc/sponsored/whatNeighborhood/$', views.skyline_sponsoredWhatNeighborhood, name='skyline_sponsoredWhatNeighborhood'),
    url(r'^skyline/admin/nyc/sponsored/whatNeighborhood/(?P<id>\d+)/$', views.skyline_sponsoredWhatNeighborhood, name='skyline_sponsoredWhatNeighborhood'),
    url(r'^skyline/admin/nyc/sponsored/buildingHeight/(?P<id>\d+)/$', views.skyline_sponsoredBuildingHeight, name='skyline_sponsoredBuildingHeight'),
    url(r'^skyline/admin/nyc/sponsored/buildingHeightEdit/(?P<id>\d+)/$', views.skyline_sponsoredBuildingHeightEdit, name='skyline_sponsoredBuildingHeightEdit'),
    url(r'^skyline/admin/nyc/sponsored/exactLocation/(?P<id>\d+)/$', views.skyline_sponsoredExactLocation, name='skyline_sponsoredExactLocation'),
    url(r'^skyline/admin/nyc/sponsored/getGeojson/(?P<id>\d+)/$', views.skyline_sponsoredGetGeojson, name='skyline_sponsoredGetGeojson'),
    url(r'^skyline/admin/nyc/sponsored/end/(?P<id>\d+)/$', views.skyline_sponsoredEnd, name='skyline_sponsoredEnd'),
    url(r'^skyline/admin/nyc/reporter/whatNeighborhood/$', views.skyline_reporterWhatNeighborhood, name='skyline_reporterWhatNeighborhood'),
    url(r'^skyline/admin/nyc/reporter/whatNeighborhood/(?P<id>\d+)/$', views.skyline_reporterWhatNeighborhood, name='skyline_reporterWhatNeighborhood'),
    url(r'^skyline/admin/nyc/reporter/buildingHeight/(?P<id>\d+)/$', views.skyline_reporterBuildingHeight, name='skyline_reporterBuildingHeight'),
    url(r'^skyline/admin/nyc/reporter/buildingHeightEdit/(?P<id>\d+)/$', views.skyline_reporterBuildingHeightEdit, name='skyline_reporterBuildingHeightEdit'),
    url(r'^skyline/admin/nyc/reporter/exactLocation/(?P<id>\d+)/$', views.skyline_reporterExactLocation, name='skyline_reporterExactLocation'),
    url(r'^skyline/admin/nyc/reporter/getGeojson/(?P<id>\d+)/$', views.skyline_reporterGetGeojson, name='skyline_reporterGetGeojson'),
    url(r'^skyline/admin/nyc/reporter/end/(?P<id>\d+)/$', views.skyline_reporterEnd, name='skyline_reporterEnd'),
    url(r'^skyline/admin/nyc/reporter/list/$', views.skyline_reporterList, name='skyline_reporterList'),
    url(r'^skyline/admin/nyc/reporter/remove/(?P<id>\d+)/$', views.skyline_reporterRemove, name='skyline_reporterRemove'),
    url(r'^skyline/admin/nyc/viewall/whatNeighborhood/$', views.skyline_viewAllWhatNeighborhood, name='skyline_viewAllWhatNeighborhood'),
    url(r'^skyline/admin/nyc/viewall/whatNeighborhood/(?P<id>\d+)/$', views.skyline_viewAllWhatNeighborhood, name='skyline_viewAllWhatNeighborhood'),
    url(r'^skyline/admin/nyc/viewall/(?P<id>\d+)/$', views.skyline_viewAll, name='skyline_viewAll'),
    url(r'^skyline/admin/check/$', views.skylineAdminCheck, name='skyline_AdminCheck'),
    url(r'^skyline/admin/next/$', views.skylineAdminNext, name='skyline_AdminNext'),
    # permitted buidling mini-form
    url(r'^skyline/admin/nyc/permitted/buildingHeight/(?P<id>\d+)/$', views.skyline_permittedBuildingHeight, name='skyline_permittedBuildingHeight'),
    # permitted building full form
    url(r'^skyline/admin/nyc/permitted/whatNeighborhood/$', views.skyline_permittedWhatNeighborhood, name='skyline_permittedWhatNeighborhood'),
    url(r'^skyline/admin/nyc/permitted/whatNeighborhood/(?P<id>\d+)/$', views.skyline_permittedWhatNeighborhood, name='skyline_permittedWhatNeighborhood'),
    url(r'^skyline/admin/nyc/permitted/buildingHeightAnd/(?P<id>\d+)/$', views.skyline_permittedBuildingHeightAnd, name='skyline_permittedBuildingHeightAnd'),
    url(r'^skyline/admin/nyc/permitted/exactLocation/(?P<id>\d+)/$', views.skyline_permittedExactLocation, name='skyline_permittedExactLocation'),
    url(r'^skyline/admin/nyc/permitted/getGeojson/(?P<id>\d+)/$', views.skyline_permittedGetGeojson, name='skyline_permittedGetGeojson'),
    url(r'^skyline/admin/nyc/permitted/end/(?P<id>\d+)/$', views.skyline_permittedEnd, name='skyline_permittedEnd'),
    url(r'^skyline/admin/nyc/permitted/csv/$', views.skyline_createBuildingsCSV, name='skyline_createBuildingsCSV'),
    url(r'^skyline/admin/nyc/ugc/csv/$', views.skyline_createNewsletterCSV, name='skyline_createNewsletterCSV'),

    # intro and landing page
    url(r'^skyline/nyc/$', views.skyline_landingPage, name='skyline_landingPage'),
    url(r'^skyline/nyc/browse/(?P<id>\d+)/$', views.skyline_browse, name='skyline_browse'),
    url(r'^skyline/nyc/return_result/(?P<id>\d+)/$', views.skyline_return_result, name='skyline_return_result'),

    #lyft test
    url(r'^lyft_test/$', views.lyft_test, name='lyft_test'),    


]
