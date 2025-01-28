This is a detailed README file for Node.js, Express, and TypeScript backend:


---

# Node.js Backend with Express and TypeScript

This project is a backend application built using **Node.js**, **Express**, and **TypeScript**. It serves as the foundation for authentication, data management, and grid-based operations, with MongoDB as the database. Below is a module-wise breakdown of its features and setup.

---

## Features

1. **Authentication Module**
   - Handles user signup, login, OTP verification, password recovery, and social login.
   - Protects routes using JWT-based authentication middleware.
   - Includes endpoints for updating user profiles and changing passwords.
   - Supports account recovery with OTPs sent via Brevo.
   - Social login feature for third-party authentication.

2. **Grid Module**
   - Manages grids, including parsing CSV and Excel files to store data.
   - Includes endpoints to create, read, update, and delete grids.
   - Grid data is structured and stored in MongoDB.

3. **Grid Data Module**
   - Stores and manages rows of data for grids.
   - Provides endpoints to create, retrieve, update, and delete grid rows.
   - Supports pagination for handling large datasets.

4. **Database Models**
   - **User**: Stores user details such as name, email, password, and social login status.
   - **OTP**: Manages OTPs for account recovery and verification with automatic expiration.
   - **Grid**: Represents grids with column configurations and associated actions.
   - **Grid Data**: Stores row-wise data for grids.
   - **Actions**: Defines actions that can be associated with grids for additional functionality.

5. **Middleware**
   - **Auth Middleware**: Protects secured routes by verifying JWT tokens and user information.

6. **Social Login**
   - Integrates social login for seamless user authentication via third-party providers.

---

## Modules and API Endpoints

### 1. Authentication Module
Handles all user authentication-related tasks.

| Method | Endpoint          | Description                       |
|--------|-------------------|-----------------------------------|
| POST   | `/auth/login`     | User login                       |
| POST   | `/auth/signup`    | User signup                      |
| POST   | `/auth/verify-otp`| Verifies OTP for account actions |
| POST   | `/auth/recover-acc`| Recovers user account            |
| PUT    | `/auth/`          | Updates user profile             |
| POST   | `/auth/social-login`| Social login                    |
| POST   | `/auth/change-password`| Changes user password       |
| GET    | `/auth/auth-me`   | Retrieves authenticated user info|

---

### 2. Grid Module
Manages grid-related operations.

| Method | Endpoint        | Description                  |
|--------|-----------------|------------------------------|
| POST   | `/grid/`        | Creates a new grid           |
| GET    | `/grid/`        | Retrieves all grids          |
| GET    | `/grid/:id`     | Retrieves a specific grid    |
| PUT    | `/grid/:id`     | Updates an existing grid     |
| DELETE | `/grid/:id`     | Deletes a specific grid      |

---

### 3. Grid Data Module
Handles row-level data for grids.

| Method | Endpoint          | Description                  |
|--------|-------------------|------------------------------|
| POST   | `/grid-data/`     | Creates grid data row        |
| GET    | `/grid-data/`     | Retrieves all grid data rows |
| PUT    | `/grid-data/:id`  | Updates a grid data row      |
| DELETE | `/grid-data/:id`  | Deletes a grid data row      |

---

## Database Models

### 1. User
- Stores user details, including:
  - First name, last name, email, and password.
  - Social login flag (`isSocialLogin`).

### 2. OTP
- Stores OTPs with the following properties:
  - `email`: Email associated with the OTP.
  - `otp`: One-time password for verification.
  - `createdAt`: Timestamp for expiration (2 minutes).

### 3. Grid
- Represents grids with:
  - `user`: Reference to the user who created the grid.
  - `name` and `description`: Metadata for the grid.
  - `columnConfig`: Array defining columns and fields.
  - `actions`: Associated grid actions.

### 4. Grid Data
- Represents rows of data for grids:
  - `grid`: Reference to the associated grid.
  - `rowData`: Dynamic map of data for each row.

### 5. Actions
- Defines actions for grids, including:
  - `name`: Unique identifier for the action.
  - `label`: Display label for the action.

---

## Environment Variables

The application uses the following environment variables:

```env
MONGODB_URI=                # MongoDB connection string
JWT_SECRET=                 # Secret key for JWT tokens
TOKEN_EXPIRE_TIME=          # Token expiration time
SENDINBLUE_API_KEY=         # Brevo (Sendinblue) API key for sending emails
FIREBASE_ADMIN_CREDENTIALS= # Firebase admin credentials
FIREBASE_STORAGE_BUCKET=    # Firebase storage bucket
PORT=8000                   # Application port
```

---

## Setup Instructions

### Prerequisites
- **Node.js** (v16 or above)
- **MongoDB** (Atlas or local instance)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables in a `.env` file.

4. Run the application:
   ```bash
   npm run start
   ```

### Scripts
- **`npm run start`**: Runs the application in production mode.
- **`npm run dev`**: Runs the application in development mode with live reload.
- **`npm run build`**: Compiles TypeScript to JavaScript.

---

## Technologies Used

- **Node.js**: JavaScript runtime.
- **Express**: Backend framework.
- **TypeScript**: Strongly-typed JavaScript.
- **MongoDB**: NoSQL database.
- **JWT**: Authentication via JSON Web Tokens.
- **Brevo (Sendinblue)**: Email service for OTPs.
- **Firebase**: Storage integration.

---

## Additional Notes

- Ensure the database is properly configured before starting the application.
- Refer to the API documentation for detailed usage of each endpoint.

--- 

