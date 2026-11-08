# User Management REST API

A backend REST API built with **Node.js, Express.js, and MongoDB (Mongoose)**. It supports creating, reading, updating, and deleting users.

## Features

- Create a user with name and email (required), plus optional phone, age, and address.
- Get all users with pagination.
- Get one user by MongoDB ID.
- Update selected user fields.
- Delete a user.
- Input validation, duplicate-email protection, centralized error handling, security headers, request logging, and basic rate limiting.
- Ready-to-import Postman collection.

## Requirements

- Node.js 18 or later (LTS recommended)
- npm (installed with Node.js)
- MongoDB local server **or** a MongoDB Atlas database
- VS Code
- Postman

Check Node and npm in the VS Code terminal:

```bash
node -v
npm -v
```

## 1. Open the project in VS Code

1. Extract `user-management-api.zip`.
2. Open VS Code.
3. Select **File → Open Folder**.
4. Select the extracted `user-management-api` folder.
5. Open **Terminal → New Terminal**.
6. Confirm the terminal is in the project root (the folder containing `package.json`).

## 2. Install dependencies

```bash
npm install
```

## 3. Configure MongoDB

### Option A: MongoDB Atlas (cloud database)

1. Sign in at https://www.mongodb.com/atlas.
2. Create a free cluster (if available for your account/region).
3. Create a database user with a username and password.
4. In **Network Access**, add your current IP address. For temporary development only, you may allow access from `0.0.0.0/0`; restrict it again afterwards.
5. Open **Database → Connect → Drivers** and copy the Node.js connection string.
6. Replace `<password>` with the database user's password and add a database name, for example `user_management_db`.

Example:

```text
mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/user_management_db?retryWrites=true&w=majority
```

If your password contains special characters, URL-encode them before putting them in the connection string. Do not share your URI or commit it to GitHub.

### Option B: Local MongoDB

Install and start MongoDB Community Server, then use:

```text
mongodb://127.0.0.1:27017/user_management_db
```

## 4. Create your .env file

In the project root, make a copy of `.env.example` and name it `.env` (no `.txt` extension).

Example `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/user_management_db?retryWrites=true&w=majority
CLIENT_ORIGIN=*
```

Use your own Atlas URI, or the local URI if using local MongoDB. Keep `.env` private; it is excluded by `.gitignore`.

## 5. Start the server

Development mode (auto-restarts when files change):

```bash
npm run dev
```

Or normal mode:

```bash
npm start
```

Expected terminal messages include:

```text
MongoDB connected: ...
Server running: http://localhost:5000
Health check:   http://localhost:5000/api/health
```

Open `http://localhost:5000/api/health` in your browser. You should receive a JSON response confirming that the API is running.

## 6. API endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check server health |
| POST | `/api/users` | Create a user |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get one user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

### Create user — POST `/api/users`

In Postman choose **POST**, enter `http://localhost:5000/api/users`, then choose **Body → raw → JSON**:

```json
{
  "name": "Sai Nandan",
  "email": "sainandan@example.com",
  "phone": "9876543210",
  "age": 22,
  "address": "Hyderabad, Telangana"
}
```

Name and email are required. Email must be unique.

### Get all users — GET `/api/users`

Optional pagination:

```text
http://localhost:5000/api/users?page=1&limit=10
```

### Get one user — GET `/api/users/USER_ID`

Replace `USER_ID` with the `_id` returned by Create User.

### Update user — PUT `/api/users/USER_ID`

Choose **Body → raw → JSON**. You can send only the fields you want to change:

```json
{
  "name": "Sai Nandan Updated",
  "phone": "9999999999"
}
```

### Delete user — DELETE `/api/users/USER_ID`

Replace `USER_ID` with a real user ID. A successful response confirms deletion.

## 7. Test using the included Postman collection

1. Open Postman.
2. Click **Import**.
3. Select `postman/User-Management-API.postman_collection.json`.
4. Open the imported **User Management API** collection.
5. Run **Health Check**.
6. Run **Create User**. The collection automatically saves the returned `_id` as `userId`.
7. Run **Get All Users**, **Get User By ID**, **Update User**, and **Delete User** in that order.
8. The validation example demonstrates an invalid request.

Expected status codes:

| Scenario | Status |
|---|---:|
| User created | 201 |
| Users retrieved / user updated / deleted | 200 |
| Missing required fields or invalid ID | 400 |
| User not found / unknown route | 404 |
| Duplicate email | 409 |
| Unexpected server error | 500 |

Note: The Postman collection is provided for you to run. The endpoints are not claimed to have been tested against your own database environment.

## Project structure

```text
user-management-api/
├── postman/
│   └── User-Management-API.postman_collection.json
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── userController.js
│   ├── middleware/
│   │   └── errorMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── userRoutes.js
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Common issues

- **`node` is not recognized:** Install Node.js LTS, close and reopen VS Code, then run `node -v`.
- **MongoDB connection timeout / server selection error:** Check that the Atlas cluster is running, the URI is correct, the database user credentials are correct, and your IP is allowed in Network Access.
- **Authentication failed:** Check the Atlas database username/password. URL-encode special characters in the password.
- **Port already in use:** Change `PORT=5000` to another free port such as `5001` in `.env`, then restart.
- **Cannot find module:** Run `npm install` from the project root.

## Important

This is a learning/demo API. It does not include login, authentication, authorization, password storage, or role-based access. Do not expose it publicly or use it to store sensitive personal information without adding those protections.
