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
Based off of the [workflow proposed by Vincent Driessen](http://nvie.com/posts/a-successful-git-branching-model/), we have two main branches -- `master` and `develop`, where `master` is "the main branch where the source code of HEAD always reflects a production-ready state." `Develop` is the "the main branch where the source code of HEAD always reflects a state with the latest delivered development changes for the next release."

Our workflow begins with deploying supporting branches off of `develop` for work, which may include branches for "hotfixes" (i.e. urgent bug fixing) or new features. 

###Feature Branches
When new feature development begins, create a branch off of `develop`:

    git checkout -b adding-new-feature develop

New feature branches can be named anything except for `master` or `develop`. Once you are done working on your new feature, commit your code and push your branch to the repo:

    git commit -m 'made some changes'
    git push

Once your branch is pushed up to the repo, navigate to the [pull request section on GitHub](https://github.com/NiJeLorg/DNAinfo-CrimeMaps/compare?expand=1) and [create a pull-request](https://help.github.com/articles/creating-a-pull-request/) from the base of `develop` to your feature branch. Write any comments that are relevant, tag users or reference issues.  

After the pull-request is submitted and the code is reviewed and approved, the feature branch will be merged into `develop`, and that feature branch will be closed. The can be doen on GitHub or via command line:

    git pull
    git checkout develop
    git merge --no-ff adding-new-feature
    git branch -d myfeature
    git push origin develop

When `develop` is ready to be merged into `master`, it can be merged either via a pull request on GitHub or merged via command line:

    git pull
    git checkout master
    git merge --no-ff develop
    git push origin master
    git checkout develop

