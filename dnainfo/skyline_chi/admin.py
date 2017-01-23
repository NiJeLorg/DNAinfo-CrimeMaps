from django.contrib import admin

# Register your models here.
from skyline_chi.models import *

admin.site.register(neighborhoodCHI)
admin.site.register(CHIskyline)
admin.site.register(CHISponsoredBuildings)
admin.site.register(CHIReporterBuildings)
admin.site.register(CHI_Building_Permits_Old)
admin.site.register(CHI_Building_Permits_New)
