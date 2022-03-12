# webapp
Sky360 Webapp

Python section(python version 3.9.2)

Work in Progress. Once the basic setup is made, will make into a docker image. Contains false placeholder data for now. 

1. Download to your desktop into a folder, name that folder whatever you want, and on command line cd into that folder. 
2. Type in on command line "python3 manage.py runserver" (or whatever python command your version of python uses). Some use 'python' and some use 'py'. The first time you do this, you may be prompted to create a username and password. Alternatively, the username might already be 'username' and the password might be 'password' or '123456789'.
3. Open your web browser and go to the following links.



Sample Home Page:

localhost:8000 or 
http://localhost:8000/stationdata/


Sample Admin Page:

http://localhost:8000/admin/
set your own username and password on the command line

To run node site (node version v16.14.0):
1. in command line in the front end folder type "npm install *"
2. in command line type "npm start" from the frontend folder.
3. in your web browser go to http://localhost:3000/

Style Guide for Python: https://peps.python.org/pep-0008/
Linting: pylint https://pylint.org/

TODOS:
-Add react redux(?) and corresponding node files,
-Add Postgres database with Postgis add-on,
-Add Neo4j add-on, create sample database and models file. 
https://neo4j.com/developer-blog/neo4j-for-django-developers/ 
An Object Graph Mapper (OGM) for the Neo4j graph database, built on the awesome neo4j_driver: https://neomodel.readthedocs.io/en/latest/index.html    
https://github.com/neo4j-contrib/django-neomodel

-Add Redis store,
-Add Dockerbuild: to include the above and pylint, pytest, eslint, mocha/chai. No need for webpack/babel since we're using evergreen browser.
