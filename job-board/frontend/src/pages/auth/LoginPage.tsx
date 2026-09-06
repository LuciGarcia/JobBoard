import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/authApi";

// Tarjetas decorativas del panel izquierdo
const illustrationCards = [
  {
    initials: "DG",
    title: "Diana García",
    sub: "Product Designer · contratada",
  },
  {
    initials: "NX",
    title: "Nexora Tech",
    sub: "12 ofertas activas publicadas",
  },
  { initials: "+4", title: "2.480 candidatos", sub: "postulados esta semana" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Validación del lado del cliente antes de enviar al backend
  function validate() {
    const next: { email?: string; password?: string } = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Ingresá un correo electrónico válido.";
    }
    if (!password.trim()) {
      next.password = "La contraseña no puede estar vacía.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      // 1. Llamamos al backend con email y password
      const response = await loginUser({ email, password });
      // 2. Guardamos el token y cargamos el usuario en el contexto
      await login(response.access_token);
      // 3. Redirigimos al inicio (la Navbar ya mostrará el menú correcto según el rol)
      navigate("/");
    } catch (err: any) {
      setServerError(
        err.response?.data?.message ||
          "Credenciales incorrectas. Intentá de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    // Grid de dos columnas: panel izquierdo (ilustración) + panel derecho (formulario)
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2 -mt-0 fixed inset-0 z-50">
      {/* ── Panel izquierdo: solo visible en pantallas grandes (lg:) ── */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-blue-600 p-14 text-white lg:flex">
        {/* Formas decorativas de fondo (círculos semitransparentes) */}
        <div className="pointer-events-none absolute -right-28 -top-28 h-[420px] w-[420px] rounded-full bg-white/10 blur-sm" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-[300px] w-[300px] rounded-full bg-white/[0.07] blur-sm" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 text-xl font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/20">
            <Briefcase className="h-5 w-5" aria-hidden="true" />
          </span>
          JobBoard
        </div>

        {/* Texto central + tarjetas */}
        <div className="relative z-10 max-w-md">
          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight">
            Conectamos talento con las mejores empresas.
          </h1>
          <p className="text-lg text-white/85">
            La plataforma todo-en-uno para publicar ofertas, gestionar
            candidatos y contratar más rápido.
          </p>

          <div className="mt-8 grid gap-3.5">
            {illustrationCards.map((card) => (
              <div
                key={card.initials}
                className="flex items-center gap-3.5 rounded-xl border border-white/20 bg-white/[0.12] px-4 py-4 backdrop-blur-sm"
              >
                <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-white/20 font-bold text-sm">
                  {card.initials}
                </span>
                <div>
                  <b className="block text-sm">{card.title}</b>
                  <span className="text-xs text-white/75">{card.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm text-white/70">
          © 2026 JobBoard · Todos los derechos reservados
        </p>
      </section>

      {/* ── Panel derecho: formulario ── */}
      <section className="flex items-center justify-center bg-white px-6 py-10">
        <form onSubmit={handleSubmit} noValidate className="w-full max-w-sm">
          {/* Logo móvil (solo visible cuando el panel izquierdo está oculto) */}
          <div className="mb-10 flex items-center gap-2.5 text-xl font-bold text-gray-900 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
              <Briefcase className="h-5 w-5" aria-hidden="true" />
            </span>
            JobBoard
          </div>

          <h2 className="mb-1.5 text-2xl font-extrabold tracking-tight text-gray-900">
            Bienvenido a JobBoard
          </h2>
          <p className="mb-8 text-[15px] text-gray-500">
            Iniciá sesión para continuar
          </p>

          {/* Error del servidor (credenciales incorrectas, etc.) */}
          {serverError && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}

          {/* ── Campo email ── */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Correo electrónico
            </label>
            <div className="relative flex items-center">
              <Mail
                className="pointer-events-none absolute left-3.5 h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@empresa.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className={`h-12 w-full rounded-lg border bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:ring-2 ${
                  errors.email
                    ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* ── Campo contraseña ── */}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Contraseña
            </label>
            <div className="relative flex items-center">
              <Lock
                className="pointer-events-none absolute left-3.5 h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                className={`h-12 w-full rounded-lg border bg-white pl-11 pr-11 text-sm text-gray-900 outline-none transition focus:ring-2 ${
                  errors.password
                    ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {/* Botón para mostrar/ocultar contraseña */}
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                aria-label={
                  showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="absolute right-2 grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                {showPass ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* ── Recordarme + ¿Olvidaste? ── */}
          <div className="mb-6 flex items-center justify-between text-sm">
            <label className="flex cursor-pointer select-none items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer accent-blue-600 rounded border-gray-300"
              />
              Recordarme
            </label>
            <a href="#" className="font-semibold text-blue-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* ── Botón principal ── */}
          <button
            type="submit"
            disabled={submitting}
            className="h-11 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Ingresando…" : "Iniciar sesión"}
          </button>

          {/* ── Separador ── */}
          <div className="my-5 flex items-center gap-3.5 text-xs text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />
            o
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          {/* ── Registro ── */}
          <p className="mt-2 text-center text-sm text-gray-500">
            ¿No tenés cuenta?{" "}
            {/* Link de React Router: navega sin recargar la página */}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              Crear una cuenta
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
