from django.db import models
from django import forms

# import all models
from skyline_chi.models import *

#add select 2
from django_select2.forms import Select2Widget

# skyline forms below
class CHIwhatNeighborhoodForm(forms.ModelForm):
    class Meta:
        model = CHIskyline
        fields = ('whereBuilding', 'iDontSeeMyNeighborhood',)
        widgets = {
            'whereBuilding': Select2Widget,
        }

class CHIbuildingHeightForm(forms.ModelForm):
    class Meta:
        model = CHIskyline
        fields = ('buildingStories', )

class CHIexactLocationForm(forms.ModelForm):
    class Meta:
        model = CHIskyline
        fields = ('buildingFootprint', 'buildingAddress', 'buildingPIN', )

class CHIapproveForm(forms.ModelForm):
    class Meta:
        model = CHIskyline
        fields = ('approved', )


class CHIwhatNeighborhoodSponsoredForm(forms.ModelForm):
    class Meta:
        model = CHISponsoredBuildings
        fields = ('whereBuilding',)
        widgets = {
            'whereBuilding': Select2Widget,
        }

class CHIbuildingHeightSponsoredForm(forms.ModelForm):
    class Meta:
        model = CHISponsoredBuildings
        fields = ('buildingName', 'buildingAddress', 'buildingStories', 'buildingText', 'buildingImage', )
        labels = {
            'buildingName': 'What is the name of this building?',
            'buildingAddress': 'What is the full address of this building?',
            'buildingStories': 'How many stories tall is this building?',
            'buildingText': 'Please add a brief description for marketing purposes.',
            'buildingImage': 'Please add an image of this building.',
        }


class CHIexactLocationSponsoredForm(forms.ModelForm):
    class Meta:
        model = CHISponsoredBuildings
        fields = ('buildingFootprint', )

class CHIremoveSponsoredForm(forms.ModelForm):
    class Meta:
        model = CHISponsoredBuildings
        fields = ('buildingName', )


class CHIwhatNeighborhoodReporterForm(forms.ModelForm):
    class Meta:
        model = CHIReporterBuildings
        fields = ('whereBuilding', )
        widgets = {
            'whereBuilding': Select2Widget,
        }

class CHIbuildingHeightReporterForm(forms.ModelForm):
    class Meta:
        model = CHIReporterBuildings
        fields = ('buildingAddress', 'buildingStories', 'description', 'story1', 'story2', 'story3', )
        labels = {
            'buildingAddress': 'What is the address of this building?',
            'buildingStories': 'How many stories tall is this building?',
            'description': 'Please add a brief description.',
            'story1': 'Please add a link to a DNAinfo story.',
            'story2': 'Please add a link to a DNAinfo story.',
            'story3': 'Please add a link to a DNAinfo story.',
        }

class CHIexactLocationReporterForm(forms.ModelForm):
    class Meta:
        model = CHIReporterBuildings
        fields = ('buildingFootprint', 'buildingPIN', )

class CHIremoveReporterForm(forms.ModelForm):
    class Meta:
        model = CHIReporterBuildings
        fields = ('buildingStories', )
