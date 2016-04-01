from django.conf.urls import include, url
from apartment import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^my-first-apartment/$', views.intro, name='intro'),
    url(r'^firstMove/$', views.firstMove, name='firstMove'),
    url(r'^firstMove/(?P<id>\d+)/$', views.firstMove, name='firstMove'),
    url(r'^whatNeighborhood/(?P<id>\d+)/$', views.whatNeighborhood, name='whatNeighborhood'),
    url(r'^exactLocation/(?P<id>\d+)/$', views.exactLocation, name='exactLocation'),
    url(r'^yearMoved/(?P<id>\d+)/$', views.yearMoved, name='yearMoved'),
    url(r'^bedrooms/(?P<id>\d+)/$', views.bedrooms, name='bedrooms'),
    url(r'^rentSplit/(?P<id>\d+)/$', views.rentSplit, name='rentSplit'),
    url(r'^iPaid/(?P<id>\d+)/$', views.iPaid, name='iPaid'),
    url(r'^allPaid/(?P<id>\d+)/$', views.allPaid, name='allPaid'),
    url(r'^results/(?P<id>\d+)/$', views.results, name='results'),

]


