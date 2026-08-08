import { BrowserRouter, Routes, Route } from "react-router-dom";
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
      retry: 1, // Si falla un pedido, reintentá 1 vez
      staleTime: 1000 * 30, // Considera los datos "frescos" por 30 segundos
    },
  },
});

function App() {
  return (
    // QueryClientProvider: hace que React Query esté disponible en toda la app
    <QueryClientProvider client={queryClient}>
      {/* AuthProvider: hace que el contexto de auth esté disponible en toda la app */}
      <AuthProvider>
        {/* BrowserRouter: activa el sistema de rutas */}
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              <Routes>
                {/* Rutas públicas (cualquiera puede acceder) */}
                <Route path="/" element={<JobListPage />} />
                <Route path="/jobs" element={<JobListPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Rutas de empresa (solo accede quien tenga rol 'company') */}
                <Route
                  path="/company/dashboard"
                  element={
                    <ProtectedRoute allowedRole="company">
                      <CompanyDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Rutas de candidato (solo accede quien tenga rol 'candidate') */}
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
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
