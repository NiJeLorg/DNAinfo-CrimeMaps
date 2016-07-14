from django.conf import settings
from django.conf.urls import include, url, patterns
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    # Examples:
    # url(r'^$', 'dnainfo.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
	url(r'^', include('crimemaps.urls')),
	url(r'^', include('apartment.urls')),
	url(r'^', include('apartment_chi.urls')),
	url(r'^', include('skyline.urls')),
    url(r'^', include('draw_redux.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^select2/', include('django_select2.urls')),
    url(r'^accounts/', include('allauth.urls')),
]

urlpatterns += staticfiles_urlpatterns()

if settings.DEBUG:
    urlpatterns += patterns(
        'django.views.static',
        (r'media/(?P<path>.*)',
        'serve',
        {'document_root': settings.MEDIA_ROOT}), )
