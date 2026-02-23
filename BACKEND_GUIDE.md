# Backend API Implementation Guide

This document provides detailed instructions for implementing the backend APIs that support the Digital Health Insurance Platform UI.

## Database Schema (MySQL via phpMyAdmin)

### 1. Users Table

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  id_number VARCHAR(20) UNIQUE NOT NULL,
  plan_id INT NOT NULL,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);
```

### 2. Plans Table

```sql
CREATE TABLE plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price_per_day DECIMAL(10, 2) NOT NULL,
  coverage_amount INT NOT NULL,
  features JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Claims Table

```sql
CREATE TABLE claims (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  date_of_service DATE NOT NULL,
  provider_name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'paid') DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 4. Payments Table

```sql
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_reference VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  payment_method ENUM('m-pesa', 'card', 'bank') DEFAULT 'm-pesa',
  phone_number VARCHAR(20),
  mpesa_request_id VARCHAR(100),
  mpesa_checkout_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register

Register a new user.

**Request:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+254700000000",
  "password": "securePassword123",
  "idNumber": "12345678",
  "planId": 1
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+254700000000"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST /api/auth/login

Log in an existing user.

**Request:**

```json
{
  "phone": "+254700000000",
  "password": "securePassword123"
}
```

OR

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+254700000000",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (401):**

```json
{
  "success": false,
  "message": "Invalid email/phone or password"
}
```

### Claims Endpoints

#### GET /api/claims

Get all claims for authenticated user.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
[
  {
    "id": 1,
    "date": "2026-01-15",
    "provider": "Nairobi Hospital",
    "description": "General checkup and blood test",
    "amount": 5000,
    "status": "approved",
    "claimDate": "2026-01-15"
  },
  {
    "id": 2,
    "date": "2026-02-10",
    "provider": "City Clinic",
    "description": "Dental checkup",
    "amount": 2000,
    "status": "pending",
    "claimDate": "2026-02-10"
  }
]
```

#### POST /api/claims

File a new claim.

**Request:**

```json
{
  "date": "2026-02-15",
  "provider": "Nairobi Hospital",
  "description": "Emergency room visit",
  "amount": 8000
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Claim filed successfully",
  "claim": {
    "id": 3,
    "userId": 1,
    "date": "2026-02-15",
    "provider": "Nairobi Hospital",
    "description": "Emergency room visit",
    "amount": 8000,
    "status": "pending",
    "createdAt": "2026-02-17T10:00:00Z"
  }
}
```

### Payments Endpoints

#### GET /api/payments

Get all payments for authenticated user.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
[
  {
    "id": 1,
    "date": "2026-01-01",
    "amount": 1500,
    "reference": "PAY-20260101-001",
    "status": "completed",
    "method": "m-pesa",
    "phone": "+254700000000"
  },
  {
    "id": 2,
    "date": "2026-02-01",
    "amount": 1500,
    "reference": "PAY-20260201-001",
    "status": "pending",
    "method": "m-pesa",
    "phone": "+254700000000"
  }
]
```

#### POST /api/payments/stk-push

Initiate M-Pesa STK push for payment.

**Request:**

```json
{
  "amount": 1500,
  "phone": "+254700000000"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "STK push sent successfully",
  "payment": {
    "id": 3,
    "amount": 1500,
    "reference": "PAY-20260217-001",
    "status": "pending",
    "method": "m-pesa",
    "mpesaRequestId": "29115-46974142-1",
    "mpesaCheckoutId": "ws_CO_DMZ_12321312_2302202310100000",
    "createdAt": "2026-02-17T10:00:00Z"
  },
  "checkoutUrl": "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
}
```

#### POST /api/payments/mpesa-callback

M-Pesa callback webhook (called by Safaricom).

**Request (from Safaricom):**

```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "29115-46974142-1",
      "CheckoutRequestID": "ws_CO_DMZ_12321312_2302202310100000",
      "ResultCode": 0,
      "ResultDesc": "The service request has been processed successfully.",
      "CallbackMetadata": {
        "Item": [
          {
            "Name": "Amount",
            "Value": 1500
          },
          {
            "Name": "MpesaReceiptNumber",
            "Value": "SG453HFD345"
          },
          {
            "Name": "PhoneNumber",
            "Value": 254700000000
          },
          {
            "Name": "TransactionDate",
            "Value": 20260217101000
          }
        ]
      }
    }
  }
}
```

## Implementation Steps

### Step 1: Set Up Database

1. Open phpMyAdmin
2. Create a new database: `health_insurance_db`
3. Run the SQL scripts above to create all tables

### Step 2: Backend Setup (Node.js/Express Example)

```bash
npm init -y
npm install express mysql2 bcryptjs jsonwebtoken dotenv axios
```

### Step 3: Environment Variables (.env)

Your backend project should load configuration from a `.env` file. Install `dotenv` (already listed in the setup commands) and call `require('dotenv').config()` at the very top of your entry script (`backend/src/index.js` in the example below).

Create a file named `.env` at the root of the backend folder with the following content, adjusting values to match your local setup:

```
# server
PORT=5000

# mysql connection
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=health_insurance_db

# jwt secret used to sign/verify tokens; keep it long and random
JWT_SECRET=your_secret_key_here

# safaricom daraja credentials (for m-pesa integration)
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd
```

> **Security tip:** Add `.env` to your `.gitignore` so secrets never get committed to version control.

### Step 4: Middleware (Authentication)

Now implement JWT middleware to guard protected routes. The middleware checks for a bearer token in the `Authorization` header, verifies it with the secret, and attaches the decoded payload to `req.user`.

Example file located at `backend/src/middleware/jwtAuth.js`:

```js
const jwt = require("jsonwebtoken");

function jwtAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Malformed token" });
  }

  const token = parts[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Invalid or expired token" });
    req.user = decoded; // user info available to downstream handlers
    next();
  });
}

module.exports = jwtAuth;
```

Use it in your Express app (`backend/src/index.js`):

```js
require("dotenv").config();
const express = require("express");
const jwtAuth = require("./middleware/jwtAuth");

const app = express();
app.use(express.json());

app.get("/api/ping", (req, res) => res.json({ message: "pong" }));

// protected example
app.get("/api/protected", jwtAuth, (req, res) => {
  res.json({ message: "Hello " + req.user.email });
});

app.listen(process.env.PORT || 5000, () => console.log("Server running"));
```

When you sign tokens after registration or login, do something like:

```js
const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "7d" },
);
```

The frontend stores this token (e.g. `localStorage.setItem('token', token)`) and includes it on all API requests:

```js
fetch("/api/claims", { headers: { Authorization: `Bearer ${token}` } });
```

This combination of environment configuration and JWT middleware ensures secure and configurable authentication throughout your API.

### Step 5: M-Pesa Integration

- Register with Safaricom Daraja API
- Use the STK push endpoint to initiate payments
- Handle callbacks to update payment status

## Frontend to Backend Flow

1. **User Registration:** Frontend sends form data → Backend validates → Stores in database → Returns JWT token
2. **User Login:** Frontend sends credentials → Backend verifies → Returns JWT token + user data
3. **File Claim:** Frontend sends claim data + token → Backend validates token → Stores claim → Returns claim with ID
4. **View Claims:** Frontend sends GET request + token → Backend retrieves user's claims from database
5. **Make Payment:** Frontend sends amount + phone + token → Backend initiates STK push → M-Pesa sends prompt to user
6. **Payment Callback:** M-Pesa sends result → Backend updates payment status → Frontend can poll to confirm

## Testing Endpoints

Use tools like **Postman** or **VS Code REST Client** to test:

```http
### Register User
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+254700000000",
  "password": "securePassword123",
  "idNumber": "12345678",
  "planId": 1
}

### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "phone": "+254700000000",
  "password": "securePassword123"
}

### Get Claims
GET http://localhost:5000/api/claims
Authorization: Bearer YOUR_TOKEN

### File Claim
POST http://localhost:5000/api/claims
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "date": "2026-02-15",
  "provider": "Nairobi Hospital",
  "description": "Emergency room visit",
  "amount": 8000
}

### Get Payments
GET http://localhost:5000/api/payments
Authorization: Bearer YOUR_TOKEN

### STK Push
POST http://localhost:5000/api/payments/stk-push
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "amount": 1500,
  "phone": "+254700000000"
}
```

## Key UI Features Implemented

✅ **Login Page** - Phone/Email authentication  
✅ **Register Page** - Multi-step registration (already started)  
✅ **Dashboard** - User overview  
✅ **Claims Page** - File claims, view history with status badges  
✅ **Payments Page** - M-Pesa STK push, payment history

All pages include:

- Proper authentication (JWT token verification)
- Error handling with toast notifications
- Loading states
- Responsive design
- Status badges with icons

With these pieces in place, your backend is ready to securely handle authenticated requests. Let me know if you’d like help wiring up the actual login/register endpoints or integrating this with the frontend!
