import { BrowserRouter, Route, Routes } from "react-router-dom"
import Wallets from "./pages/Wallets"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { ToastContainer } from "react-toastify"
import { AuthProvider } from "./lib/context/AuthContext"
import Layout from "./layouts/Layout"
import Authorized from "./components/common/Authorized"
import { Suspense } from "react"
import WalletsSkeleton from "./features/wallets/components/WalletsSkeleton"
import Landing from "./pages/Landing"
import NotAuthorized from "./components/common/NotAuthorized"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Transactions from "./pages/Transactions"

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastContainer position="bottom-right" autoClose={2000} closeOnClick />
          <Routes>
            <Route path="/" element={
              <NotAuthorized>
                <Layout />
              </NotAuthorized>
            }>
              <Route index element={<Landing />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            <Route path="app" element={
              <Authorized>
                <Layout />
              </Authorized>
            }>
              <Route index element={<Transactions />} />
              <Route path="wallets" element={
                <Suspense fallback={<WalletsSkeleton />}>
                  <Wallets />
                </Suspense>
              } />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App
