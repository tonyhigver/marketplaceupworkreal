"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  // Revisar si hay token guardado en localStorage
  useEffect(() => {
    const token = localStorage.getItem("google_access_token");
    const email = localStorage.getItem("google_user_email");
    if (token) {
      setUser({ email: email ?? undefined });
    }
    setLoading(false);
  }, []);

  const handleSignInWithGoogle = () => {
    // Redirige al endpoint API que inicia OAuth
    window.location.href = "/api/auth/google";
  };

  const handleSignOut = () => {
    localStorage.removeItem("google_access_token");
    localStorage.removeItem("google_user_email");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div>Comprobando sesión…</div>
      </div>
    );
  }

  // Usuario NO autenticado → mostrar login
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-6">
        <h1 className="text-4xl font-bold mb-6">Bienvenido a BrandHub</h1>
        <p className="text-gray-300 mb-6 max-w-xl text-center">
          Inicia sesión con Google para crear campañas y acceder a tu dashboard.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={handleSignInWithGoogle}
            className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-lg font-semibold shadow-lg transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M21.35 11.1h-9.18v2.92h5.5c-.24 1.5-1.7 4.39-5.5 4.39-3.31 0-6-2.73-6-6.09s2.69-6.09 6-6.09c1.88 0 3.14.8 3.86 1.49l2.64-2.55C17.87 2.9 15.22 1.5 12 1.5 6.21 1.5 1.5 6.18 1.5 11.97S6.21 22.44 12 22.44c6.59 0 11.25-4.62 11.25-11.34 0-.77-.09-1.35-.1-1.99z"
                fill="white"
              />
            </svg>
            Iniciar sesión con Google
          </button>

          <div className="text-center text-sm text-gray-400">
            O crea una cuenta con tu correo (si quieres implementar email/password).
          </div>
        </div>
      </div>
    );
  }

  // Usuario autenticado → mostrar la UI principal (redirección implícita)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-10">Bienvenido a BrandHub</h1>
      <div className="text-sm text-gray-300 mb-6">
        Conectado como <span className="font-medium">{user.email ?? "Usuario"}</span>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        <button
          onClick={() => router.push("/empresa")}
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-lg font-semibold shadow-lg transition-all"
        >
          🚀 Empresa / Startup
        </button>
        <button
          onClick={() => router.push("/individual")}
          className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-lg font-semibold shadow-lg transition-all"
        >
          🙋 Individual
        </button>
        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-2xl bg-gray-700 hover:bg-gray-600 text-sm text-gray-200 transition-all"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
