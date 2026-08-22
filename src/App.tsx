import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./lib/auth"
import { ThemeProvider } from "./lib/theme"
import { LanguageProvider } from "./lib/i18n"
import { UnsavedGuardProvider } from "./lib/unsavedGuard"
import { RequireAuth } from "./components/RequireAuth"
import { Loader } from "./components/Loader"
import { Landing } from "./pages/Landing"

// Todo lo que no sea la landing se carga bajo demanda, así la landing
// no descarga el JS de la app completa (editor, dashboard, etc.) de entrada.
const Login = lazy(() => import("./pages/Login").then((m) => ({ default: m.Login })))
const Dashboard = lazy(() => import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })))
const CreatePage = lazy(() => import("./pages/CreatePage").then((m) => ({ default: m.CreatePage })))
const CreateImages = lazy(() => import("./pages/CreateImages").then((m) => ({ default: m.CreateImages })))
const CreateAvatar = lazy(() => import("./pages/CreateAvatar").then((m) => ({ default: m.CreateAvatar })))
const CreateLanding = lazy(() => import("./pages/CreateLanding").then((m) => ({ default: m.CreateLanding })))
const Pages = lazy(() => import("./pages/Pages").then((m) => ({ default: m.Pages })))
const Integraciones = lazy(() => import("./pages/Integraciones").then((m) => ({ default: m.Integraciones })))
const Perfil = lazy(() => import("./pages/Perfil").then((m) => ({ default: m.Perfil })))
const Configuracion = lazy(() => import("./pages/Configuracion").then((m) => ({ default: m.Configuracion })))
const Admin = lazy(() => import("./pages/Admin").then((m) => ({ default: m.Admin })))

function RouteFallback() {
  return <Loader show />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <ThemeProvider>
      <LanguageProvider>
      <UnsavedGuardProvider>
        <Suspense fallback={<RouteFallback />}>
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
            path="/app/avatares"
            element={
              <RequireAuth>
                <CreateAvatar />
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
          <Route path="/admin" element={<Admin />} />
        </Routes>
        </Suspense>
      </UnsavedGuardProvider>
      </LanguageProvider>
      </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
