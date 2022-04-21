# HARD: Hedging Agricultural Risk Dashboard

Open-source **[Dashboard](https://cse6242team45.github.io/)**. It provides an interactive dashboard for farmers and ranchers to gather comprehensive information on agricultural information, including geographic data visualization on yields, production, and sales for a vareity of crops. Using the data from the United States Department of Agriculture (USDA), it also provides price predictions to guide risk management and decision making for farmers and ranchers.

<br />

> Features

- Visualization of `crop production` on the geomap
- Visualization of `crop yields` on the geomap
- Visualization of `crop sales` on the geomap
- `Crop price prediction`
- `Data download` functionality

<br />

> Links

- 👉 [Background](https://cse6242team45.github.io/)
- 👉 [Video Demo](https://cse6242team45.github.io/)

<br />

## ✨ Implementation and Development

> Get the code

```bash
$ git clone https://github.com/CSE6242Team45/CSE6242Team45.github.io.git
$ cd CSE6242Team45.github.io.git
```
Make the desired modifications and host the code in your own git repo.


<br />

![Screen Capture.](https://user-images.githubusercontent.com/51070104/144363856-2b25a5be-a73e-4b80-aa8a-4ad7fc6e41ef.gif)

<br />

## ✨ How to use it

1. Set up the database
   - Download MySQL script file and data.zip file from database branch (directory)
   - Unzip data.zip into a folder called "data"
   - Put MySQL script file into "data" folder
   - If use MySQL Workbench:
      - Enable local_infile
```sql
SHOW GLOBAL VARIABLES LIKE 'local_infile';
SET GLOBAL local_infile = 'ON';
SHOW GLOBAL VARIABLES LIKE 'local_infile';
```
      - Run MySQL script file
      - Then the tables below will be created in a database called 'cs6440_sp22_team012'
      +-------------------------------+
      |     cs6440_sp22_team012       |
      +-------------------------------+
      | Appointments                  |
      | Careplans                     |
      | Conditions                    |
      | Encounters                    |
      | Medications                   |
      | Observations                  |
      | Patients                      |
      | Procedures                    |
      | Users                         |
      +-------------------------------+

2. Set up the app
   - Set up the vitual environment
      
```bash
$ # Get the code
$ git clone https://github.gatech.edu/gt-cs6440-hit-spring2022/Team-12-Connected-Patient-Experience.git
$ cd Team-12-Connected-Patient-Experience
$
$ # Virtualenv modules installation (Unix based systems)
$ venv env
$ source env/bin/activate
$
$ # Virtualenv modules installation (Windows based systems)
$ # virtualenv env
$ # .\env\Scripts\activate
$
$ # Install modules - MySQL Database
$ pip3 install -r requirements-mysql.txt
$
$ # OR with PostgreSQL connector
$ # pip install -r requirements-pgsql.txt
```
   - In apps/config.py, modify 'SQLALCHEMY_DATABASE_URI' according to your MySQL database parameters
      e.g., username, password
```python
class Config(object):

    basedir = os.path.abspath(os.path.dirname(__file__))

    # Set up the App SECRET_KEY
    SECRET_KEY = config('SECRET_KEY', default='S#perS3crEt_007')

    # This will create a file in <app> FOLDER
   # SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'db.sqlite3')
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://username:password@127.0.0.1:3306/cs6440_sp22_team012?charset=utf8mb4'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

```
- Run the app
```bash
$ # Set the FLASK_APP environment variable
$ (Unix/Mac) export FLASK_APP=run.py
$ (Windows) set FLASK_APP=run.py
$ (Powershell) $env:FLASK_APP = ".\run.py"
$
$ # Set up the DEBUG environment
$ # (Unix/Mac) export FLASK_ENV=development
$ # (Windows) set FLASK_ENV=development
$ # (Powershell) $env:FLASK_ENV = "development"
$
$ # Start the application (development mode)
$ # --host=0.0.0.0 - expose the app on all network interfaces (default 127.0.0.1)
$ # --port=5000    - specify the app port (default 5000)  
$ flask run --host=0.0.0.0 --port=5000
$
$ # Access the dashboard in browser: http://127.0.0.1:5000/
```

> Note: To use the app, please access the registration page and create a new user. After authentication, the app will unlock the private pages.

<br />

## ✨ Code-base structure

The project is coded using blueprints, app factory pattern, dual configuration profile (development and production), and an intuitive structure presented below:

```bash
< PROJECT ROOT >
   |
   |-- apps/
   |    |
   |    |-- home/                           # A simple app that serve HTML files
   |    |    |-- routes.py                  # Define app routes
   |    |
   |    |-- authentication/                 # Handles auth routes (login and register)
   |    |    |-- routes.py                  # Define authentication routes  
   |    |    |-- models.py                  # Defines models  
   |    |    |-- forms.py                   # Define auth forms (login and register) 
   |    |
   |    |-- static/
   |    |    |-- <css, JS, images>          # CSS files, Javascripts files
   |    |
   |    |-- templates/                      # Templates used to render pages
   |    |    |-- includes/                  # HTML chunks and components
   |    |    |    |-- navigation.html       # Top menu component
   |    |    |    |-- sidebar.html          # Sidebar component
   |    |    |    |-- footer.html           # App Footer
   |    |    |    |-- scripts.html          # Scripts common to all pages
   |    |    |
   |    |    |-- layouts/                   # Master pages
   |    |    |    |-- base-fullscreen.html  # Used by Authentication pages
   |    |    |    |-- base.html             # Used by common pages
   |    |    |
   |    |    |-- accounts/                  # Authentication pages
   |    |    |    |-- login.html            # Login page
   |    |    |    |-- register.html         # Register page
   |    |    |
   |    |    |-- home/                      # UI Kit Pages
   |    |         |-- index.html            # Index page
   |    |         |-- 404-page.html         # 404 page
   |    |         |-- *.html                # All other pages
   |    |    
   |  config.py                             # Set up the app
   |    __init__.py                         # Initialize the app
   |
   |-- requirements.txt                     # Development modules - SQLite storage
   |-- requirements-mysql.txt               # Production modules  - Mysql DMBS
   |-- requirements-pqsql.txt               # Production modules  - PostgreSql DMBS
   |
   |-- Dockerfile                           # Deployment
   |-- docker-compose.yml                   # Deployment
   |-- gunicorn-cfg.py                      # Deployment   
   |-- nginx                                # Deployment
   |    |-- appseed-app.conf                # Deployment 
   |
   |-- .env                                 # Inject Configuration via Environment
   |-- run.py                               # Start the app - WSGI gateway
   |
   |-- ************************************************************************
```

<br />

## ✨ Deployment

The app is provided with a basic configuration to be executed in [Docker](https://www.docker.com/), [Heroku](https://www.heroku.com/), [Gunicorn](https://gunicorn.org/), and [Waitress](https://docs.pylonsproject.org/projects/waitress/en/stable/).

### [Heroku](https://www.heroku.com/)
---

Steps to deploy on **Heroku**

- [Create a FREE account](https://signup.heroku.com/) on Heroku platform
- [Install the Heroku CLI](https://devcenter.heroku.com/articles/getting-started-with-python#set-up) that match your OS: Mac, Unix or Windows
- Open a terminal window and authenticate via `heroku login` command
- Clone the sources and push the project for LIVE deployment

```bash
$ # Clone the source code:
$ git clone https://github.com/app-generator/flask-adminator.git
$ cd flask-adminator
$
$ # Check Heroku CLI is installed
$ heroku -v
heroku/7.25.0 win32-x64 node-v12.13.0 # <-- All good
$
$ # Check Heroku CLI is installed
$ heroku login
$ # this commaond will open a browser window - click the login button (in browser)
$
$ # Create the Heroku project
$ heroku create
$
$ # Trigger the LIVE deploy
$ git push heroku master
$
$ # Open the LIVE app in browser
$ heroku open
```

<br />

### [Gunicorn](https://gunicorn.org/)
---

Gunicorn 'Green Unicorn' is a Python WSGI HTTP Server for UNIX.

> Install using pip

```bash
$ pip install gunicorn
```
> Start the app using gunicorn binary

```bash
$ gunicorn --bind 0.0.0.0:8001 run:app
Serving on http://localhost:8001
```

Visit `http://localhost:8001` in your browser. The app should be up & running.

<br />

### [Waitress](https://docs.pylonsproject.org/projects/waitress/en/stable/)
---

Waitress (Gunicorn equivalent for Windows) is meant to be a production-quality pure-Python WSGI server with very acceptable performance. It has no dependencies except ones that live in the Python standard library.

> Install using pip

```bash
$ pip install waitress
```
> Start the app using [waitress-serve](https://docs.pylonsproject.org/projects/waitress/en/stable/runner.html)

```bash
$ waitress-serve --port=8001 run:app
Serving on http://localhost:8001
```

Visit `http://localhost:8001` in your browser. The app should be up & running.

<br />

## ✨ Credits & Links

- [Flask Framework](https://www.palletsprojects.com/p/flask/) - The offcial website
- [Boilerplate Code](https://appseed.us/boilerplate-code) - Index provided by **AppSeed**
- [Boilerplate Code](https://github.com/app-generator/boilerplate-code) - Index published on Github

<br />

---
[Flask Dashboard](https://appseed.us/admin-dashboards/flask) Adminator - Provided by **AppSeed [App Generator](https://appseed.us/app-generator)**.
