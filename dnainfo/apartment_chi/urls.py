from django.conf.urls import include, url
from apartment_chi import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^mfa-chi/$', views.intro, name='intro'),
    url(r'^mfa-chi/firstMove/$', views.firstMove, name='firstMove'),
    url(r'^mfa-chi/firstMove/(?P<id>\d+)/$', views.firstMove, name='firstMove'),
    url(r'^mfa-chi/whatNeighborhood/(?P<id>\d+)/$', views.whatNeighborhood, name='whatNeighborhood'),
    url(r'^mfa-chi/exactLocation/(?P<id>\d+)/$', views.exactLocation, name='exactLocation'),
    url(r'^mfa-chi/yearMoved/(?P<id>\d+)/$', views.yearMoved, name='yearMoved'),
    url(r'^mfa-chi/bedrooms/(?P<id>\d+)/$', views.bedrooms, name='bedrooms'),
    url(r'^mfa-chi/rentSplit/(?P<id>\d+)/$', views.rentSplit, name='rentSplit'),
    url(r'^mfa-chi/iPaid/(?P<id>\d+)/$', views.iPaid, name='iPaid'),
    url(r'^mfa-chi/allPaid/(?P<id>\d+)/$', views.allPaid, name='allPaid'),
    url(r'^mfa-chi/calc/(?P<id>\d+)/$', views.calc, name='calc'),
    url(r'^mfa-chi/end/(?P<id>\d+)/$', views.end, name='end'),
    url(r'^mfa-chi/results/(?P<id>\d+)/$', views.results, name='results'),

]


