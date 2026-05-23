# Devpulse Assignment-2

Devpulse Assignment-2 is a RESTful Issue Tracking API built with TypeScript, Express.js, PostgreSQL, and JWT Authentication.

Live URL:
https://dev-pulse-assignment-2.vercel.app

Interview Questions video URL:
https://app.usebubbles.com/uCt6xDpX9MucPJgzAoqWhP/recording-may-23-2026


# Features

- User Registration and Login
- JWT Authentication and Authorization
- Role-Based Access Control
- Create, Update, Delete Issues
- Get All Issues
- Get Single Issue
- Filtering and Sorting Support
- Global Error Handling
- PostgreSQL Database Integration
- TypeScript Support

---

# Tech Stack

- TypeScript
- Node.js
- Express.js
- PostgreSQL
- jsonwebtoken
- bcrypt
- dotenv

---

## Setup Steps

### 1. Clone Repository

```bash
git clone <your-repository-url>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment Variables

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

### 4. Run Development Server

```bash
npm run dev
```

---

## API Endpoint List

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register User |
| POST | `/api/auth/login` | Login User |
| POST | `/api/issues` | Create Issue |
| GET | `/api/issues` | Get All Issues |
| GET | `/api/issues/:id` | Get Single Issue |
| PATCH | `/api/issues/:id` | Update Issue |
| DELETE | `/api/issues/:id` | Delete Issue |

---

## Database Schema Summary

### Users Table

| Column | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| name | VARCHAR(255) |
| email | VARCHAR(255) UNIQUE |
| password | VARCHAR(255) |
| role | contributor / maintainer |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

### Issues Table

| Column | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| title | VARCHAR(150) |
| description | TEXT |
| type | bug / feature_request |
| status | open / in_progress / resolved |
| reporter_id | INTEGER |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |