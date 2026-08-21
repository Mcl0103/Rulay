import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./lib/auth"
import { ThemeProvider } from "./lib/theme"
import { LanguageProvider } from "./lib/i18n"
import { UnsavedGuardProvider } from "./lib/unsavedGuard"
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
import { Configuracion } from "./pages/Configuracion"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <ThemeProvider>
      <LanguageProvider>
      <UnsavedGuardProvider>
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
          <Route
            path="/app/configuracion"
            element={
              <RequireAuth>
                <Configuracion />
              </RequireAuth>
            }
          />
        </Routes>
      </UnsavedGuardProvider>
      </LanguageProvider>
      </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
