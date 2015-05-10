from django.conf.urls import include, url
from crimemaps import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^compstat/$', views.compstatPage, name='compstat'),
    url(r'^compstatapi/$', views.compstatApi, name='compstatApi'),
    url(r'^doitt/$', views.doittPage, name='doitt'),
    url(r'^doittapi/$', views.doittApi, name='doittApi'),
    url(r'^blotter/$', views.blotterPage, name='blotter'),
    url(r'^blotterapi/$', views.blotterApi, name='blotterApi'),
]
