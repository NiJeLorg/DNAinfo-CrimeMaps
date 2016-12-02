from django.db import models
from django import forms

# import all models
from skyline_chi.models import *

#add select 2
from django_select2.forms import Select2Widget

#choices for imageDocOrURL
YES_NO = (
            (True, 'Upload an image or document showing or describing this building'),
            (False, 'Add this project\'s website'),
        )


# skyline forms below
class CHIwhatNeighborhoodForm(forms.ModelForm):
    class Meta:
        model = CHIskyline
        fields = ('whereBuilding',)
        widgets = {
            'whereBuilding': Select2Widget,
        }
        labels = {
            'whereBuilding': '',
        }

class CHIbuildingHeightForm(forms.ModelForm):
    class Meta:
        model = CHIskyline
        fields = ('buildingStories', 'projectName', 'imageDocOrURL', 'buildingImage', 'buildingDoc', 'buildingURL', 'userEmail', 'newsletter',)
        labels = {
            'buildingStories': 'How many stories tall is this building? (Required)',
            'projectName': 'If this project has a name, what is it? (Optional)',
            'imageDocOrURL': 'Please provide some documentation that this building is real or in the works. One of these is required.',
            'buildingImage': 'Please upload an image of this building.',
            'buildingDoc': 'Please upload some documentation on this building.',
            'buildingURL': 'If this project has a website, what is it?',
            'userEmail': 'Give us your email, and we\'ll let you know when this building is approved to show on our map. (Optional)',
            'newsletter': '<strong>I\'d like to recieve the DNAinfo newsletter for this neighborhood.</strong>'
        }
        widgets = {
            'imageDocOrURL': forms.RadioSelect(choices=YES_NO),
        }

class CHIexactLocationForm(forms.ModelForm):
    class Meta:
        model = CHIskyline
        fields = ('buildingFootprint', 'buildingAddress', 'buildingPIN', )
        labels = {
            'buildingFootprint': '',
            'buildingAddress': '',
            'buildingPIN': '',
        }


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
        labels = {
            'whereBuilding': '',
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
        fields = ('id', )


class CHIwhatNeighborhoodReporterForm(forms.ModelForm):
    class Meta:
        model = CHIReporterBuildings
        fields = ('whereBuilding', )
        widgets = {
            'whereBuilding': Select2Widget,
        }
        labels = {
            'whereBuilding': '',
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
            'zoning_pdfs': 'Please add any links to <a href="https://www.scribd.com/">Scribd</a> documents readers might want to examine here. (Optional)',
            'story1': 'Please add a link to a DNAinfo story. (Optional)',
        }

class CHIexactLocationReporterForm(forms.ModelForm):
    class Meta:
        model = CHIReporterBuildings
        fields = ('buildingFootprint', 'buildingPIN', )
        labels = {
            'buildingFootprint': '',
            'buildingPIN': '',
        }

class CHIremoveReporterForm(forms.ModelForm):
    class Meta:
        model = CHIReporterBuildings
        fields = ('id', )
        labels = {
            'id': '',
        }

class CHI_Building_Permits_NewForm(forms.ModelForm):
    class Meta:
        model = CHI_Building_Permits_New
        fields = ('projectName', 'whereBuilding', 'buildingAddress', 'buildingStories', 'description', 'buildingImage', 'zoning_pdfs', 'story1', )
        labels = {
            'projectName': 'Please add a name for this project/building. (Optional)',
            'whereBuilding': 'Please select this building\'s neighborhood. (Required)',
            'buildingAddress': 'Enter the address according to DNAinfo style such as 233 N. Michigan Ave. or 2400 W. Cermak Road (Required)',
            'buildingStories': 'How many stories tall is this building? (Required)',
            'description': 'Please add a brief description of the project. (Optional, 200 character limit)',
            'buildingImage': 'Please add any storytelling images like designs, photos, etc. (Optional)',
            'zoning_pdfs': 'Please add any links to <a href="https://www.scribd.com/">Scribd</a> documents readers might want to examine here. (Optional)',
            'story1': 'Please add a link to a DNAinfo story. (Optional)',
        }


class CHIwhatNeighborhoodPermittedForm(forms.ModelForm):
    class Meta:
        model = CHI_Building_Permits_New
        fields = ('whereBuilding', )
        widgets = {
            'whereBuilding': Select2Widget,
        }
        labels = {
            'whereBuilding': '',
        }

class CHIbuildingHeightAndPermittedForm(forms.ModelForm):
    class Meta:
        model = CHI_Building_Permits_New
        fields = ('projectName', 'buildingAddress', 'buildingStories', 'description', 'buildingImage', 'zoning_pdfs', 'story1', )
        labels = {
            'projectName': 'Please add a name for this project/building. (Optional)',
            'buildingAddress': 'Enter the address according to DNAinfo style such as 233 N. Michigan Ave. or 2400 W. Cermak Road (Required)',
            'buildingStories': 'How many stories tall is this building? (Required)',
            'description': 'Please add a brief description of the project. (Optional, 200 character limit)',
            'buildingImage': 'Please add any storytelling images like designs, photos, etc. (Optional)',
            'zoning_pdfs': 'Please add any links to <a href="https://www.scribd.com/">Scribd</a> documents readers might want to examine here. (Optional)',
            'story1': 'Please add a link to a DNAinfo story. (Optional)',
        }

class CHIexactLocationPermittedForm(forms.ModelForm):
    class Meta:
        model = CHI_Building_Permits_New
        fields = ('buildingFootprint', 'pin1', )
        labels = {
            'buildingFootprint': '',
            'pin1': '',
        }

class CHIlandingPageForm(forms.ModelForm):
    class Meta:
        model = CHIskyline
        fields = ('whereBuilding',)
        widgets = {
            'whereBuilding': Select2Widget,
        }
        labels = {
            'whereBuilding': '',
        }