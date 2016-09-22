from django.db import models
from django import forms

# import all models
from skyline.models import *

#add select 2
from django_select2.forms import Select2Widget

# skyline forms below
class NYCwhatNeighborhoodForm(forms.ModelForm):
    class Meta:
        model = NYCskyline
        fields = ('whereBuilding', 'iDontSeeMyNeighborhood',)
        widgets = {
            'whereBuilding': Select2Widget,
        }

class NYCbuildingHeightForm(forms.ModelForm):
    class Meta:
        model = NYCskyline
        fields = ('buildingStories', )

class NYCexactLocationForm(forms.ModelForm):
    class Meta:
        model = NYCskyline
        fields = ('buildingFootprint', 'buildingAddress', 'buildingBBL', )

class NYCapproveForm(forms.ModelForm):
    class Meta:
        model = NYCskyline
        fields = ('approved', )


class NYCwhatNeighborhoodSponsoredForm(forms.ModelForm):
    class Meta:
        model = NYCSponsoredBuildings
        fields = ('whereBuilding',)
        widgets = {
            'whereBuilding': Select2Widget,
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


class NYCwhatNeighborhoodReporterForm(forms.ModelForm):
    class Meta:
        model = NYCReporterBuildings
        fields = ('whereBuilding', )
        widgets = {
            'whereBuilding': Select2Widget,
        }

class NYCbuildingHeightReporterForm(forms.ModelForm):
    class Meta:
        model = NYCReporterBuildings
        fields = ('buildingStories',)

class NYCexactLocationReporterForm(forms.ModelForm):
    class Meta:
        model = NYCReporterBuildings
        fields = ('buildingFootprint', 'buildingAddress', 'buildingBBL', )

class NYCremoveReporterForm(forms.ModelForm):
    class Meta:
        model = NYCReporterBuildings
        fields = ('buildingStories', )
