# NovaNotes

A clean full-stack notes app built for the PrimeTradeAI assignment, featuring secure authentication, personal note management, and a simple responsive dashboard. The project uses a React + TypeScript frontend, an Express backend, MongoDB for persistence, and a Vercel deployment setup, while the live app is currently deployed under the title **NovaNotes**.[1]

## Links

- Live Demo: https://primetradeai-assignment-theta.vercel.app/
- GitHub Repository: https://github.com/Tanmaybuilds14/primetradeai_assignment

## Overview

NovaNotes is a lightweight productivity app where users can register, log in, and manage their own notes in a dedicated dashboard. The repository is organized into separate `client`, `server`, and `api` folders, with the `api` folder acting as the Vercel serverless entry point for deployment routing.[1]

## Features

- Secure user registration and login.
- JWT-based authentication for protected actions.
- Create, fetch, and delete personal notes.
- Clean dashboard workflow after authentication.
- Vercel-ready full-stack deployment configuration.[1]

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router, Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Deployment | Vercel |

## Folder Structure

```text
primetradeai_assignment/
├── api/                  # Serverless entry for Vercel
├── client/               # Frontend app built with React + TypeScript
│   ├── src/
│   └── public/
├── server/               # Backend API, DB models, middleware, controllers
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── DBmodels/
├── package.json          # Root scripts for install, build, and dev
└── vercel.json           # Deployment configuration
```

## Core Functionality

### Authentication

The backend exposes user-related routes through `/api`, with separate controllers and validators for registration and login handling. The server is configured to parse JSON, enable CORS, connect to MongoDB, and mount user routes before exporting the app for both local and Vercel environments.[1]

### Notes Management

Authenticated users can work with note-related routes mounted under `/notes`, which support fetching, creating, and deleting notes. This structure keeps the app focused and easy to understand for a small full-stack assignment project.[1]

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Log in and receive auth token |
| GET | `/notes` | Fetch notes for the logged-in user |
| POST | `/notes` | Create a new note |
| DELETE | `/notes/:id` | Delete a note by id |

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- MongoDB database URI

### Installation

```bash
git clone https://github.com/Tanmaybuilds14/primetradeai_assignment.git
cd primetradeai_assignment
npm install
npm run install:server
npm run install:client
```

### Run Locally

Start the backend:

```bash
npm run dev:server
```

Start the frontend:

```bash
npm run dev:client
```

## Production Build

```bash
npm run build
npm start
```

The root build script installs dependencies for both parts of the app and builds the frontend bundle. When the project runs outside Vercel, the Express server serves the compiled frontend from `client/dist`.[1]

## Deployment

The project includes a `vercel.json` file that defines install commands for both the server and client, builds the frontend, sets `client/dist` as the output directory, and rewrites `/api/*` and `/notes/*` traffic to the serverless API entry.[1]

## Why this project stands out

- Clear separation between frontend and backend.
- Practical authentication flow using industry-standard libraries.
- Simple but complete CRUD-style note workflow.
- Deployment-aware backend structure with Vercel support.
- Good foundation for extending into a larger productivity app.
## API collection
https://sarvetanmay276-3789610.postman.co/workspace/Tanmay-sarve's-Workspace~2238c4ee-de8b-43ef-86c5-37db12ca006f/collection/51215265-d83df2d0-7662-4df5-8780-4714d2b64579?action=share&creator=51215265&live=gg805or0bi
##
  
