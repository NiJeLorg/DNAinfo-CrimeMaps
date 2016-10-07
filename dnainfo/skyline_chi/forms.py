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
        fields = ('projectName', 'buildingAddress', 'buildingZip', 'buildingStories', 'description', 'buildingImage', 'zoning_pdfs', 'story1', )
        labels = {
            'projectName': 'Please add a name for this project/building. (Optional)',
            'buildingAddress': 'Enter the address according to DNAinfo style such as 233 N. Michigan Ave. or 2400 W. Cermak Road (Required)',
            'buildingZip': 'Enter the new building\'s zip code (Optional)',
            'buildingStories': 'How many stories tall is this building? (Required)',
            'description': 'Please add a brief description of the project. (Optional, 200 character limit)',
            'buildingImage': 'Please add any storytelling images like designs, photos, etc. (Optional)',
            'zoning_pdfs': 'Add any zoning diagrams other documents readers might want to examine. (Optional)',
            'story1': 'Please add a link to a DNAinfo story. (Optional)',
        }

class CHIexactLocationReporterForm(forms.ModelForm):
    class Meta:
        model = CHIReporterBuildings
        fields = ('buildingFootprint', 'buildingPIN', )

class CHIremoveReporterForm(forms.ModelForm):
    class Meta:
        model = CHIReporterBuildings
        fields = ('buildingStories', )
