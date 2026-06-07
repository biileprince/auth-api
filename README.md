# Auth API

A simple Node.js REST API with JWT-based authentication, bcrypt password hashing, and SQLite storage. Built with TypeScript and ES modules.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript (ES Modules)
- **Framework:** Express
- **Database:** SQLite (via better-sqlite3)
- **Auth:** JSON Web Tokens (jsonwebtoken)
- **Password Hashing:** bcrypt

## Getting Started

### Prerequisites

- Node.js v18+ installed

### Installation

```bash
git clone https://github.com/biileprince/auth-api.git
cd auth-api
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
PORT=3000
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=15m
```

### Running the Server

```bash
# Development (with auto-reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

The server starts at `http://localhost:3000`.

## API Endpoints

### `POST /register`

Create a new user account.

**Request Body:**
```json
{
  "username": "testuser",
  "password": "SecurePass123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testuser"
  }
}
```

---

### `POST /login`

Authenticate and receive a JWT.

**Request Body:**
```json
{
  "username": "testuser",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### `GET /profile`

Get the authenticated user's profile. Requires a valid JWT.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "created_at": "2026-06-07 23:00:00"
  }
}
```

## Example Usage (curl)

```bash
# Register
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "SecurePass123"}'

# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "SecurePass123"}'

# Profile (replace <token> with the JWT from login)
curl http://localhost:3000/profile \
  -H "Authorization: Bearer <token>"
```

## Project Structure

```
auth-api/
├── .gitignore
├── .env
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   ├── app.ts                  # Express app setup
│   ├── server.ts               # Entry point
│   ├── config/
│   │   └── db.ts               # SQLite connection & schema
│   ├── middleware/
│   │   └── auth.ts             # JWT verification middleware
│   ├── routes/
│   │   └── auth.routes.ts      # Route definitions
│   └── controllers/
│       └── auth.controller.ts  # Request handlers
```

## License

ISC
