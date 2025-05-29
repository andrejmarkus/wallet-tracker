import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { ToastContainer } from "react-toastify"
import { AuthProvider } from "./lib/context/AuthContext"
import Layout from "./layouts/Layout"
import Authorized from "./components/Authorized"
import { Suspense } from "react"
import HomeSkeleton from "./pages/HomeSkeleton"
import Landing from "./pages/Landing"
import NotAuthorized from "./components/NotAuthorized"

function App() {
  return (
    <BrowserRouter>
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
            <Route index element={
              <Suspense fallback={<HomeSkeleton />}>
                <Home />
              </Suspense>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
