from django.db import models
from django import forms

# import all crimemaps models
from apartment_chi.models import *

#add select 2
from django_select2.forms import Select2Widget

# apartment forms below
class CHIfirstMoveForm(forms.ModelForm):
    class Meta:
        model = CHImyFirstApartment
        fields = ('whenMoved',)

class CHIwhatNeighborhoodForm(forms.ModelForm):
    class Meta:
        model = CHImyFirstApartment
        fields = ('whereMoved', 'iDontSeeMyNeighborhood',)
        widgets = {
            'whereMoved': Select2Widget,
        }

class CHIexactLocationForm(forms.ModelForm):
    class Meta:
        model = CHImyFirstApartment
        fields = ('firstApartmentLocation',)

class CHIyearMovedForm(forms.ModelForm):
    class Meta:
        model = CHImyFirstApartment
        fields = ('exactYearMoved',)

class CHIbedroomsForm(forms.ModelForm):
    class Meta:
        model = CHImyFirstApartment
        fields = ('bedrooms',)

class CHIrentSplitForm(forms.ModelForm):
    class Meta:
        model = CHImyFirstApartment
        fields = ('rentSplit',)

class CHIiPaidForm(forms.ModelForm):
    class Meta:
        model = CHImyFirstApartment
        fields = ('iPaid',)

class CHIallPaidForm(forms.ModelForm):
    class Meta:
        model = CHImyFirstApartment
        fields = ('allPaid',)

