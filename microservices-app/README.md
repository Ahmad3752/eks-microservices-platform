# Microservices App

A local monorepo with two services: an Express REST API (`backend`) and a React + Vite UI (`frontend`). Intended to run locally for development; containerization and deployment (Docker, Helm, Kubernetes, AWS) will be added in later steps.

## Services

| Service  | Stack          | Default port | Description                          |
| -------- | -------------- | ------------ | ------------------------------------ |
| backend  | Node.js + Express | 4000         | REST API serving `/health` and `/api/items` |
| frontend | React + Vite   | 5173         | UI that fetches and adds items via the backend |

## Prerequisites

- Node.js >= 18
- npm

## Setup

All commands below are run from inside the `microservices-app/` directory:

```bash
cd microservices-app
```

Install dependencies for both services:

```bash
npm install --prefix backend
npm install --prefix frontend
```

Each service has a `.env.example`. Copy it to `.env` and adjust as needed:

```bash
# bash / macOS / Linux
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# PowerShell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

## Running locally (two terminals)

You need two terminals — both opened inside `microservices-app/`.

### Terminal 1: Backend

```bash
cd microservices-app/backend
npm run dev
```

Backend runs on `http://localhost:4000` (overridable via `PORT`).

Endpoints:
- `GET  /health`      -> `{ "status": "ok" }`
- `GET  /api/items`   -> list of items
- `POST /api/items`   -> add an item (JSON body)

### Terminal 2: Frontend

```bash
cd microservices-app/frontend
npm run dev
```

Frontend runs on `http://localhost:5173` and calls the backend at the URL set in `VITE_API_URL` (default `http://localhost:4000`).

## Environment variables

### Backend (`backend/.env`)
| Var  | Default | Description        |
| ---- | ------- | ------------------ |
| PORT | 4000    | Backend listen port |

### Frontend (`frontend/.env`)
| Var          | Default              | Description              |
| ------------ | -------------------- | ------------------------ |
| VITE_API_URL | http://localhost:4000 | Base URL of the backend  |

No secrets or credentials are hardcoded anywhere. All configuration flows through environment variables, since this project is being prepared to later pull secrets from AWS Secrets Manager.
