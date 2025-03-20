# Comment System Application

A full-stack comment system application with a Django backend and React frontend that allows users to create, read, update, and delete comments and replies.

## Features

- View a list of comments with author information and timestamps
- Like comments
- Reply to comments
- View nested replies
- Edit and delete comments/replies
- Image support for comments
- Responsive design

## Tech Stack

### Backend
- Django (Python web framework)
- PostgreSQL database
- Django REST Framework for API endpoints

### Frontend
- React.js
- CSS for styling
- Fetch API for data communication

## API Endpoints

- `GET /api/comments/` - Get all comments
- `POST /api/comments/` - Create a new comment
- `GET /api/comments/<id>/` - Get a specific comment
- `PUT /api/comments/<id>/` - Update a comment
- `DELETE /api/comments/<id>/` - Delete a comment
- `POST /api/replies/` - Create a new reply
- `GET /api/comments/<comment_id>/replies/` - Get all replies for a comment
- `GET /api/replies/<id>/` - Get a specific reply
- `PUT /api/replies/<id>/` - Update a reply
- `DELETE /api/replies/<id>/` - Delete a reply

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
