from django.db import models
from django import forms

# import all crimemaps models
from apartment.models import *

#add select 2
from django_select2.forms import Select2Widget

# apartment forms below
class NYCfirstMoveForm(forms.ModelForm):
    class Meta:
        model = NYCmyFirstApartment
        fields = ('whenMoved',)

class NYCwhatNeighborhoodForm(forms.ModelForm):
    class Meta:
        model = NYCmyFirstApartment
        fields = ('whereMoved', 'iDontSeeMyNeighborhood',)
        widgets = {
            'whereMoved': Select2Widget,
        }

class NYCexactLocationForm(forms.ModelForm):
    class Meta:
        model = NYCmyFirstApartment
        fields = ('firstApartmentLocation',)

class NYCyearMovedForm(forms.ModelForm):
    class Meta:
        model = NYCmyFirstApartment
        fields = ('exactYearMoved',)

class NYCbedroomsForm(forms.ModelForm):
    class Meta:
        model = NYCmyFirstApartment
        fields = ('bedrooms',)

class NYCrentSplitForm(forms.ModelForm):
    class Meta:
        model = NYCmyFirstApartment
        fields = ('rentSplit',)

class NYCiPaidForm(forms.ModelForm):
    class Meta:
        model = NYCmyFirstApartment
        fields = ('iPaid',)

class NYCallPaidForm(forms.ModelForm):
    class Meta:
        model = NYCmyFirstApartment
        fields = ('allPaid',)

