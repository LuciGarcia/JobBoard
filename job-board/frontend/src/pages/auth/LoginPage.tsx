import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/authApi";

export default function LoginPage() {
  // Estado local del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Mensaje de error a mostrar
  const [loading, setLoading] = useState(false); // Para deshabilitar el botón mientras carga

  const { login } = useAuth();
  const navigate = useNavigate(); // Hook para navegar a otra ruta programáticamente

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que el formulario recargue la página (comportamiento HTML por defecto)
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      await login(response.access_token); // Guardamos el token y cargamos el usuario
      navigate("/"); // Redirigimos al inicio
    } catch (err: any) {
      // Mostramos el mensaje de error que devolvió el backend
      setError(err.response?.data?.message || "Credenciales incorrectas");
    } finally {
      setLoading(false); // Siempre se ejecuta, haya error o no
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Iniciar sesión
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Registrate
          </Link>
        </p>

        {/* Mensaje de error (solo se muestra si hay error) */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
