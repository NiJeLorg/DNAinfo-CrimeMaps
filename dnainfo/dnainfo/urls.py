from django.conf.urls import include, url
from django.contrib import admin

# for development, static and media files served from here
from django.conf import settings
from django.conf.urls.static import static

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

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)