# Frontend – Next.js Hub

This Next.js application is the **central Hub** for the **Session Multi-App** workspace.

It provides a single entry point for local development, handles session-based authentication via the backend API, and offers cross-application navigation to the User and Admin frontends.

---

## What this app is

The Hub is a small Next.js shell that:

- Creates a session cookie via the backend (**login**)
- Detects an existing session on load (**me**)
- Shows who is logged in (name + role)
- Provides one-click navigation to other apps (User/Admin)
- Logs out (invalidates the shared session cookie)

This mirrors an enterprise gateway/shell pattern where multiple frontends share the same authenticated session.

Although this project runs locally, the patterns demonstrated here map directly to production setups using reverse proxies and shared domains (for example, routing `/`, `/user`, `/admin`, and `/api` under a single domain).

---

## Tech Stack

- **Next.js:** 16 (App Router)
- **React:** 19
- **TypeScript**
- **Styling:** CSS Modules (`app/page.module.css`) + Global CSS (`app/globals.css`)
- **Package manager:** pnpm

---

## Prerequisites

- Node.js **20+**
- pnpm **9+**
- Backend API running at: `http://localhost:5000`

---

## Install

```bash
pnpm install
```

---

## Run

```bash
pnpm dev
```

---

## Access

- Hub (Next.js): `http://localhost:3000`

---

## Local Ports (Workspace)

- Hub (Next.js): **3000**
- User App (Angular): **4200**
- Admin App (Angular): **4201**
- API (.NET): **5000**

---

## Cross-App Navigation

From the Hub, you can open:

- User App: `http://localhost:4200/`
- Admin App: `http://localhost:4201/`

The goal is to avoid “manual port typing” and keep the Hub as the single, cohesive entry point for demos and local testing.

---

## API Endpoints Used

The Hub communicates with the backend API at `http://localhost:5000`.

- `POST /login` — creates a **user** session cookie
- `POST /admin/login` — creates an **admin** session cookie (typically triggered from the Admin app)
- `GET /me` — returns current session user info when authenticated
- `POST /logout` — clears/invalidates the session cookie

**Important:** requests that rely on the cookie must include:

```ts
credentials: "include"
```

---

## Session Flow

### 1 Login

- Route: `/login`
- Action: sends `POST /login` to the backend
- Result: backend issues the shared session cookie (e.g. `.session.demo`)
- Then: redirects back to the Hub (`/`)

### 2 Session Detection

On Hub load, the app checks whether a session already exists:

- `GET http://localhost:5000/me`

If valid, the Hub UI displays:

- Logged-in user name
- Role (`user` / `admin`)
- Logout option

### 3 Logout

- Action: `POST /logout`
- Effect: invalidates the session cookie on the backend
- Result: user is logged out across all connected apps (cookie is shared)

---

## Project Structure

```text
frontend-nextjs/
├── app/
│   ├── page.tsx              # Hub UI
│   ├── login/
│   │   └── page.tsx          # Login UI
│   ├── layout.tsx            # Root layout
│   ├── page.module.css       # CSS Modules (scoped)
│   └── globals.css           # Global styles
├── public/
├── package.json
└── pnpm-lock.yaml
```

---

## Notes & Common Gotchas

### Next.js lint: internal navigation must use `<Link />`

For internal routes (e.g. `/`, `/login`), use `next/link` instead of `<a href="/...">` to satisfy:

- `eslint@next/next/no-html-link-for-pages`

External URLs (ports `4200/4201`) can remain `<a href="http://localhost:4200">`.

### CSS Modules “pure selector” rule

In CSS Modules, selectors must include at least one local class. If you need a disabled style, do:

```css
.button:disabled { ... }
```

…where `.button` is a class from the module. Avoid `button:disabled` alone inside `*.module.css`.

### Hydration mismatch warning with browser extensions

If you see hydration mismatch mentioning extra attributes (e.g. `cz-shortcut-listen`), it is often caused by a browser extension injecting attributes before React hydrates. Test in an incognito profile or disable the extension.

---

## Scripts

```bash
pnpm dev      # start Next.js in development mode
pnpm build    # production build
pnpm start    # run production build
pnpm lint     # run eslint
```
