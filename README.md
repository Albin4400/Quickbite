# QuickBite

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.11.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Admin dashboard

Sign in with an account whose database role is `admin`; admins are sent to `/admin` after login. The dashboard lets admins review user roles and manage QuickBite menu dishes. Public registration always creates a regular `user` account.

On startup, the Flask backend adds the `users.role` column to older SQLite databases without dropping or replacing existing data. To promote a registered account or create the first admin locally, run this from `backend/`:

```powershell
python .\create_admin.py
```

The dashboard’s local dishes are stored in the backend database and appear alongside TheMealDB recipes. Only local dishes can be edited or removed; catalog keys use `admin-<id>` and `api-<id>` to keep each source distinct.

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

# QuickBite Project Report

## Overview
QuickBite is a modern web application built with **Angular** that provides a simple food ordering interface. The repository contains both a frontend (Angular) and a backend (Python dependencies listed in `backend/requirements.txt`). The application demonstrates typical features such as user authentication, protected routes, and a basic UI for browsing food items.

## Technology Stack
- **Frontend**: Angular 21.2.11, TypeScript, HTML, CSS
- **Backend**: Python (see `backend/requirements.txt` for dependencies), likely using a lightweight framework (e.g., Flask/FastAPI)
- **Testing**: Vitest for unit tests, placeholder for e2e testing (e.g., Cypress, Playwright)
- **Build & Dev Tools**: Angular CLI, Node.js, npm

## Directory Structure
```
Quickbite/
├─ src/                     # Angular source code
│  ├─ app/
│  │  ├─ pages/
│  │  │  ├─ login/
│  │  │  │  └─ login.ts          # Login page logic
│  │  │  ├─ foods/
│  │  │  │  └─ foods.html        # Food listing page
│  │  │  ├─ register/
│  │  │  │  └─ register.html     # Registration page
│  │  │  └─ ...
│  │  └─ interceptors/
│  │     └─ auth.interceptor.ts # Adds auth token to HTTP requests
│  └─ ...
├─ backend/                 # Backend source (Python) – requirements listed
│  └─ requirements.txt
├─ README.md                # Project documentation (this file)
└─ ...
```

## Key Components
- **Login Page (`login.ts`)** – Handles user credential submission and error handling.
- **Auth Interceptor (`auth.interceptor.ts`)** – Automatically injects JWT tokens into outgoing HTTP calls, protecting API routes.
- **Foods Page (`foods.html`)** – Displays a list of available food items; currently a static template that can be wired to backend data.
- **Register Page (`register.html`)** – Simple user registration form.

## Setup & Execution
1. **Install Node.js (>= 20) and npm**
2. **Clone the repository**
3. **Install frontend dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   ng serve
   ```
5. **Backend (optional)** – Navigate to `backend/` and install Python dependencies:
   ```bash
   pip install -r requirements.txt
   # Run your backend server (e.g., uvicorn app:app)
   ```

## Testing
- **Unit Tests**: `ng test` runs Vitest unit tests.
- **End‑to‑End Tests**: Placeholder command `ng e2e`; integrate with Cypress or Playwright as needed.

## Build & Deployment
Run `ng build --prod` to generate an optimized production bundle in the `dist/` folder. Deploy the contents of `dist/` to any static web host (e.g., Netlify, Vercel) and ensure the backend API is reachable from the deployed client.

---

*Report generated on 2026-09-30.*
