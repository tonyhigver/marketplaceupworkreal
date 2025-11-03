"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      // 🔹 Verificar si ya existe sesión activa
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log("✅ Usuario logeado:", session.user.id);
        setUser(session.user);
        router.replace("/empresa"); // 🚀 redirigir directamente
      }
      setLoading(false);
    };

    checkSession();

    // 🔹 Escuchar cambios de autenticación (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        console.log("🔄 Sesión actualizada:", session.user.id);
        setUser(session.user);
        router.replace("/empresa");
      } else {
        console.log("🚪 Sesión cerrada");
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    const redirectUrl =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectUrl}/empresa`, // ✅ vuelve al dashboard de empresa
      },
    });

    if (error) console.error("❌ Error al iniciar sesión con Google:", error.message);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        Cargando sesión…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-6">
        <h1 className="text-4xl font-bold mb-6">Bienvenido a BrandHub</h1>
        <p className="text-gray-300 mb-6 max-w-xl text-center">
          Inicia sesión con Google para crear campañas y acceder a tu dashboard.
        </p>
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-lg font-semibold shadow-lg transition-all"
        >
          Iniciar sesión con Google
        </button>
      </div>
    );
  }

  // 🔹 Usuario logeado → redirigido automáticamente arriba
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
      <p>Redirigiendo al dashboard...</p>
    </div>
  );
}
