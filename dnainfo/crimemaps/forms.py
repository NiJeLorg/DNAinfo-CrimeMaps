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




class nycNeighDrawForm(forms.ModelForm):
    yearsLived = forms.ChoiceField(choices=YEAR_CHOICES, label="How long have you lived in this neighborhood?")

    class Meta:
        model = neighborhoodDrawNYC
        fields = ('neighborhoodLive', 'otherNeighborhood', 'yearsLived')
        labels = {
            'neighborhoodLive': 'Deciding where one neighborhood ends and the next one begins is a debate as old as New York. So let\'s settle it once and for all: draw where you think your neighborhood outlines are. Don\'t see your neighborhood represented here? Type it in the field below and then click "Draw Your Neighborhood."',
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
            'neighborhoodLive': 'Deciding where one neighborhood ends and the next one begins is a debate as old as Chicago. So let\'s settle it once and for all: draw where you think your neighborhood outlines are. Don\'t see your neighborhood represented here? Pick "Other" from the menu, type it in the field below, and then click "Draw Your Neighborhood."',
            'otherNeighborhood': 'Type in your neighborhood here if it\'s not in the list above',
        }
        widgets = {
            'neighborhoodLive': widgets.Select2Widget(),
        }


