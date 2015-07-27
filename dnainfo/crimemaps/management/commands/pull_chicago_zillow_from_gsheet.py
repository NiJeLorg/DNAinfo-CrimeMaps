import sys,os
from django.core.management.base import BaseCommand, CommandError
from crimemaps.models import *
import urllib, json

from operator import itemgetter, attrgetter


"""
  Loads zillow data from google spreadsheets API
"""
class Command(BaseCommand):

    def load_chizillow_data(self):
        key = '1ZhFYpQRQBfRsD2HXb9t7L8cb8gbJn-tYw4Qb6f2JLfI'
        base_url = 'https://spreadsheets.google.com/feeds/cells/'
        params = '/1/public/values?alt=json'

        url = base_url + key + params
        response = urllib.urlopen(url)
        returned_data = json.loads(response.read())
        datas = returned_data['feed']['entry']
        #datas = sorted(datas, key=lambda datas: datas['title']['$t'])
        count = 0
        updated_values = {}
        for counter, data in enumerate(datas):
            # read in data and add to titles table
            if counter <= 12:
                if count == 0:
                    zipcode = 'ZIP'
                elif count == 1:
                    neighborhoods_covered = data['gs$cell']['$t']
                elif count == 2:
                    population = data['gs$cell']['$t']
                elif count == 3:
                    pct_living_in_same_house = data['gs$cell']['$t']
                elif count == 4:
                    med_hh_income = data['gs$cell']['$t']
                elif count == 5:
                    pct_change_sq_ft = data['gs$cell']['$t']
                elif count == 6:
                    pct_homes_sold = data['gs$cell']['$t']
                elif count == 7:
                    pct_change_avg_rent = data['gs$cell']['$t']
                elif count == 8:
                    estimated_value_sq_ft = data['gs$cell']['$t']
                elif count == 9:
                    estimated_value_all_homes = data['gs$cell']['$t']
                elif count == 10:
                    avg_rent_sq_ft = data['gs$cell']['$t']
                elif count == 11:
                    med_list_price = data['gs$cell']['$t']
                elif count == 12:
                    med_sale_price = data['gs$cell']['$t']

                if count == 12:
                    # write to DB here
                    updated_values = {'neighborhoods_covered':neighborhoods_covered, 'population':population, 'pct_living_in_same_house':pct_living_in_same_house, 'med_hh_income':med_hh_income, 'pct_change_sq_ft':pct_change_sq_ft, 'pct_homes_sold':pct_homes_sold, 'pct_change_avg_rent':pct_change_avg_rent, 'estimated_value_sq_ft':estimated_value_sq_ft, 'estimated_value_all_homes':estimated_value_all_homes, 'avg_rent_sq_ft':avg_rent_sq_ft, 'med_list_price':med_list_price, 'med_sale_price':med_sale_price}

                    obj, created = CHIZillowTitles.objects.update_or_create(zipcode=zipcode, defaults=updated_values)

                    #set count = 0 again for next group
                    count = 0

                else:
                    #increment counter
                    count += 1

            # read in data and add to data table (i.e. counter is > 12)
            else:
                if count == 0:
                    zipcode = int(data['gs$cell']['numericValue'])
                elif count == 1:
                    neighborhoods_covered = data['gs$cell']['$t']
                elif count == 2:
                    if 'numericValue' in data['gs$cell']:
                        population = int(data['gs$cell']['numericValue'])
                    else: 
                        population is None
                elif count == 3:
                    if 'numericValue' in data['gs$cell']:
                        pct_living_in_same_house = float(data['gs$cell']['numericValue'])
                    else: 
                        pct_living_in_same_house is None
                    pct_living_in_same_house = data['gs$cell']['$t']
                elif count == 4:
                    med_hh_income = data['gs$cell']['$t']
                elif count == 5:
                    pct_change_sq_ft = data['gs$cell']['$t']
                elif count == 6:
                    pct_homes_sold = data['gs$cell']['$t']
                elif count == 7:
                    pct_change_avg_rent = data['gs$cell']['$t']
                elif count == 8:
                    estimated_value_sq_ft = data['gs$cell']['$t']
                elif count == 9:
                    estimated_value_all_homes = data['gs$cell']['$t']
                elif count == 10:
                    avg_rent_sq_ft = data['gs$cell']['$t']
                elif count == 11:
                    med_list_price = data['gs$cell']['$t']
                elif count == 12:
                    med_sale_price = data['gs$cell']['$t']

                updated_values = {'neighborhoods_covered':neighborhoods_covered, 'population':population, 'pct_living_in_same_house':pct_living_in_same_house, 'med_hh_income':med_hh_income, 'pct_change_sq_ft':pct_change_sq_ft, 'pct_homes_sold':pct_homes_sold, 'pct_change_avg_rent':pct_change_avg_rent, 'estimated_value_sq_ft':estimated_value_sq_ft, 'estimated_value_all_homes':estimated_value_all_homes, 'avg_rent_sq_ft':avg_rent_sq_ft, 'med_list_price':med_list_price, 'med_sale_price':med_sale_price}

                obj, created = CHIZillowTitles.objects.update_or_create(zipcode=zipcode, defaults=updated_values)


            if 'numericValue' in data['gs$cell']:
                print data['gs$cell']['numericValue']
            else: 
                print data['gs$cell']['$t']
            # Tanveer's spreadsheet has columns A - M (1 - 13); hardcoding this so he can change the column headings





    def handle(self, *args, **options):
        print "Loading Chicago Zillow Data...."
        self.load_chizillow_data()
        print "Done."
 



