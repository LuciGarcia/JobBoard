import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo / nombre */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          JobBoard
        </Link>

        {/* Navegación central */}
        <div className="flex items-center gap-6">
          <Link
            to="/jobs"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Ofertas
          </Link>

          {/* Links específicos por rol */}
          {user?.role === "company" && (
            <Link
              to="/company/dashboard"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Mi empresa
            </Link>
          )}
          {user?.role === "candidate" && (
            <Link
              to="/candidate/dashboard"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Mis postulaciones
            </Link>
          )}
        </div>

        {/* Auth: login/registro o datos del usuario */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-500">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded transition-colors"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
