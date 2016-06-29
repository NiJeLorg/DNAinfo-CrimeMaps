from django.db import models
from django import forms

# import all models
from draw_redux.models import *

#add select 2
from django_select2 import *

# skyline forms below
class NYCwhatNeighborhoodForm(forms.ModelForm):
    class Meta:
        model = NYCInOrOut
        fields = ('whatNeighborhood', )
        widgets = {
            'whatNeighborhood': widgets.Select2Widget(),
        }

class NYCinOrOutForm(forms.ModelForm):
    class Meta:
        model = NYCInOrOut
        fields = ('inOrOut', )



