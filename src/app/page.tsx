"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    // Primero revisa token en localStorage
    let token = localStorage.getItem("google_access_token");
    let email = localStorage.getItem("google_user_email");

    // Si viene en la query (redirección de callback)
    const params = new URLSearchParams(window.location.search);
    const tokenFromQuery = params.get("token");
    const emailFromQuery = params.get("email");

    if (tokenFromQuery && emailFromQuery) {
      token = tokenFromQuery;
      email = emailFromQuery;
      localStorage.setItem("google_access_token", token);
      localStorage.setItem("google_user_email", email);
      // Limpia la URL
      window.history.replaceState({}, "", "/");
    }

    if (token && email) setUser({ email });
    setLoading(false);
  }, []);

  const handleSignInWithGoogle = () => {
    window.location.href = "/api/auth/google";
  };

  const handleSignOut = () => {
    localStorage.removeItem("google_access_token");
    localStorage.removeItem("google_user_email");
    setUser(null);
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">Comprobando sesión…</div>;

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-6">
        <h1 className="text-4xl font-bold mb-6">Bienvenido a BrandHub</h1>
        <p className="text-gray-300 mb-6 max-w-xl text-center">
          Inicia sesión con Google para crear campañas y acceder a tu dashboard.
        </p>
        <button
          onClick={handleSignInWithGoogle}
          className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-lg font-semibold shadow-lg transition-all"
        >
          Iniciar sesión con Google
        </button>
      </div>
    );
  }

  // Usuario autenticado → UI principal
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-10">Bienvenido a BrandHub</h1>
      <div className="text-sm text-gray-300 mb-6">
        Conectado como <span className="font-medium">{user.email ?? "Usuario"}</span>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        <button onClick={() => router.push("/empresa")} className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-lg font-semibold shadow-lg transition-all">🚀 Empresa / Startup</button>
        <button onClick={() => router.push("/individual")} className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-lg font-semibold shadow-lg transition-all">🙋 Individual</button>
        <button onClick={handleSignOut} className="w-full py-3 rounded-2xl bg-gray-700 hover:bg-gray-600 text-sm text-gray-200 transition-all">Cerrar sesión</button>
      </div>
    </div>
  );
}
