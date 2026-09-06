import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  User,
} from "lucide-react";
import { registerUser, loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../types";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("candidate");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  function validate() {
    const next: { email?: string; password?: string } = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Ingresá un correo electrónico válido.";
    }
    if (password.length < 6) {
      next.password = "La contraseña debe tener al menos 6 caracteres.";
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
      await registerUser({ email, password, role });
      const authResponse = await loginUser({ email, password });
      await login(authResponse.access_token);
      // Redirigimos al dashboard según el rol registrado
      navigate(
        role === "company" ? "/company/dashboard" : "/candidate/dashboard",
      );
    } catch (err: any) {
      setServerError(
        err.response?.data?.message ||
          "Error al crear la cuenta. Intentá de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2 -mt-0 fixed inset-0 z-50">
      {/* ── Panel izquierdo (mismo estilo que LoginPage) ── */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-blue-600 p-14 text-white lg:flex">
        <div className="pointer-events-none absolute -right-28 -top-28 h-[420px] w-[420px] rounded-full bg-white/10 blur-sm" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-[300px] w-[300px] rounded-full bg-white/[0.07] blur-sm" />

        <div className="relative z-10 flex items-center gap-3 text-xl font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/20">
            <Briefcase className="h-5 w-5" aria-hidden="true" />
          </span>
          JobBoard
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight">
            Tu próxima oportunidad empieza acá.
          </h1>
          <p className="text-lg text-white/85">
            Registrate gratis y accedé a miles de ofertas o publicá posiciones
            para encontrar al candidato ideal.
          </p>

          {/* Beneficios según el tipo de usuario */}
          <div className="mt-8 grid gap-3.5">
            {[
              {
                icon: "🎯",
                title: "Para candidatos",
                desc: "Aplicá a ofertas en segundos y seguí el estado de tus postulaciones.",
              },
              {
                icon: "🏢",
                title: "Para empresas",
                desc: "Publicá ofertas, filtrá candidatos y gestioná todo desde un panel.",
              },
              {
                icon: "🔒",
                title: "Siempre seguro",
                desc: "Tus datos protegidos. Sin spam, sin contactos no deseados.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3.5 rounded-xl border border-white/20 bg-white/[0.12] px-4 py-4 backdrop-blur-sm"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <b className="block text-sm">{item.title}</b>
                  <span className="text-xs text-white/75">{item.desc}</span>
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
          {/* Logo móvil */}
          <div className="mb-10 flex items-center gap-2.5 text-xl font-bold text-gray-900 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
              <Briefcase className="h-5 w-5" aria-hidden="true" />
            </span>
            JobBoard
          </div>

          <h2 className="mb-1.5 text-2xl font-extrabold tracking-tight text-gray-900">
            Crear una cuenta
          </h2>
          <p className="mb-8 text-[15px] text-gray-500">
            ¿Ya tenés cuenta?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Iniciá sesión
            </Link>
          </p>

          {serverError && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}

          {/* ── Selector de rol ── */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Me registro como
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("candidate")}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 py-3 text-sm font-medium transition-all ${
                  role === "candidate"
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <User className="h-4 w-4" />
                Candidato
              </button>
              <button
                type="button"
                onClick={() => setRole("company")}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 py-3 text-sm font-medium transition-all ${
                  role === "company"
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <Building2 className="h-4 w-4" />
                Empresa
              </button>
            </div>
          </div>

          {/* ── Email ── */}
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

          {/* ── Contraseña ── */}
          <div className="mb-6">
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
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                className={`h-12 w-full rounded-lg border bg-white pl-11 pr-11 text-sm text-gray-900 outline-none transition focus:ring-2 ${
                  errors.password
                    ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
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

          <button
            type="submit"
            disabled={submitting}
            className="h-11 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creando cuenta…" : "Crear cuenta"}
          </button>

          <p className="mt-6 text-center text-xs text-gray-400">
            Al registrarte aceptás nuestros{" "}
            <a href="#" className="underline hover:text-gray-600">
              Términos de uso
            </a>{" "}
            y{" "}
            <a href="#" className="underline hover:text-gray-600">
              Política de privacidad
            </a>
            .
          </p>
        </form>
      </section>
    </main>
  );
}
