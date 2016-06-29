from django.conf.urls import include, url
from draw_redux import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^in-or-out/nyc/$', views.draw_redux_intro, name='draw_redux_intro'),
    url(r'^in-or-out/nyc/whatNeighborhood/$', views.draw_redux_whatNeighborhood, name='draw_redux_whatNeighborhood'),
    url(r'^in-or-out/nyc/whatNeighborhood/(?P<id>\d+)/$', views.draw_redux_whatNeighborhood, name='in_or_out_whatNeighborhood'),
    url(r'^in-or-out/nyc/pick/(?P<id>\d+)/$', views.draw_redux_pick, name='draw_redux_pick'),
    url(r'^in-or-out/nyc/getResult/(?P<id>\d+)/$', views.draw_redux_getResult, name='draw_redux_getResult'),
    url(r'^in-or-out/nyc/end/(?P<id>\d+)/$', views.draw_redux_end, name='draw_redux_end'),
    url(r'^in_or_out/nyc/results/(?P<id>\d+)/$', views.draw_redux_results, name='draw_redux_results'),

]


