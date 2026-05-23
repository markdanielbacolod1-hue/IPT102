# Document Tracking System — Node.js Backend

A production-ready Express.js REST API with JWT auth, role-based access control, bcrypt password hashing, and full user CRUD.

---

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL 8+ (via `mysql2`) |
| Auth | JWT (httpOnly cookies + Bearer header) |
| Password Hashing | bcryptjs (12 rounds) |
| Validation | express-validator |
| Security | helmet, cors, express-rate-limit |
| Logging | morgan |

---

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MySQL connection pool
├── controllers/
│   ├── authController.js     # login, logout, refresh, /me
│   └── userController.js     # full user CRUD + activity log
├── middleware/
│   ├── auth.js               # authenticate (JWT) + authorize (RBAC)
│   └── validators.js         # express-validator rule sets
├── routes/
│   ├── authRoutes.js         # /api/auth/*
│   └── userRoutes.js         # /api/users/*
├── index.js                  # Express app + server bootstrap
├── seed.js                   # DB seeder (roles, departments, admin user)
├── .env.example              # Environment variable template
└── package.json
```

---

## Quick Start

### 1. Clone & Install

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your DB credentials and secrets
```

### 3. Set Up the Database

Run the `database.sql` file from your project root, then seed:

```bash
mysql -u root -p < ../database.sql
node seed.js
```

The seeder creates:
- Roles: `Admin`, `Staff`, `Department Head`
- Departments: `HR`, `Registrar`, `Finance`, `Admin`
- Default admin: `admin@doctrack.local` / `Admin@1234` ← **change this!**

### 4. Start the Server

```bash
npm run dev    # Development (with nodemon)
npm start      # Production
```

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/login` | ❌ | `{ email, password }` | Login — sets httpOnly cookies + returns tokens |
| POST | `/logout` | ✅ | — | Logout — clears cookies, logs activity |
| POST | `/refresh` | ❌ | — | Refresh access token via refresh cookie |
| GET | `/me` | ✅ | — | Returns current user's session data |

**Login response:**
```json
{
  "success": true,
  "user": { "userId": 1, "fullName": "...", "email": "...", "role": "Admin" },
  "accessToken": "eyJ..."
}
```

---

### Users — `/api/users`

All routes require a valid JWT (`Authorization: Bearer <token>` header or `accessToken` cookie).

| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| GET | `/` | Admin | List all users (filter + pagination) |
| POST | `/` | Admin | Create user |
| GET | `/:id` | Admin or Self | Get user by ID |
| PUT | `/:id` | Admin or Self* | Update user profile |
| PATCH | `/:id/password` | Admin or Self | Change password |
| PATCH | `/:id/status` | Admin | Toggle Active/Inactive |
| DELETE | `/:id` | Admin | Soft-delete (sets Inactive) |
| GET | `/:id/activity` | Admin or Self | Fetch activity log |
| GET | `/roles` | Any | List roles |
| GET | `/departments` | Any | List departments |

*Staff/Department Head can only update own `full_name` and `email`; `role` and `status` are locked.

**List users — query params:**
```
GET /api/users?search=john&role=Staff&department=HR&status=Active&page=1&limit=20
```

**Create user — body:**
```json
{
  "full_name": "Juan dela Cruz",
  "email": "juan@school.edu",
  "password": "Secret@123",
  "role_id": 2,
  "department_id": 1,
  "status": "Active"
}
```

**Change password — body:**
```json
{
  "currentPassword": "OldPass@1",
  "newPassword": "NewPass@2"
}
```
> Admin callers can omit `currentPassword`.

---

### Reference Data — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/roles` | ✅ Any | `[{ role_id, role_name }]` |
| GET | `/departments` | ✅ Any | `[{ department_id, department_name }]` |

---

## Security Highlights

### Dual Token Strategy
- **Access Token** — short-lived (8h), stored in `httpOnly` cookie AND returned in response body for flexibility.
- **Refresh Token** — long-lived (7d), stored in `httpOnly` cookie only. Used to silently reissue access tokens.

### Password Policy
Validated server-side via `express-validator`:
- Minimum 8 characters
- At least one uppercase letter
- At least one number
- Hashed with **bcrypt at 12 rounds** before storage

### Role Hierarchy

| Role | Permissions |
|---|---|
| **Admin** | Full CRUD on all users, manage roles/status |
| **Department Head** | Read own profile, update own name/email |
| **Staff** | Read own profile, update own name/email |

### Brute-Force Protection
Login endpoint is rate-limited to **10 attempts per 15 minutes** per IP.

### Soft Deletes
Users are never hard-deleted — status is set to `Inactive` to preserve the audit trail in `user_activity_logs`.

---

## Connecting to the React Frontend

### Option A — Cookie Auth (recommended)

```js
// In your React app's API client (e.g. axios):
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // ← sends cookies automatically
});
```

Cookies are set automatically on login. All subsequent requests carry them.

### Option B — Bearer Token

```js
const { accessToken } = await api.post('/auth/login', { email, password });
// Store in memory (NOT localStorage)
api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
```

### Handling Token Expiry (auto-refresh)

```js
api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.data?.code === 'TOKEN_EXPIRED') {
      await api.post('/auth/refresh'); // refresh cookie is sent automatically
      return api(err.config);          // retry original request
    }
    return Promise.reject(err);
  }
);
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `development` | `development` / `production` |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `root` | MySQL user |
| `DB_PASSWORD` | — | MySQL password |
| `DB_NAME` | `document_tracking_system` | Database name |
| `JWT_SECRET` | — | **Required** — sign access tokens |
| `JWT_EXPIRES_IN` | `8h` | Access token TTL |
| `JWT_REFRESH_SECRET` | — | **Required** — sign refresh tokens |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token TTL |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Vite/React dev server URL for CORS |
