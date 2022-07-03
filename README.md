Sky360 Tracking Webapp

// Work in Progress. Once the basic setup is made, will make into a docker image. Contains false placeholder data for now and an sqlite db. 


============================================
Python/Django section(python version 3.9.2)
============================================

1. Download code to your desktop into a folder. 
Name that folder whatever you want. 
On command line cd into that folder. 
Create a virtual env for that folder. https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/development_environment#using_django_inside_a_python_virtual_environment 
2. Run "pip install -r requirements.txt" in command line to install pip libraries. 
If "neo4j-driver==4.4.1" fails, you might need to install "neo4j-driver==4.3.6" instead by adding it to the requirements.txt file or by running pip install.
3. Type in on command line "python3 manage.py runserver" (or whatever python command your version of python uses). 
Some use 'python' and some use 'py'. The first time you do this, you may be prompted to create a username and password from the command line. 
Alternatively, the username might already be 'username' and the password might be 'password' or '123456789'. You can reset this in the admin page (see below).
If the password/username are already set, then go to localhost:8000/admin and type 'username' as the username and 'password' as the password.
4. Open your web browser and go to the following links.


Sample Home Page:

localhost:8000 or 
http://localhost:8000/stationdata/


Sample Admin Page:

http://localhost:8000/admin/
username = "username", password = "password" until/unless you change it


============================================
Node.js site (node version v16.14.0)
============================================
1. in command line in the front end folder type "npm install *"
2. in command line type "npm start" from the frontend folder.
3. in your web browser go to http://localhost:3000/


============================================
Neo4j Installation
============================================
Problem with package "django_neomodel", you may have to first install libgeos-dev --> "sudo apt-get install libgeos-dev" and then run "pip3 install django_neomodel".

Problem with package "neomodel", you may have to install libgeos-dev --> "sudo apt-get install libgeos-dev" and then run "pip3 install neomodel"


============================================
Postgres and Postgis Installation
============================================
To add PostGIS, you'll need to install additional programs in addition to libgeos-dev -->  
"sudo apt-get install binutils libproj-dev gdal-bin".  
This is required for raster support.  
https://docs.djangoproject.com/en/4.0/ref/contrib/gis/install/geolibs/#geosbuild

To run postgres, you'll need this on your computer:"sudo apt-get install postgresql postgresql-contrib" and "sudo apt-get install libpq-dev python3-dev".

Add postgis: "sudo apt-get install postgis" https://postgis.net/docs/postgis_installation.html#install_requirements

To Create DB and add Postgis extension from command line "sudo -u postgres psql" then follow instructions on: https://djangocentral.com/using-postgresql-with-django/ and http://bostongis.com/?content_name=postgis_tut01

Then run "pip install psycopg2" in your virtual env where you have your specific django app. 
To build postgres db https://djangocentral.com/using-postgresql-with-django/

To access postgres on command line: "sudo -u postgres psql"



============================================
Style Guide for Python: https://peps.python.org/pep-0008/
Linting: pylint https://pylint.org/


============================================
TODO 7-1-2022
============================================
-Store map tiles for weather app in postgis db, create db, create connection. create correct path of db storage in portable drive/flash drive. https://djangocentral.com/using-postgresql-with-django/ and http://bostongis.com/?content_name=postgis_tut01

-Lint js files! Python linting (spaces instead of tabs)

-Continue CSS/bootstrap work.

-Add 1/30th ffs for camera, etc. Completed, but add 1/60th time?

-Create page within page for various graphs/map views. Wit-motion using highcharts possibly? 
https://www.highcharts.com/demo/line-ajax

-Put environment variables in seperate file. Does it matter since app is only for desktop?

-Add feature on admin page for users to add keys from various APIs. 
Users may be responsible for getting their own API keys where applicable. 
Openstreetmaps DOES NOT WANT THIS. 

-Db storage (neo4j and postgis) on portable drive.

-Add Camera feed and media player. Make media player draggable so north faces up. 
Add 10% playback speed. Change speed options to % rather than decimals. 
See if timer on player can include seconds.

-Add redux(?) and corresponding node files. Maybe use NATS for this also?

-Add Satellites (with GPS) and flightaware. Add ISS (completed).

-Add hourly update for weather map via a python backend chron job?

-Build sample Postgres database with Postgis add-on. To be continued... need to hook up django to db prgm on hard drive and put storage on external portable drive.

-Add Neo4j sample database and models file. 
https://neo4j.com/developer-blog/neo4j-for-django-developers/ 
An Object Graph Mapper (OGM) for the Neo4j graph database, built on the awesome neo4j_driver: https://neomodel.readthedocs.io/en/latest/index.html    
https://github.com/neo4j-contrib/django-neomodel.

-Add Dockerbuild: to include the above and pylint, pytest, eslint, mocha/chai. 
No need for webpack/babel since we're using evergreen browser.

-If you got this far, just for kicks: http://www.catb.org/~esr/faqs/hacker-howto.html


