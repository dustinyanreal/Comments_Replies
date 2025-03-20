# Comments & Reply
This project involved designing and building a comment system using a tech stack that included React, Django REST framework, and PostgreSQL. The goal was to replicate the functionality and user experience of YouTube's comment section.

## Setup
```bash
git clone https://github.com/dustinyanreal/Comments_Replies.git
cd Comments_Replies
```
Inside the Comments_Replies folder, you will find a requirements.txt for pip installation

**To install dependencies using requirements.txt with pip**
```bash
pip install -r requirements.txt
```

**To set up frontend**
```bash
cd frontend
npm install
npm run dev
```

**To set up backend**
```bash
cd backend
```
In the backend, a .env is used to connect to postgreSQL. Make a new file called ```.env``` and input a username and password:
```bash
POSTGRESQL_USR = ''
POSTGRESQL_PWD = ''
```
```bash
python manage.py runserver
```

Once the application is up and running, you can navigate to localhost:5173 to interact with the comment section!
