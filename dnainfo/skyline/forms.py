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

class NYCapproveForm(forms.ModelForm):
    class Meta:
        model = NYCskyline
        fields = ('approved', )


class NYCwhatNeighborhoodSponsoredForm(forms.ModelForm):
    class Meta:
        model = NYCSponsoredBuildings
        fields = ('whereBuilding',)
        widgets = {
            'whereBuilding': widgets.Select2Widget(),
        }

class NYCbuildingHeightSponsoredForm(forms.ModelForm):
    class Meta:
        model = NYCSponsoredBuildings
        fields = ('buildingName', 'buildingAddress', 'buildingStories', 'buildingText', 'buildingImage', )
        labels = {
            'buildingName': 'What is the name of this building?',
            'buildingAddress': 'What is the full address of this building?',
            'buildingStories': 'How many stories tall is this building?',
            'buildingText': 'Please add a brief description for marketing purposes.',
            'buildingImage': 'Please add an image of this building.',
        }


class NYCexactLocationSponsoredForm(forms.ModelForm):
    class Meta:
        model = NYCSponsoredBuildings
        fields = ('buildingFootprint', )

class NYCremoveSponsoredForm(forms.ModelForm):
    class Meta:
        model = NYCSponsoredBuildings
        fields = ('buildingName', )

