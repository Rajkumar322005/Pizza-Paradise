# User Management System

A complete backend system for user management built with Node.js, Express.js, and MongoDB.

## Features

- User Authentication (Sign Up, Sign In)
- JWT-based Authentication
- Role-based Authorization (Admin, User)
- User Management (CRUD operations)
- Password Hashing
- Input Validation
- Error Handling
- MongoDB Integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd user-management
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
NODE_ENV=development
```

## Usage

To start the server:

```bash
npm start
```

The server will start on the port specified in your .env file (default: 3000).

## API Endpoints

### Authentication

- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/signin` - Login user

### User Management

- GET `/api/users` - Get all users (Admin only)
- GET `/api/users/:id` - Get user by ID
- POST `/api/users` - Create a new user (Admin only)
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user (Admin only)

## Request & Response Examples

### Sign Up
```bash
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "phone": "1234567890"
}
```

### Sign In
```bash
POST /api/auth/signin
{
  "email": "john@example.com",
  "password": "123456"
}
```

### Create User (Admin only)
```bash
POST /api/users
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "123456",
  "phone": "0987654321",
  "role": "user"
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in case of failures:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control
- Input validation
- CORS enabled
- Environment variables for sensitive data

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 