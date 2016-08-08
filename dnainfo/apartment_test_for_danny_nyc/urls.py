from django.conf.urls import include, url
from apartment_test_for_danny_nyc import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^new-york/visualizations/apartment-test-for-danny-nyc/$', views.intro, name='intro-apartment-test-for-danny-nyc'),
    url(r'^new-york/visualizations/apartment-test-for-danny-nyc/firstMove/$', views.firstMove, name='firstMove-apartment-test-for-danny-nyc'),
    url(r'^new-york/visualizations/apartment-test-for-danny-nyc/firstMove/(?P<id>\d+)/$', views.firstMove, name='firstMove-apartment-test-for-danny-nyc'),
    url(r'^new-york/visualizations/apartment-test-for-danny-nyc/whatNeighborhood/(?P<id>\d+)/$', views.whatNeighborhood, name='whatNeighborhood-apartment-test-for-danny-nyc'),
    url(r'^new-york/visualizations/apartment-test-for-danny-nyc/exactLocation/(?P<id>\d+)/$', views.exactLocation, name='exactLocation-apartment-test-for-danny-nyc'),
    url(r'^new-york/visualizations/apartment-test-for-danny-nyc/yearMoved/(?P<id>\d+)/$', views.yearMoved, name='yearMoved-apartment-test-for-danny-nyc'),
    url(r'^new-york/visualizations/apartment-test-for-danny-nyc/bedrooms/(?P<id>\d+)/$', views.bedrooms, name='bedrooms-apartment-test-for-danny-nyc'),
    url(r'^new-york/visualizations/apartment-test-for-danny-nyc/rentSplit/(?P<id>\d+)/$', views.rentSplit, name='rentSplit-apartment-test-for-danny-nyc'),
    url(r'^new-york/visualizations/apartment-test-for-danny-nyc/iPaid/(?P<id>\d+)/$', views.iPaid, name='iPaid-apartment-test-for-danny-nyc'),
    url(r'^new-york/visualizations/apartment-test-for-danny-nyc/allPaid/(?P<id>\d+)/$', views.allPaid, name='allPaid-apartment-test-for-danny-nyc'),
    url(r'^new-york/visualizations/apartment-test-for-danny-nyc/calc/(?P<id>\d+)/$', views.calc, name='calc-apartment-test-for-danny-nyc'),
    url(r'^new-york/visualizations/apartment-test-for-danny-nyc/end/(?P<id>\d+)/$', views.end, name='end-apartment-test-for-danny-nyc'),
    url(r'^new-york/visualizations/apartment-test-for-danny-nyc/results/(?P<id>\d+)/$', views.results, name='results-apartment-test-for-danny-nyc'),
    url(r'^new-york/visualizations/apartment-test-for-danny-nyc/rawdataapi/$', views.rawdataapi, name='rawdataapi-apartment-test-for-danny-nyc'),
    url(r'^new-york/visualizations/apartment-test-for-danny-nyc/rawdatacsv/$', views.rawdatacsv, name='rawdatacsv-apartment-test-for-danny-nyc'),
    url(r'^new-york/visualizations/apartment-test-for-danny-nyc/summarydataapi/$', views.summarydataapi, name='summarydataapi-apartment-test-for-danny-nyc'),    

]


