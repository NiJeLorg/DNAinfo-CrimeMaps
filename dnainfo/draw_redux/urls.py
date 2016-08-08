from django.conf.urls import include, url
from draw_redux import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^in-or-out/nyc/$', views.draw_redux_intro, name='draw_redux_intro'),
    url(r'^in-or-out/nyc/whatNeighborhood/$', views.draw_redux_whatNeighborhood, name='draw_redux_whatNeighborhood'),
    url(r'^in-or-out/nyc/whatNeighborhood/(?P<id>\d+)/$', views.draw_redux_whatNeighborhood, name='in_or_out_whatNeighborhood'),
    url(r'^in-or-out/nyc/pick/(?P<id>\d+)/$', views.draw_redux_pick, name='draw_redux_pick'),
    url(r'^in-or-out/nyc/getAdded/(?P<id>\d+)/$', views.draw_redux_getAdded, name='draw_redux_getAdded'),
    url(r'^in-or-out/nyc/getRemoved/(?P<id>\d+)/$', views.draw_redux_getRemoved, name='draw_redux_getRemoved'),
    url(r'^in-or-out/nyc/end/(?P<id>\d+)/$', views.draw_redux_end, name='draw_redux_end'),
    url(r'^in-or-out/nyc/results/(?P<id>\d+)/$', views.draw_redux_results, name='draw_redux_results'),
    # adding urls for NY and Chicago
   	url(r'^new-york/visualizations/in-or-out/nyc/$', views.draw_redux_intro, name='draw_redux_intro'),
    url(r'^new-york/visualizations/in-or-out/nyc/whatNeighborhood/$', views.draw_redux_whatNeighborhood, name='draw_redux_whatNeighborhood'),
    url(r'^new-york/visualizations/in-or-out/nyc/whatNeighborhood/(?P<id>\d+)/$', views.draw_redux_whatNeighborhood, name='in_or_out_whatNeighborhood'),
    url(r'^new-york/visualizations/in-or-out/nyc/pick/(?P<id>\d+)/$', views.draw_redux_pick, name='draw_redux_pick'),
    url(r'^new-york/visualizations/in-or-out/nyc/getAdded/(?P<id>\d+)/$', views.draw_redux_getAdded, name='draw_redux_getAdded'),
    url(r'^new-york/visualizations/in-or-out/nyc/getRemoved/(?P<id>\d+)/$', views.draw_redux_getRemoved, name='draw_redux_getRemoved'),
    url(r'^new-york/visualizations/in-or-out/nyc/end/(?P<id>\d+)/$', views.draw_redux_end, name='draw_redux_end'),
    url(r'^new-york/visualizations/in-or-out/nyc/results/(?P<id>\d+)/$', views.draw_redux_results, name='draw_redux_results'),

]


