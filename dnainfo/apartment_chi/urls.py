from django.conf.urls import include, url
from apartment_chi import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^mfa-chi/$', views.intro, name='intro_chi'),
    url(r'^mfa-chi/firstMove/$', views.firstMove, name='firstMove_chi'),
    url(r'^mfa-chi/firstMove/(?P<id>\d+)/$', views.firstMove, name='firstMove_chi'),
    url(r'^mfa-chi/whatNeighborhood/(?P<id>\d+)/$', views.whatNeighborhood, name='whatNeighborhood_chi'),
    url(r'^mfa-chi/exactLocation/(?P<id>\d+)/$', views.exactLocation, name='exactLocation_chi'),
    url(r'^mfa-chi/yearMoved/(?P<id>\d+)/$', views.yearMoved, name='yearMoved_chi'),
    url(r'^mfa-chi/bedrooms/(?P<id>\d+)/$', views.bedrooms, name='bedrooms_chi'),
    url(r'^mfa-chi/rentSplit/(?P<id>\d+)/$', views.rentSplit, name='rentSplit_chi'),
    url(r'^mfa-chi/iPaid/(?P<id>\d+)/$', views.iPaid, name='iPaid_chi'),
    url(r'^mfa-chi/allPaid/(?P<id>\d+)/$', views.allPaid, name='allPaid_chi'),
    url(r'^mfa-chi/calc/(?P<id>\d+)/$', views.calc, name='calc_chi'),
    url(r'^mfa-chi/end/(?P<id>\d+)/$', views.end, name='end_chi'),
    url(r'^mfa-chi/results/(?P<id>\d+)/$', views.results, name='results_chi'),
    url(r'^mfa-chi/rawdataapi/$', views.rawdataapi, name='rawdataapi_chi'),
    url(r'^mfa-chi/summarydataapi/$', views.summarydataapi, name='summarydataapi_chi'),

]


