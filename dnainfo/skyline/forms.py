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
        fields = ('projectName', 'buildingAddress', 'buildingStories', 'description', 'buildingImage', 'zoning_pdfs', 'story1', )
        labels = {
            'projectName': 'Please add a name for this project/building. (Optional)',
            'buildingAddress': 'Enter the address according to DNAinfo style such as 810 Seventh Ave., 47-01 111th St. or 1108 Cortelyou Road. (Required)',
            'buildingStories': 'How many stories tall is this building? (Required)',
            'description': 'Please add a brief description of the project. (Optional, 200 character limit)',
            'buildingImage': 'Please add any storytelling images like designs, photos, etc. (Optional)',
            'zoning_pdfs': 'Add any zoning diagrams other documents readers might want to examine. Zoning diagrams can be found in the <a href="http://a810-bisweb.nyc.gov/bisweb/bispi00.jsp" target="_blank">DOB building information search</a> system. (Optional)',
            'story1': 'Please add a link to a DNAinfo story. (Optional)',
        }

class NYCexactLocationReporterForm(forms.ModelForm):
    class Meta:
        model = NYCReporterBuildings
        fields = ('buildingFootprint', 'buildingBBL', )

class NYCremoveReporterForm(forms.ModelForm):
    class Meta:
        model = NYCReporterBuildings
        fields = ('buildingStories', )
