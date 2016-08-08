from django.conf.urls import include, url
from apartment_test_for_danny_chi import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^chicago/visualizations/apartment-test-for-danny-chi/$', views.intro, name='intro-apartment-test-for-danny-chi'),
    url(r'^chicago/visualizations/apartment-test-for-danny-chi/firstMove/$', views.firstMove, name='firstMove-apartment-test-for-danny-chi'),
    url(r'^chicago/visualizations/apartment-test-for-danny-chi/firstMove/(?P<id>\d+)/$', views.firstMove, name='firstMove-apartment-test-for-danny-chi'),
    url(r'^chicago/visualizations/apartment-test-for-danny-chi/whatNeighborhood/(?P<id>\d+)/$', views.whatNeighborhood, name='whatNeighborhood-apartment-test-for-danny-chi'),
    url(r'^chicago/visualizations/apartment-test-for-danny-chi/exactLocation/(?P<id>\d+)/$', views.exactLocation, name='exactLocation-apartment-test-for-danny-chi'),
    url(r'^chicago/visualizations/apartment-test-for-danny-chi/yearMoved/(?P<id>\d+)/$', views.yearMoved, name='yearMoved-apartment-test-for-danny-chi'),
    url(r'^chicago/visualizations/apartment-test-for-danny-chi/bedrooms/(?P<id>\d+)/$', views.bedrooms, name='bedrooms-apartment-test-for-danny-chi'),
    url(r'^chicago/visualizations/apartment-test-for-danny-chi/rentSplit/(?P<id>\d+)/$', views.rentSplit, name='rentSplit-apartment-test-for-danny-chi'),
    url(r'^chicago/visualizations/apartment-test-for-danny-chi/iPaid/(?P<id>\d+)/$', views.iPaid, name='iPaid-apartment-test-for-danny-chi'),
    url(r'^chicago/visualizations/apartment-test-for-danny-chi/allPaid/(?P<id>\d+)/$', views.allPaid, name='allPaid-apartment-test-for-danny-chi'),
    url(r'^chicago/visualizations/apartment-test-for-danny-chi/calc/(?P<id>\d+)/$', views.calc, name='calc-apartment-test-for-danny-chi'),
    url(r'^chicago/visualizations/apartment-test-for-danny-chi/end/(?P<id>\d+)/$', views.end, name='end-apartment-test-for-danny-chi'),
    url(r'^chicago/visualizations/apartment-test-for-danny-chi/results/(?P<id>\d+)/$', views.results, name='results-apartment-test-for-danny-chi'),
    url(r'^chicago/visualizations/apartment-test-for-danny-chi/rawdataapi/$', views.rawdataapi, name='rawdataapi-apartment-test-for-danny-chi'),
    url(r'^chicago/visualizations/apartment-test-for-danny-chi/rawdatacsv/$', views.rawdatacsv, name='rawdatacsv-apartment-test-for-danny-chi'),
    url(r'^chicago/visualizations/apartment-test-for-danny-chi/summarydataapi/$', views.summarydataapi, name='summarydataapi-apartment-test-for-danny-chi'),

]




