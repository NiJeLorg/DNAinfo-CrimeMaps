import sys,os
from django.core.management.base import BaseCommand, CommandError
from crimemaps.models import *
import random


"""
  create dummy data for train data
"""
class Command(BaseCommand):
    
    def create_dummy_train_data(self):
        for x in xrange(500):
            m = NYCtrainSitStand()
            m.train = "1"
            m.positionOne = random.randint(1, 64)
            m.positionTwo = random.randint(1, 64)
            m.positionThree = random.randint(1, 64)
            m.save()

    def handle(self, *args, **options):
        print "Create Dummy Train Data...."
        self.create_dummy_train_data()




