# Wallet Tracker 🚀

A real-time Solana wallet transaction tracking application.

## ✨ Portfolio Highlights

This project demonstrates several advanced software engineering practices:

### 🏗️ Backend Architecture

- **Repository Pattern**: Decoupled business logic from database operations using Prisma for enhanced testability and flexibility.
- **Dependency Injection**: Constructor-based injection for services and repositories to ensure loose coupling.
- **Structured Logging**: Implemented with Winston for production-grade observability.
- **Standardized API Responses**: Centralized response utility for consistent JSON envelopes (Status, Data, Error, Timestamp).
- **API Documentation**: Interactive Swagger/OpenAPI documentation at `/api-docs`.
- **Global Validation**: Centralized request validation using Zod and a custom middleware factory.

### 🎨 Frontend Excellence

- **Feature-Sliced Design (FSD)**: Organized codebase around business domains (e.g., `features/auth`, `features/wallets`) instead of técnico-technical layers.
- **Custom Hooks for Data Fetching**: Abstracted API logic into TanStack Query hooks for pure UI components and efficient caching.

### 🛠️ DevOps & CI/CD

- **GitHub Actions**: Automated CI pipeline for linting and unit testing on every push and pull request.
- **Dockerized Environment**: Full development and production Docker Compose setups for easy reproduction and deployment.

## Overview

...

Wallet Tracker helps you monitor memecoin trading activity of Solana wallets by tracking their transactions on pump.fun. By following successful traders, you can make more informed decisions about which memecoins to invest in.

### Key Features

- Track any Solana wallet address without limitations
- Real-time transaction updates via WebSocket connection
- Optional Telegram notifications via bot integration
- Custom wallet names for better organization
- View transaction details including:
  - Token name and symbol
  - Transaction type (buy/sell)
  - Amount and value
  - Market cap

## Tech Stack

### Backend

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- Socket.IO for real-time updates
- Grammy for Telegram bot

### Frontend

- React
- TypeScript
- TailwindCSS
- Tanstack Query for data fetching
- Socket.IO client

## Getting Started

1. Clone the repository
2. Install dependencies in both frontend and backend directories:

```sh
cd frontend && pnpm install
cd ../backend && pnpm install

cd backend && pnpm prisma:migrate:dev

# Backend
cd backend && pnpm dev

# Frontend
cd frontend && pnpm dev
```

### 🐳 Docker Development (Recommended)

The easiest way to run the entire stack is using Docker Compose:

```sh
# Start everything
docker compose -f docker-compose.development.yaml up --build
```

- **Frontend**: [app.localhost](http://app.localhost) or [localhost](http://localhost)
- **Backend API**: [api.localhost](http://api.localhost)
- **API Docs**: [api.localhost/api-docs](http://api.localhost/api-docs)
- **Traefik Dashboard**: [localhost:8080](http://localhost:8080)

> **Note**: Modern browsers (Chrome/Firefox) typically resolve `*.localhost` to `127.0.0.1` automatically. If they don't work for you, adding them to your `hosts` file is recommended.
