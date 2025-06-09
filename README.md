# Wallet Tracker

A real-time Solana wallet transaction tracking application built with the PERN stack (PostgreSQL, Express, React, Node.js).

## Overview

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
