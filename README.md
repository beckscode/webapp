# webapp
Sky360 Webapp

Work in Progress. Once the basic setup is made, will make into a docker image. Contains false placeholder data for now. 

1. Download to your desktop into a folder, name that folder whatever you want, and on command line cd into that folder. 
2. Type in on command line "python3 manage.py runserver" (or whatever python command your version of python uses). Some use 'python' and some use 'py'.
3. Open your web browser and go to the following links.



Sample Home Page:

localhost:8000 or 
http://localhost:8000/stationdata/


Sample Admin Page:

http://localhost:8000/admin/
set your own username and password on the command line

TODOS:
Add react redux(?) and corresponding node files
Add Postgres database with Postgis add-on
Add Redis store
Add Dockerbuild: to include the above and pylint, pytest, eslint, mocha/chai. No need for webpack/babel since we're using evergreen browser.
