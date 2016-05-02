from django.conf.urls import include, url
from apartment import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^mfa-nyc/$', views.intro, name='intro'),
    url(r'^mfa-nyc/firstMove/$', views.firstMove, name='firstMove'),
    url(r'^mfa-nyc/firstMove/(?P<id>\d+)/$', views.firstMove, name='firstMove'),
    url(r'^mfa-nyc/whatNeighborhood/(?P<id>\d+)/$', views.whatNeighborhood, name='whatNeighborhood'),
    url(r'^mfa-nyc/exactLocation/(?P<id>\d+)/$', views.exactLocation, name='exactLocation'),
    url(r'^mfa-nyc/yearMoved/(?P<id>\d+)/$', views.yearMoved, name='yearMoved'),
    url(r'^mfa-nyc/bedrooms/(?P<id>\d+)/$', views.bedrooms, name='bedrooms'),
    url(r'^mfa-nyc/rentSplit/(?P<id>\d+)/$', views.rentSplit, name='rentSplit'),
    url(r'^mfa-nyc/iPaid/(?P<id>\d+)/$', views.iPaid, name='iPaid'),
    url(r'^mfa-nyc/allPaid/(?P<id>\d+)/$', views.allPaid, name='allPaid'),
    url(r'^mfa-nyc/calc/(?P<id>\d+)/$', views.calc, name='calc'),
    url(r'^mfa-nyc/end/(?P<id>\d+)/$', views.end, name='end'),
    url(r'^mfa-nyc/results/(?P<id>\d+)/$', views.results, name='results'),

]


