from django.db import models
from django import forms

# import all crimemaps models
from crimemaps.models import *

#add select 2
from django_select2 import *

# crimemaps forms below

YEAR_CHOICES = (
    ('0', 'Less than 1 year'),
    ('1', '1 year'),
    ('2', '2 years'),
    ('3', '3 years'),
    ('4', '4 years'),
    ('5', '5 - 10 years'),
    ('10', '10 - 15 years'),
    ('15', '15 - 20 years'),
    ('20', '20 - 25 years'),
    ('25', '25 - 30 years'),
    ('30', '30 - 35 years'),
    ('35', '35 - 40 years'),
    ('40', '40 - 45 years'),
    ('45', '45 - 50 years'),
    ('50', '50 - 55 years'),
    ('55', '55 - 60 years'),
    ('60', '60 - 65 years'),
    ('65', '65 - 70 years'),
    ('70', '70 - 75 years'),
    ('75', '75 - 80 years'),
    ('80', '80 - 85 years'),
    ('85', '85 - 90 years'),
    ('90', '90 - 95 years'),
    ('95', '95 - 100 years'),
    ('100', 'More than 100 years'),
)

TRAINS_CHI = (
    ('Red Line', 'Red Line'),
    ('Blue Line', 'Blue Line'),
    ('Green Line', 'Green Line'),
    ('Yellow Line', 'Yellow Line'),
    ('Orange Line', 'Orange Line'),
    ('Brown Line', 'Brown Line'),
    ('Purple Line', 'Purple Line'),
    ('Pink Line', 'Pink Line'),
)

WHEN_RIDE = (
    ('Midnight to 7 a.m.', 'Midnight to 7 a.m.'),
    ('7 a.m. to 10 a.m.', '7 a.m. to 10 a.m.'),
    ('10 a.m. to 4 p.m.', '10 a.m. to 4 p.m.'),
    ('4 p.m. to 7 p.m.', '4 p.m. to 7 p.m.'),
    ('7 p.m. to Midnight', '7 p.m. to Midnight'),
)

HOW_LONG_RIDE = (
    ('1 - 3 Stops', '1 - 3 Stops'),
    ('4 - 7 Stops', '4 - 7 Stops'),
    ('8 or More Stops', '8 or More Stops'),
)



class nycNeighDrawForm(forms.ModelForm):
    yearsLived = forms.ChoiceField(choices=YEAR_CHOICES, label="How long have you lived in this neighborhood?")

    class Meta:
        model = neighborhoodDrawNYC
        fields = ('neighborhoodLive', 'otherNeighborhood', 'yearsLived')
        labels = {
            'neighborhoodLive': 'Choose your neighborhood. (Select "OTHER" if you can\'t find it in the list.)',
            'otherNeighborhood': 'Type in your neighborhood here if it\'s not in the list above',
        }
        widgets = {
            'neighborhoodLive': widgets.Select2Widget(),
        }

class chiNeighDrawForm(forms.ModelForm):
    yearsLived = forms.ChoiceField(choices=YEAR_CHOICES, label="How long have you lived in this neighborhood?")

    class Meta:
        model = neighborhoodDrawCHI
        fields = ('neighborhoodLive', 'otherNeighborhood', 'yearsLived')
        labels = {
            'neighborhoodLive': 'Choose your neighborhood. (Select "OTHER" if you can\'t find it in the list.)',
            'otherNeighborhood': 'Type in your neighborhood here if it\'s not in the list above',
        }
        widgets = {
            'neighborhoodLive': widgets.Select2Widget(),
        }



class nycNeighViewForm(forms.ModelForm):

    class Meta:
        model = neighborhoodDrawNYC
        fields = ('neighborhoodLive', )
        labels = {
            'neighborhoodLive': '',
        }
        widgets = {
            'neighborhoodLive': widgets.Select2Widget(),
        }
        

class chiNeighViewForm(forms.ModelForm):

    class Meta:
        model = neighborhoodDrawCHI
        fields = ('neighborhoodLive', )
        labels = {
            'neighborhoodLive': '',
        }
        widgets = {
            'neighborhoodLive': widgets.Select2Widget(),
        }
        

class CHITrainLineForm(forms.ModelForm):
    train = forms.ChoiceField(choices=TRAINS_CHI, label="", widget=forms.widgets.RadioSelect)

    class Meta:
        model = CHItrainSitStand
        fields = ('train', )


class CHITrainTimeForm(forms.ModelForm):
    rideTime= forms.ChoiceField(choices=WHEN_RIDE, label="", widget=forms.widgets.RadioSelect)

    class Meta:
        model = CHItrainSitStand
        fields = ('rideTime', )


class CHITrainLengthForm(forms.ModelForm):
    rideLength= forms.ChoiceField(choices=HOW_LONG_RIDE, label="", widget=forms.widgets.RadioSelect)

    class Meta:
        model = CHItrainSitStand
        fields = ('rideLength', )


class CHITrainEmptyTrainForm(forms.ModelForm):
    class Meta:
        model = CHItrainSitStand
        fields = ('positionOne', 'positionOneType', )

class CHITrainHalfFullTrainForm(forms.ModelForm):
    class Meta:
        model = CHItrainSitStand
        fields = ('positionTwo', 'positionTwoType', )

class CHITrainFullTrainForm(forms.ModelForm):
    class Meta:
        model = CHItrainSitStand
        fields = ('positionThree', 'positionThreeType', )
