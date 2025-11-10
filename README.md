# Session Multi-App (Next.js + Angular x2 + .NET)

This project demonstrates **session-based authentication and cross-application navigation** between multiple frontends (Next.js + two Angular apps) powered by a shared backend in .NET.

All applications rely on a **single session cookie**, allowing seamless transitions between the apps under the same domain.

[![CI/CD Pipeline](https://github.com/HenriqueBMoura/session-multiapp/actions/workflows/ci.yml/badge.svg)](https://github.com/HenriqueBMoura/session-multiapp/actions/workflows/ci.yml)

## Tech Stack & Versions

- **Backend**: .NET 6 (ASP.NET Core Minimal API)
- **Next.js**: 16 (App Router), React 19
- **Angular**: 18 (Standalone Components), two separate apps
  - User App
  - Admin App
- **Node**: 20.x
- **pnpm**: 9.x
- **DevOps**: Docker, GitHub Actions, VS Code Workspace

## Project Structure

```
session-multiapp/
├── backend-dotnet/          # .NET API — authentication + session cookie
├── frontend-nextjs/         # Next.js (login + main hub)
├── frontend-angular1/       # Angular User App
├── frontend-angular2/       # Angular Admin App
├── .github/workflows/       # CI/CD Pipeline
├── docker-compose.yml       # Development environment
├── Dockerfile               # Multi-stage containerization
├── package.json             # Unified development scripts
└── session-multiapp.code-workspace  # VS Code configuration
```

## Quick Start

### Option 1: Using Development Scripts (Recommended)
```bash
# Install dependencies for all frontends
pnpm run install:all

# Start all applications (requires 4 terminals)
pnpm run dev:backend     # Terminal 1 - Backend on :5000
pnpm run dev:nextjs      # Terminal 2 - Next.js on :3000  
pnpm run dev:angular1    # Terminal 3 - Angular User on :4200
pnpm run dev:angular2    # Terminal 4 - Angular Admin on :4201
```

### Option 2: Using Docker Compose
```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f
```

### Option 3: VS Code Workspace
1. Open `session-multiapp.code-workspace` in VS Code
2. Install recommended extensions
3. Use integrated terminals for each project

## 1. Running the Project Locally

**Requirements**: Node 20+, pnpm 9+, .NET 6 SDK, Angular CLI 18

### Available Scripts

```bash
# Installation
pnpm run install:all         # Install all frontend dependencies
pnpm run install:nextjs      # Install Next.js dependencies only
pnpm run install:angular1    # Install Angular User App dependencies only
pnpm run install:angular2    # Install Angular Admin App dependencies only

# Development
pnpm run dev:backend         # Start .NET backend on :5000
pnpm run dev:nextjs          # Start Next.js on :3000
pnpm run dev:angular1        # Start Angular User App on :4200
pnpm run dev:angular2        # Start Angular Admin App on :4201

# Building
pnpm run build:all           # Build all components
pnpm run build:backend       # Build .NET backend only
pnpm run build:nextjs        # Build Next.js only
pnpm run build:angular1      # Build Angular User App only
pnpm run build:angular2      # Build Angular Admin App only

# Maintenance
pnpm run clean               # Clean all build artifacts
pnpm run lint:all            # Lint all frontend projects
```

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

**Health Check**: `GET /health` - Returns API status and version

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
| GET    | `/health`      | Returns API health status   |

**Authentication uses:**
`CookieAuthenticationDefaults.AuthenticationScheme`

## 4. Development Environment

### VS Code Workspace
Open `session-multiapp.code-workspace` for optimized multi-project development:
- Configured paths for all projects
- Recommended extensions
- Unified settings and tasks

### Docker Development
```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### CI/CD Pipeline
GitHub Actions workflow includes:
- ✅ Automated builds for all components
- ✅ Security vulnerability scanning
- ✅ Integration testing
- ✅ Multi-platform support

## 5. Production Considerations (Azure + Cloudflare)

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

## 6. Containerization & Deployment

### Docker Multi-Stage Build
```bash
# Build all components
docker build -t session-multiapp .

# Run specific services
docker run -p 5000:5000 session-multiapp:backend
```

### Kubernetes Deployment
```bash
# Future: Kubernetes manifests for production deployment
kubectl apply -f k8s/
```

## 7. Development Workflow

```bash
## 7. Development Workflow

### Using Unified Scripts
```bash
# Start development (4 terminals recommended)
pnpm run dev:backend    # Terminal 1 — Backend
pnpm run dev:nextjs     # Terminal 2 — Next.js
pnpm run dev:angular1   # Terminal 3 — Angular User
pnpm run dev:angular2   # Terminal 4 — Angular Admin
```

### Using Docker Compose
```bash
# One command for full environment
docker-compose up
```

### VS Code Integration
1. Open workspace: `session-multiapp.code-workspace`
2. Install recommended extensions
3. Use integrated terminal panels
4. Enjoy unified development experience

## 8. Key Features
```

## 8. Key Features

- **Shared Session**: Single `.session.demo` cookie works across all apps
- **Cross-App Navigation**: Seamless transitions between Next.js and Angular apps
- **Role-Based Access**: User and admin sessions with different capabilities
- **Production Ready**: Architecture suitable for deployment with proper routing
- **Modern Stack**: Latest versions of Next.js, Angular, and .NET
- **DevOps Integration**: Full CI/CD pipeline with automated testing
- **Containerization**: Docker support for consistent deployments
- **Development Tools**: VS Code workspace and unified scripts

## 9. CI/CD Pipeline

### GitHub Actions Workflow
- **Backend Build**: .NET compilation and testing
- **Frontend Builds**: Next.js and Angular compilation
- **Security Scanning**: Trivy vulnerability assessment
- **Integration Tests**: Cross-component verification
- **Automated Deployment**: Ready for production deployment

### Quality Assurance
- Automated code quality checks
- Security vulnerability scanning
- Multi-platform build verification
- Integration testing across all components

## 10. Possible Future Improvements

Not required for this challenge but useful:

- **Backend Enhancements**:
  - Redis-backed session store
  - Database integration with Entity Framework
  - JWT token support alongside cookies
  - API rate limiting and throttling

- **Frontend Improvements**:
  - Guards for protected Angular routes
  - State management (NgRx, Zustand)
  - Tailwind / Material UI refinements
  - Progressive Web App features

- **DevOps & Infrastructure**:
  - Kubernetes deployment manifests
  - Full CI/CD pipeline for Azure + Cloudflare
  - Infrastructure as Code (Terraform)
  - Monitoring and observability (Grafana, Prometheus)

- **Architecture & Scaling**:
  - Multi-application routing gateway
  - Microservices decomposition
  - Event-driven communication
  - Cache layers and optimization

## 11. Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## 12. Security

See [SECURITY.md](SECURITY.md) for information about reporting security vulnerabilities.

## 13. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Educational/demo usage for recruitment purposes.

---

## 🚀 Quick Links

- **Repository**: [session-multiapp](https://github.com/HenriqueBMoura/session-multiapp)
- **Live Demo**: *Coming soon*
- **Issues**: [Report bugs](https://github.com/HenriqueBMoura/session-multiapp/issues)
- **Discussions**: [Community discussions](https://github.com/HenriqueBMoura/session-multiapp/discussions)

Built with ❤️ for demonstrating modern micro-frontend architecture patterns.