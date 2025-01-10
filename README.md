# Expense Tracker API

A robust REST API for tracking personal expenses with spending limits. Built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **User Authentication**

  - Secure signup and login
  - JWT-based authentication
  - Role-based access control (Admin/User)

- **Expense Management**

  - Create, read, update, and delete expenses
  - Categorize expenses
  - Track expense purpose and date
  - Get daily expense totals
  - View category-wise expense breakdowns

- **Spending Limits**
  - Set spending limits by category
  - Period-based limits (Monthly/Weekly/Daily)
  - Automatic limit validation
  - Prevent exceeding spending limits
  - Active/Inactive limit status

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Zod (Validation)
- JWT (Authentication)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

### Using npm

```bash
# Clone the repository
git clone https://github.com/noyonalways/expense-tracker-api.git
cd expense-tracker-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# Edit DATABASE_URL, JWT_SECRET, etc.

# Build the project
npm run build

# Start development server
npm run dev

# Start production server
npm start
```

### Using yarn

```bash
# Clone the repository
git clone <repository-url>
cd expense-tracker-api

# Install dependencies
yarn install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# Edit DATABASE_URL, JWT_SECRET, etc.

# Build the project
yarn build

# Start development server
yarn dev

# Start production server
yarn start
```

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
```

## API Documentation

### Auth Routes

#### Register User

```http
POST /api/v1/auth/signup
```

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

Response:

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User

```http
POST /api/v1/auth/login
```

Request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "jwt-token",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Category Routes

#### Create Category

```http
POST /api/v1/categories
```

Request:

```json
{
  "name": "Food",
  "description": "Food and dining expenses"
}
```

Response:

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "category-id",
    "name": "Food",
    "description": "Food and dining expenses"
  }
}
```

#### Get All Categories

```http
GET /api/v1/categories
```

Response:

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "category-id",
      "name": "Food",
      "description": "Food and dining expenses"
    }
  ]
}
```

### Expense Routes

#### Create Expense

```http
POST /api/v1/expenses
```

Request:

```json
{
  "amount": 50,
  "category": "category-id",
  "purpose": "Lunch"
}
```

Response:

```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "id": "expense-id",
    "amount": 50,
    "category": {
      "id": "category-id",
      "name": "Food"
    },
    "purpose": "Lunch",
    "date": "2024-01-15T12:00:00Z"
  }
}
```

#### Get All Expenses

```http
GET /api/v1/expenses
```

Response:

```json
{
  "success": true,
  "message": "Expenses retrieved successfully",
  "data": {
    "data": [
      {
        "id": "expense-id",
        "amount": 50,
        "category": {
          "id": "category-id",
          "name": "Food"
        },
        "purpose": "Lunch",
        "date": "2024-01-15T12:00:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
}
```

#### Get Daily Total

```http
GET /api/v1/expenses/daily-total
```

Response:

```json
{
  "success": true,
  "message": "Daily total retrieved successfully",
  "data": {
    "total": 150,
    "categories": [
      {
        "categoryId": "category-id",
        "name": "Food",
        "total": 150,
        "expenses": [
          {
            "id": "expense-id",
            "amount": 50,
            "purpose": "Lunch",
            "date": "2024-01-15T12:00:00Z"
          }
        ]
      }
    ]
  }
}
```

#### Get Category Total

```http
GET /api/v1/expenses/category-total
```

Response:

```json
{
  "success": true,
  "message": "Category totals retrieved successfully",
  "data": {
    "total": 500,
    "categories": [
      {
        "categoryId": "category-id",
        "name": "Food",
        "total": 500,
        "expenses": [
          {
            "id": "expense-id",
            "amount": 500,
            "purpose": "Groceries",
            "date": "2024-01-15T12:00:00Z"
          }
        ]
      }
    ]
  }
}
```

### Spending Limit Routes

#### Create Spending Limit

```http
POST /api/v1/spending-limits
```

Request:

```json
{
  "category": "category-id",
  "amount": 1000,
  "period": "monthly"
}
```

Response:

```json
{
  "success": true,
  "message": "Spending limit created successfully",
  "data": {
    "id": "limit-id",
    "category": {
      "id": "category-id",
      "name": "Food"
    },
    "amount": 1000,
    "period": "monthly",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-31T23:59:59Z",
    "status": "active"
  }
}
```

#### Get All Spending Limits

```http
GET /api/v1/spending-limits
```

Response:

```json
{
  "success": true,
  "message": "Spending limits retrieved successfully",
  "data": {
    "data": [
      {
        "id": "limit-id",
        "category": {
          "id": "category-id",
          "name": "Food"
        },
        "amount": 1000,
        "period": "monthly",
        "startDate": "2024-01-01T00:00:00Z",
        "endDate": "2024-01-31T23:59:59Z",
        "status": "active"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errorMessages": [
    {
      "path": "field_name",
      "message": "Specific error message"
    }
  ]
}
```

Common HTTP Status Codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## License

MIT

## Author

Noyon Rahman
