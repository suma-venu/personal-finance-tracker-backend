# Personal Finance Tracker – Backend

## 1. Introduction of the Project

The Personal Finance Tracker backend is developed using Node.js and Express.js. It provides RESTful APIs to support the application's authentication, transaction management and monthly budget management features.

The backend communicates with the React frontend and uses MongoDB Atlas to store user information, financial transactions and budget records.

### Objectives

- Provide secure user registration and login.
- Manage income and expense transactions.
- Support transaction creation, retrieval, updating and deletion.
- Manage monthly budgets.
- Protect user-specific API routes.
- Store application data in MongoDB Atlas.

### Main Features

- User registration and login.
- Password hashing using bcryptjs.
- JWT-based authentication.
- Protected API routes.
- Transaction CRUD operations.
- Budget CRUD operations.
- MongoDB database integration.
- Request handling and JSON responses.
- Health-check endpoint.

---

## 2. Technology Stack and Reasons

| Technology | Purpose | Reason for Selection |
|---|---|---|
| Node.js | Backend runtime | Executes JavaScript on the server |
| Express.js 5 | API framework | Simplifies REST API development |
| MongoDB Atlas | Database | Cloud-hosted NoSQL database |
| Mongoose 9 | ODM | Provides schemas and database modelling |
| JSON Web Token | Authentication | Supports token-based authentication |
| bcryptjs | Password security | Hashes user passwords |
| dotenv | Configuration | Loads environment variables |
| CORS | API communication | Enables frontend-backend communication |
| Nodemon | Development tool | Automatically restarts the server during development |

### Why These Technologies?

**Node.js:** Allows JavaScript to be used for backend development.

**Express.js:** Provides routing and middleware functionality for handling API requests.

**MongoDB Atlas:** Stores user accounts, transactions and budgets in a cloud database.

**Mongoose:** Defines database schemas and simplifies database operations.

**JWT:** Provides authentication tokens for accessing protected routes.

**bcryptjs:** Helps protect user passwords through hashing.

**dotenv:** Keeps environment-specific configuration outside the application source code.

---

## 3. Backend Use Cases

### 3.1 User Registration

**Actor:** New user.

**Goal:** Create an account.

**Workflow:**
1. The frontend sends registration details to the backend.
2. The authentication controller processes the request.
3. The password is hashed using bcryptjs.
4. The user information is stored in MongoDB.
5. A response is returned to the frontend.

### 3.2 User Login

**Actor:** Existing user.

**Goal:** Authenticate and access the application.

**Workflow:**
1. The user submits email and password.
2. The backend retrieves the user record.
3. The submitted password is verified against the stored password hash.
4. JWT authentication is used to establish an authenticated session.

### 3.3 Transaction Management

**Actor:** Authenticated user.

**Goal:** Manage income and expense records.

**Workflow:**
1. The frontend submits transaction information.
2. Authentication middleware protects the transaction routes.
3. The transaction controller validates and processes the request.
4. MongoDB stores or updates the transaction.
5. The API returns the result to the frontend.

Supported operations:
- Create transaction.
- Retrieve transactions.
- Update transaction.
- Delete transaction.

### 3.4 Budget Management

**Actor:** Authenticated user.

**Goal:** Manage monthly spending limits.

**Workflow:**
1. The user selects a category and monthly budget amount.
2. The frontend sends the request to the backend.
3. The budget controller processes the request.
4. MongoDB stores the budget information.
5. Users can retrieve, update or delete their budgets.

### 3.5 Secure Access to User Data

Authenticated transaction and budget routes use authentication middleware.

The backend associates transactions and budgets with their respective user records, helping keep financial data separated between accounts.

---

## 4. Backend Architecture and Research

### 4.1 Architecture

The backend follows a structured architecture using routes, controllers, middleware, models and database configuration.

**Request Flow:**

```text
React Frontend
      |
      v
Express API Routes
      |
      v
Authentication Middleware
      |
      v
Controllers
      |
      v
Mongoose Models
      |
      v
MongoDB Atlas
      |
      v
API Response
      |
      v
React Frontend
```

Authentication routes are available for registration and login. Transaction and budget routes are protected by authentication middleware.

### 4.2 Research and Requirement Analysis

The backend design was developed based on the project brief and its functional requirements.

The main requirements identified were:

- Secure user authentication.
- User-specific transaction storage.
- Structured income and expense records.
- Monthly budget storage.
- RESTful API communication.
- Validation of incoming data.
- Protection of private financial information.

### 4.3 Database Design

The application uses three main MongoDB models.

#### User Model

Stores registered user information.

| Field | Type | Description |
|---|---|---|
| name | String | User's name |
| email | String | User's email address |
| password | String | Hashed password |

The email field is unique and stored in lowercase. Mongoose timestamps maintain creation and update dates.

#### Transaction Model

Stores income and expense records.

| Field | Type | Description |
|---|---|---|
| user | ObjectId | Reference to User |
| title | String | Transaction title |
| amount | Number | Transaction amount |
| type | String | Income or expense |
| category | String | Transaction category |
| date | Date | Transaction date |
| description | String | Optional description |

The transaction type is restricted to `income` or `expense`.

#### Budget Model

Stores monthly category budgets.

| Field | Type | Description |
|---|---|---|
| user | ObjectId | Reference to User |
| category | String | Budget category |
| amount | Number | Budget amount |
| month | Number | Month (1–12) |
| year | Number | Budget year |

A unique compound index is defined for user, category, month and year to prevent duplicate budgets for the same combination.

---

## 5. REST API Endpoints

The backend exposes RESTful APIs through Express.js.

Base URL during local development:

```text
http://localhost:5000/api
```

### 5.1 Health Check

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/api/health` | Checks whether the API is running | Not required |

### 5.2 Authentication APIs

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Not required |
| POST | `/api/auth/login` | Authenticate an existing user | Not required |

### 5.3 Transaction APIs

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/transactions` | Add a transaction | Required |
| GET | `/api/transactions` | Retrieve transactions | Required |
| PUT | `/api/transactions/:id` | Update a transaction | Required |
| DELETE | `/api/transactions/:id` | Delete a transaction | Required |

### 5.4 Budget APIs

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/budgets` | Create a monthly budget | Required |
| GET | `/api/budgets` | Retrieve budgets | Required |
| PUT | `/api/budgets/:id` | Update a budget | Required |
| DELETE | `/api/budgets/:id` | Delete a budget | Required |

Protected endpoints require a valid authentication token in the request.

---

## 6. Authentication and Security

The backend implements token-based authentication using JSON Web Tokens.

### Authentication Process

1. A user registers using their details.
2. The password is hashed using bcryptjs.
3. The user logs in using their credentials.
4. The backend verifies the password.
5. A JWT is issued after successful authentication.
6. The frontend sends the token when accessing protected routes.
7. Authentication middleware verifies the token before allowing access.

### Security Features

- Password hashing using bcryptjs.
- JWT-based authentication.
- Protected transaction routes.
- Protected budget routes.
- User-specific transaction and budget records.
- Environment variables for sensitive configuration.

---

## 7. Installation and Setup

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account
- Git

### Step 1: Clone the Backend Repository

```bash
git clone https://github.com/suma-venu/personal-finance-tracker-backend.git
```

### Step 2: Navigate to the Backend Folder

```bash
cd personal-finance-tracker-backend
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file in the backend root directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

**Important:** These are the MongoDB variable name confirmed in `config/db.js` and the expected JWT configuration placeholder. Verify the exact JWT environment variable name in `authController.js` and `authMiddleware.js` before configuring the application.

Never commit the actual `.env` file or share database credentials and secret keys.

### Step 5: Start the Development Server

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Step 6: Verify the API

Open the following URL in a browser:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Personal finance tracker API is running"
}
```

### Available Commands

Start the production server:

```bash
npm start
```

Start the development server:

```bash
npm run dev
```

---

## 8. Project Folder Structure

```text
server/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── budgetController.js
│   └── transactionController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Transaction.js
│   └── Budget.js
│
├── routes/
│   ├── authRoutes.js
│   ├── budgetRoutes.js
│   └── transactionRoutes.js
│
├── app.js
├── server.js
├── package.json
├── package-lock.json
└── .env
```

---

## 9. Conclusion

The Personal Finance Tracker backend provides the server-side functionality required for a complete personal financial management application.

Using Node.js, Express.js and MongoDB, the backend supports user authentication, transaction management and monthly budget operations.

The project demonstrates practical knowledge of RESTful API development, database modelling, middleware, authentication, password security and backend architecture.

It also provides a foundation for future enhancements such as transaction exports, recurring transactions, financial reports and additional analytics.

---

**Project:** Personal Finance Tracker  
**Backend:** Node.js and Express.js  
**Database:** MongoDB Atlas  
**Authentication:** JWT and bcryptjs  

**Backend Repository:**  
https://github.com/suma-venu/personal-finance-tracker-backend

**Frontend Repository:**  
https://github.com/suma-venu/personal-finance-tracker-frontend
