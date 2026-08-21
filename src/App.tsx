import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./lib/auth"
import { RequireAuth } from "./components/RequireAuth"
import { Landing } from "./pages/Landing"
import { Login } from "./pages/Login"
import { Dashboard } from "./pages/Dashboard"
import { CreatePage } from "./pages/CreatePage"
import { CreateImages } from "./pages/CreateImages"
import { CreateLanding } from "./pages/CreateLanding"
import { Pages } from "./pages/Pages"
import { Integraciones } from "./pages/Integraciones"
import { Perfil } from "./pages/Perfil"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/app"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/app/generar"
            element={
              <RequireAuth>
                <CreatePage />
              </RequireAuth>
            }
          />
          <Route
            path="/app/imagenes"
            element={
              <RequireAuth>
                <CreateImages />
              </RequireAuth>
            }
          />
          <Route
            path="/app/landing"
            element={
              <RequireAuth>
                <CreateLanding />
              </RequireAuth>
            }
          />
          <Route
            path="/app/paginas"
            element={
              <RequireAuth>
                <Pages />
              </RequireAuth>
            }
          />
          <Route
            path="/app/integraciones"
            element={
              <RequireAuth>
                <Integraciones />
              </RequireAuth>
            }
          />
          <Route
            path="/app/perfil"
            element={
              <RequireAuth>
                <Perfil />
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
