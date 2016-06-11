from django.db import models
from django import forms

# import all models
from skyline.models import *

#add select 2
from django_select2 import *

# skyline forms below
class NYCwhatNeighborhoodForm(forms.ModelForm):
    class Meta:
        model = NYCskyline
        fields = ('whereBuilding', 'iDontSeeMyNeighborhood',)
        widgets = {
            'whereBuilding': widgets.Select2Widget(),
        }

class NYCbuildingHeightForm(forms.ModelForm):
    class Meta:
        model = NYCskyline
        fields = ('buildingStories', )

class NYCexactLocationForm(forms.ModelForm):
    class Meta:
        model = NYCskyline
        fields = ('buildingFootprint', )


