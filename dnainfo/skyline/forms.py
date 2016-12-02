from django.db import models
from django import forms

# import all models
from skyline.models import *

#add select 2
from django_select2.forms import Select2Widget

#choices for imageDocOrURL
YES_NO = (
            (True, 'Upload an image or document showing or describing this building'),
            (False, 'Add this project\'s website'),
        )

# skyline forms below
class NYCwhatNeighborhoodForm(forms.ModelForm):
    class Meta:
        model = NYCskyline
        fields = ('whereBuilding',)
        widgets = {
            'whereBuilding': Select2Widget,
        }
        labels = {
            'whereBuilding': '',
        }

class NYCbuildingHeightForm(forms.ModelForm):
    class Meta:
        model = NYCskyline
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

class NYCexactLocationForm(forms.ModelForm):
    class Meta:
        model = NYCskyline
        fields = ('buildingFootprint', 'buildingAddress', 'buildingBBL', )
        labels = {
            'buildingFootprint': '',
            'buildingAddress': '',
            'buildingBBL': '',
        }


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
        labels = {
            'whereBuilding': '',
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
        labels = {
            'buildingFootprint': '',
        }


class NYCremoveSponsoredForm(forms.ModelForm):
    class Meta:
        model = NYCSponsoredBuildings
        fields = ('id', )
        labels = {
            'id': '',
        }


class NYCwhatNeighborhoodReporterForm(forms.ModelForm):
    class Meta:
        model = NYCReporterBuildings
        fields = ('whereBuilding', )
        widgets = {
            'whereBuilding': Select2Widget,
        }
        labels = {
            'whereBuilding': '',
        }


class NYCbuildingHeightReporterForm(forms.ModelForm):
    class Meta:
        model = NYCReporterBuildings
        fields = ('projectName', 'buildingAddress', 'buildingZip', 'buildingStories', 'description', 'buildingImage', 'zoning_pdfs', 'story1', )
        labels = {
            'projectName': 'Please add a name for this project/building. (Optional)',
            'buildingAddress': 'Enter the address according to DNAinfo style such as 810 Seventh Ave., 47-01 111th St. or 1108 Cortelyou Road. (Required)',
            'buildingZip': 'Enter the new building\'s zip code (Required)',
            'buildingStories': 'How many stories tall is this building? (Required)',
            'description': 'Please add a brief description of the project. (Optional, 200 character limit)',
            'buildingImage': 'Please add any storytelling images like designs, photos, etc. (Optional)',
            'zoning_pdfs': 'Please add any links to <a href="https://www.scribd.com/">Scribd</a> documents readers might want to examine here. Zoning diagrams can be found in the <a href="http://a810-bisweb.nyc.gov/bisweb/bispi00.jsp" target="_blank">DOB building information search</a> system. (Optional)',
            'story1': 'Please add a link to a DNAinfo story. (Optional)',
        }

class NYCexactLocationReporterForm(forms.ModelForm):
    class Meta:
        model = NYCReporterBuildings
        fields = ('buildingFootprint', 'buildingBBL', )
        labels = {
            'buildingFootprint': '',
            'buildingBBL': '',
        }

class NYCremoveReporterForm(forms.ModelForm):
    class Meta:
        model = NYCReporterBuildings
        fields = ('id', )
        labels = {
            'id': '',
        }


class NYC_DOB_Permit_IssuanceForm(forms.ModelForm):
    class Meta:
        model = NYC_DOB_Permit_Issuance
        fields = ('projectName', 'whereBuilding', 'buildingAddress', 'buildingZip', 'buildingStories', 'description', 'buildingImage', 'zoning_pdfs', 'story1', )
        labels = {
            'projectName': 'Please add a name for this project/building. (Optional)',
            'whereBuilding': 'Please select this building\'s neighborhood. (Required)',
            'buildingAddress': 'Enter the address according to DNAinfo style such as 810 Seventh Ave., 47-01 111th St. or 1108 Cortelyou Road. (Required)',
            'buildingZip': 'Enter the new building\'s zip code (Required)',
            'buildingStories': 'How many stories tall is this building? (Required)',
            'description': 'Please add a brief description of the project. (Optional, 200 character limit)',
            'buildingImage': 'Please add any storytelling images like designs, photos, etc. (Optional)',
            'zoning_pdfs': 'Please add any documents readers might want to examine here. Zoning diagrams can be found in the <a href="http://a810-bisweb.nyc.gov/bisweb/bispi00.jsp" target="_blank">DOB building information search</a> system. (Optional)',
            'story1': 'Please add a link to a DNAinfo story. (Optional)',
        }

class NYCwhatNeighborhoodPermittedForm(forms.ModelForm):
    class Meta:
        model = NYC_DOB_Permit_Issuance
        fields = ('whereBuilding', )
        widgets = {
            'whereBuilding': Select2Widget,
        }
        labels = {
            'whereBuilding': '',
        }


class NYCbuildingHeightAndPermittedForm(forms.ModelForm):
    class Meta:
        model = NYC_DOB_Permit_Issuance
        fields = ('projectName', 'buildingAddress', 'buildingZip', 'buildingStories', 'description', 'buildingImage', 'zoning_pdfs', 'story1', )
        labels = {
            'projectName': 'Please add a name for this project/building. (Optional)',
            'buildingAddress': 'Enter the address according to DNAinfo style such as 810 Seventh Ave., 47-01 111th St. or 1108 Cortelyou Road. (Required)',
            'buildingZip': 'Enter the new building\'s zip code (Required)',
            'buildingStories': 'How many stories tall is this building? (Required)',
            'description': 'Please add a brief description of the project. (Optional, 200 character limit)',
            'buildingImage': 'Please add any storytelling images like designs, photos, etc. (Optional)',
            'zoning_pdfs': 'Please add any documents readers might want to examine here. Zoning diagrams can be found in the <a href="http://a810-bisweb.nyc.gov/bisweb/bispi00.jsp" target="_blank">DOB building information search</a> system. (Optional)',
            'story1': 'Please add a link to a DNAinfo story. (Optional)',
        }

class NYCexactLocationPermittedForm(forms.ModelForm):
    class Meta:
        model = NYC_DOB_Permit_Issuance
        fields = ('buildingFootprint', 'buildingBBL', )
        labels = {
            'buildingFootprint': '',
            'buildingBBL': '',
        }


class NYClandingPageForm(forms.ModelForm):
    class Meta:
        model = NYCskyline
        fields = ('whereBuilding',)
        widgets = {
            'whereBuilding': Select2Widget,
        }
        labels = {
            'whereBuilding': '',
        }

