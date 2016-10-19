# DNAinfo Interactive Projects
This repository houses code under development for DNAinfo interactive projects created by NiJeL. These tools were developed using the [Django Python Web framework](https://www.djangoproject.com/).

## Local Development Installation
Note: Do not use this workflow for deploying this tool to production, as this may introduce a number of security concerns. For more information on deploying Django in a production environment, please see the [Django deployment checklist](https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/)
To install these interactives on your local machine:
* [Clone this repository](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository#Cloning-an-Existing-Repository) to your local machine.
* In the directory where you placed the cloned repo, create a virtual environment for Python and project dependencies in a directory called "env":
```shell
pip install virtualenv 
virtualenv env
```
* Activate your virtual environment
```shell
source env/bin/activate
```
* Install Django and all required packages:
```shell
pip install -r requirements.txt
```
* In ```/dnainfo/dnainfo/``` make a copy of ```dummy_settings.py``` called ```settings.py```
* In ```settings.py```:
  * Add a ```SECRET_KEY``` of 50 randomly generated characters,
  * Replace default [database settings](https://docs.djangoproject.com/en/1.9/ref/settings/#databases) with preferred database settings (optional) 
  * Add email password to ```EMAIL_HOST_PASSWORD``` setting. Contact JD for email password if needed.
* Still in the virtual environment, navigate to ```/dnainfo/``` (you should see ```manage.py``` in there) and mirror database schema by running:
```shell
python manage.py migrate
```
* For the Skyline 3D project, you will need to run a few management commands to ingest New York City and Chicago neighborhood lists and permit data (this step may take a few hours):
```shell
python manage.py import_nyc_hoods_skyline
python manage.py pull_dob_permit_issuance
python manage.py building_height_dob_permit_link
python manage.py carto_dob_permit_geom_link
python manage.py scan_code_dob_permit_link
python manage.py zoning_pdf_dob_permit_link
python manage.py import_chi_hoods_skyline
python manage.py pull_chicago_dob_permits
python manage.py carto_chicago_dob_permit_geom_link

```
* Fire up your local webserver:
```shell
python manage.py runserver
```
* In a web browser, go to [localhost:8000](http://localhost:8000/), and you should see the development site! Please not that the terminal window you are running the development site in must stay open while you are using the site.
* When daily development is complete, terminate the local web server by typing ```CONTROL + C```. Also deactivate the virtual environment:
```shell
deactivate
```

## Django project in a local web server
Once installed, it's easy to fire up your local web server to view the development version of this site.
* Navigate to the directory where your virtual environment is installed.
* Activate your virtual environment
```shell
source env/bin/activate
```
* Navigate to ```/dnainfo/``` (again, you should see ```manage.py``` in there) 
* Fire up your local webserver:
```shell
python manage.py runserver
```
* In a web browser, go to [localhost:8000](http://localhost:8000/), and you should see the development site! 
* When daily development is complete, terminate the local web server by typing ```CONTROL + C```. Also deactivate the virtual environment:
```shell
deactivate
```

## Git workflow
The idea is for each person to work on their own branch and then merge changes into the master branch once they're ready to go. Our convention is to have individual development branches prefixed with `dev-` (such as `dev-jd`). The workflow below uses `dev-jd` as an example. 

After cloning the repo, create a branch with the name you're going to use (the second command makes a copy of the branch on GitHub and sets it up so that when you push from the local dev branch it will go to that new GitHub branch):

    git checkout -b dev-jd
    git push -u origin dev-jd

You only need to do that once. Then work on your dev branch and commit your changes normally:

    git commit -m 'made some changes'
    git push

When you're ready to merge your changes into master, first make sure your branch is up-to-date with master:

    git pull
    git merge origin/master

Hopefully there will be no conflicts. If there are, you'll have to resolve them and commit.

Then you can merge the changes into master:

    git checkout master
    git pull
    git merge dev-jd
    git push

Don't forget to return to your dev branch to continue work:

    git checkout dev-jd

