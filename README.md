# TaskFlow Backend

REST API for the TaskFlow application built with Node.js, Express.js, MongoDB, and JWT Authentication.

## Features

* User Registration
* User Login
* JWT Authentication
* Create Tasks
* Update Tasks
* Delete Tasks (Soft Delete)
* Task Status Management
* Task Statistics
* Pagination Support
* Filter Tasks by Status
* Secure API Routes

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (JSON Web Token)
* bcryptjs
* dotenv
* cors

## Installation

```bash
git clone https://github.com/sahil-mane/taskflow-backend.git

cd taskflow-backend

npm install

npm run dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
```

## API Endpoints

### Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |

### Tasks

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | /api/tasks/createTask   |
| POST   | /api/tasks/getTasks     |
| GET    | /api/tasks/getTaskStats |
| PUT    | /api/tasks/updateTask   |
| PUT    | /api/tasks/deleteTask   |
| GET    | /api/tasks/getTaskStats |

## Project Structure

```text
src/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
└── server.js

```
## API Endpoints

### Authentication

#### Register User

**Endpoint**

```http
POST /api/auth/register
```

**Request Body**

```json
{
  "name": "abc abc",
  "email": "abc@gmail.com",
  "password": "123456"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "name": "abc abc",
      "email": "abc@gmail.com"
    }
  },
  "message": "User registered successfully"
}
```

---

#### Login User

**Endpoint**

```http
POST /api/auth/login
```

**Request Body**

```json
{
  "email": "abc@gmail.com",
  "password": "123456"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "name": "abc abc",
      "email": "abc@gmail.com"
    }
  },
  "message": "Login successful"
}
```

---

### Tasks

> All task routes require Authorization Token

#### Create Task

**Endpoint**

```http
POST /api/tasks/createTask
```

**Headers**

```http
Authorization: Bearer <token>
```

**Request Body**

```json
{
  "title": "Complete React Project",
  "description": "Finish TaskFlow dashboard",
  "status": "pending"
}
```

---

#### Get All Tasks

**Endpoint**

```http
POST /api/tasks/getAllTasks
```

**Headers**

```http
Authorization: Bearer <token>
```

**Request Body**

```json
{
  "page": 1,
  "limit": 10,
  "status": "all"
}
```

**Allowed Status Values**

```text
all
pending
in_progress
completed
```

---

#### Update Task

**Endpoint**

```http
PUT /api/tasks/updateTasks
```

**Headers**

```http
Authorization: Bearer <token>
```

**Request Body**

```json
{
  "taskIds": [
    "686c123456789abcdef12345"
  ],
  "title": "Updated Task",
  "description": "Updated Description",
  "status": "completed"
}
```

---

#### Delete Task

**Endpoint**

```http
PUT /api/tasks/deleteTasks
```

**Headers**

```http
Authorization: Bearer <token>
```

**Request Body**

```json
{
  "taskIds": [
    "686c123456789abcdef12345"
  ]
}
```

> Soft delete is used (`isDelete: true`).

---

#### Get Task Statistics

**Endpoint**

```http
GET /api/tasks/getTaskStats
```

**Headers**

```http
Authorization: Bearer <token>
```

**Response**

```json
{
  "total": 12,
  "pending": 4,
  "inProgress": 3,
  "completed": 5
}
```


## Author

Sahil Mane
