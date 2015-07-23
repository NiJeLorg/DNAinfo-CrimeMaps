from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    # Examples:
    # url(r'^$', 'dnainfo.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
	url(r'^', include('crimemaps.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^select2/', include('django_select2.urls')),
]
