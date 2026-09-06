import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/shared/ProtectedRoute";

// Páginas públicas
import JobListPage from "./pages/public/JobListPage";

// Páginas de auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Páginas de empresa
import CompanyDashboard from "./pages/company/CompanyDashboard";

// Páginas de candidato
import CandidateDashboard from "./pages/candidate/CandidateDashboard";

// QueryClient: configuración global de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30,
    },
  },
});

// Rutas donde NO queremos mostrar la Navbar
// (login y registro tienen su propio diseño de pantalla completa)
const ROUTES_WITHOUT_NAVBAR = ["/login", "/register"];

function Layout() {
  const location = useLocation();
  const hideNavbar = ROUTES_WITHOUT_NAVBAR.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<JobListPage />} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute allowedRole="company">
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/dashboard"
            element={
              <ProtectedRoute allowedRole="candidate">
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* BrowserRouter debe envolver todo lo que use rutas o el hook useLocation */}
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
