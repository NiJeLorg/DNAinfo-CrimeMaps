from django.contrib import admin

# Register your models here.
from skyline.models import *

admin.site.register(NYCskyline)
admin.site.register(NYCSponsoredBuildings)
admin.site.register(NYCReporterBuildings)
admin.site.register(NYC_DOB_Permit_Issuance)

