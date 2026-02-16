# ⚙️ Wallet Tracker - Backend API

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](../LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.9-2D3748.svg)](https://www.prisma.io/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)

High-performance Node.js backend for the Solana Wallet Tracker. Built with a focus on real-time data delivery, modular architecture, and robust security.

---

## 🏗️ Architectural Foundations

- **Repository Pattern**: Abstracted data layer for better testability and database independence.
- **Service Layer**: Business logic encapsulated in dedicated services, decoupled from Express controllers.
- **Dependency Injection**: Clear separation of concerns with injected repositories and services.
- **Zod Validation**: Strict, type-safe schema validation for all incoming requests.
- **Interactive API Docs**: Fully compliant OpenAPI/Swagger documentation.

---

## 🚀 Key Modules

- **Auth System**: Secure JWT-based authentication with Passport.js integration.
- **Real-time Engine**: WebSocket-based transaction streaming via Socket.io.
- **Blockchain Integration**: Heavy lifting for Solana transaction parsing and Pump.fun monitoring.
- **Telegram Gateway**: Comprehensive bot integration for instant user notifications.

---

## 🛠️ Tech Stack

- **Core**: Node.js, TypeScript, Express 5
- **Database**: PostgreSQL, Prisma ORM
- **Messaging**: Socket.io (WebSockets), Grammy (Telegram)
- **Security**: Passport (JWT), Bcrypt, Helmet, CORS
- **Logging**: Winston
- **Testing**: Jest, Supertest

---

## 🚦 Getting Started

### Prerequisites
- Node.js v20+
- A running PostgreSQL instance

### Setup
1. **Install Dependencies**:
   ```bash
   pnpm install
   ```
2. **Setup Database**:
   ```bash
   pnpm prisma:migrate:dev
   ```
3. **Configuration**:
   Copy `.env.example` to `.env.development` and provide required keys.

### Development Commands
| Command | Action |
| :--- | :--- |
| `pnpm dev` | Start development server with Nodemon |
| `pnpm test` | Run full test suite |
| `pnpm build` | Compile TypeScript to JavaScript |
| `pnpm lint` | Run ESLint check |

---

## 📄 API Documentation

Once the server is running, visit:
`http://localhost:3001/api-docs`

---

## 📄 License

This software is part of the Wallet Tracker suite and is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See the root [LICENSE](../LICENSE) file for more information.
