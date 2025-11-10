# Session Multi-App (Next.js + Angular x2 + .NET)

This project demonstrates **session-based authentication and cross-application navigation** between multiple frontends (Next.js + two Angular apps) powered by a shared backend in .NET.

All applications rely on a **single session cookie**, allowing seamless transitions between the apps under the same domain.

## Tech Stack & Versions

- **Backend**: .NET 6 (ASP.NET Core Minimal API)
- **Next.js**: 16 (App Router), React 19
- **Angular**: 18 (Standalone Components), two separate apps
  - User App
  - Admin App
- **Node**: 20.x
- **pnpm**: 9.x

## Project Structure

```
session-multiapp/
├── backend-dotnet/          # .NET API — authentication + session cookie
├── frontend-nextjs/         # Next.js (login + main hub)
├── frontend-angular1/       # Angular User App
└── frontend-angular2/       # Angular Admin App
```

## 1. Running the Project Locally

**Requirements**: Node 20+, pnpm 9+, .NET 6 SDK, Angular CLI 18 (`pnpm add -g @angular/cli@18`)

### 1.1 Backend (.NET) — http://localhost:5000

```bash
cd backend-dotnet
dotnet run --urls http://localhost:5000
```

The backend provides:

- Cookie-based authentication (`.session.demo`)
- `/login` (user)
- `/admin/login` (admin)
- `/me` (returns the session user)
- `/logout`

The cookie includes:

- `HttpOnly = true`
- `SameSite = Lax`
- `Secure = None` (dev mode)
- `Expiration = 4 hours`

**CORS is enabled for:**
`http://localhost:3000`, `http://localhost:4200`, `http://localhost:4201` with credentials allowed.

### 1.2 Next.js App — http://localhost:3000

```bash
cd frontend-nextjs
pnpm install
pnpm dev
```

**Main routes:**

- `/login` → performs POST `/login` and sets session cookie
- `/` → main hub with "Resume Application" button
- Navigation → redirects to Angular User App

### 1.3 Angular User App — http://localhost:4200

```bash
cd frontend-angular1
pnpm install
pnpm ng serve --port 4200
```

**Features:**

- Reads session via GET `/me` with `credentials: "include"`
- Displays `Welcome, <name> (role: <role>)`
- Shows an "Opened from Admin" indicator when URL contains `?from=admin`
- Button "Go Back to Home" returns to Next.js (`http://localhost:3000`)

### 1.4 Angular Admin App — http://localhost:4201

```bash
cd frontend-angular2
pnpm install
pnpm ng serve --port 4201
```

**Features:**

- Admin "Login" button → POST `/admin/login`
- Simple dashboard displaying one sample application
- Clicking **Open User Application #1** redirects to:
  `http://localhost:4200?from=admin`

> Both Angular apps use an HTTP interceptor to automatically send cookies (`withCredentials`).

## 2. Testing the Required Flows

### ✅ Flow A — Next.js → Angular User

1. Open `http://localhost:3000/login`
2. Click **Login** → session cookie created
3. Go to `http://localhost:3000/`
4. Click **Resume Application**
5. Angular User App (`:4200`) should show:

```
Welcome, Henrique (role: user)
```

### ✅ Flow B — Angular Admin → Angular User

1. Open `http://localhost:4201`
2. Click **Admin Login** → admin session created
3. Click **Open User Application #1**
4. User App opens at:

```
http://localhost:4200?from=admin
```

User App displays:

- Admin banner
- Active session details
- "Go Back to Home" button

## 3. Backend Endpoints Overview

| Method | Route          | Description                 |
|--------|----------------|-----------------------------|
| POST   | `/login`       | Creates user session cookie |
| POST   | `/admin/login` | Creates admin session cookie|
| GET    | `/me`          | Returns { name, role } if authenticated |
| POST   | `/logout`      | Removes session cookie      |

**Authentication uses:**
`CookieAuthenticationDefaults.AuthenticationScheme`

## 4. Production Considerations (Azure + Cloudflare)

Although this implementation is simplified for the assignment, the structure aligns with real-world production setups.

### ✅ Same-Domain Architecture

Recommended final routing under a single domain:

- `/` → Next.js
- `/user` → Angular User
- `/admin` → Angular Admin
- `/api` → .NET API

This allows safe usage of `SameSite=Lax` cookies.

### ✅ Cookie Security

For production:

- `Cookie.SecurePolicy = Always`
- Consider `Domain=.yourdomain.com` if using subdomains
- Switch to `SameSite=None; Secure` if cross-site navigation is required

### ✅ Cloudflare / Reverse Proxy Notes

Ensure:

- `Set-Cookie` headers are not stripped
- HTTPS termination preserves cookie attributes
- Correct forwarding of `Host`, `Origin`, and credential headers

### ⚠️ CSRF

Not implemented here (not required for this test).

## 5. Useful Scripts (4 terminals recommended)

```bash
# Terminal 1 — Backend
cd backend-dotnet
dotnet run --urls http://localhost:5000

# Terminal 2 — Next.js
cd frontend-nextjs
pnpm dev

# Terminal 3 — Angular User
cd frontend-angular1
pnpm ng serve --port 4200

# Terminal 4 — Angular Admin
cd frontend-angular2
pnpm ng serve --port 4201
```

## 6. Key Features

- **Shared Session**: Single `.session.demo` cookie works across all apps
- **Cross-App Navigation**: Seamless transitions between Next.js and Angular apps
- **Role-Based Access**: User and admin sessions with different capabilities
- **Production Ready**: Architecture suitable for deployment with proper routing
- **Modern Stack**: Latest versions of Next.js, Angular, and .NET

## 7. Possible Future Improvements

Not required for this challenge but useful:

- Redis-backed session store
- Multi-application routing gateway
- Admin dashboard with real data
- Guards for protected Angular routes
- Tailwind / Material UI refinements
- Full CI/CD pipeline for Azure + Cloudflare

## 8. License

Educational/demo usage for recruitment purposes.