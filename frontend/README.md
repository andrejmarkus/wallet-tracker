# 🌐 Wallet Tracker - Frontend

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](../LICENSE)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg)](https://vitejs.dev/)

The frontend of the **Wallet Tracker** application, built with a focus on real-time data visualization, performance, and a superior user experience.

---

## 🚀 Features

- **Real-Time Dashboards**: Live transaction feeds powered by Socket.io.
- **Responsive Design**: Mobile-first architecture using Tailwind CSS and DaisyUI.
- **Type Safety**: End-to-end TypeScript integration.
- **Efficient Data Management**: Optimized caching and server-state synchronization with TanStack Query.
- **Stunning Animations**: Smooth page transitions and UI feedback with Framer Motion.

---

## 🏗️ Architecture

This project follows the **Feature-Sliced Design (FSD)** methodology:

- `app/`: Global providers, styles, and entry points.
- `pages/`: Application pages (Dashboard, Auth, etc.).
- `features/`: Business-logic modules (Wallet tracking, Auth forms).
- `entities/`: Business entities (User, Wallet, Transaction).
- `shared/`: Reusable UI components, hooks, and utilities.

---

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript
- **Tooling**: Vite
- **Styling**: Tailwind CSS, DaisyUI, Lucide React (Icons)
- **State & Fetching**: TanStack Query (v5), Axios
- **Real-time**: Socket.io Client
- **Forms**: React Hook Form, Zod (Validation)
- **Animation**: Framer Motion

---

## 🏃 Running Locally

1. **Install Dependencies**:

   ```bash
   pnpm install
   ```

2. **Run Development Server**:

   ```bash
   pnpm dev
   ```

3. **Build for Production**:
   ```bash
   pnpm build
   ```

---

## 📄 Environment Variables

Create a `.env` file in this directory:

```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=http://localhost:3001
```

---

## 📄 License

This software is part of the Wallet Tracker suite and is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See the root [LICENSE](../LICENSE) file for more information.
...reactDom.configs.recommended.rules,
},
})

```

```
