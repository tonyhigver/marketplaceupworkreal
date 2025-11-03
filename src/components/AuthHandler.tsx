"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthHandlerProps {
  onUser: (userId: string) => void;
}

export default function AuthHandler({ onUser }: AuthHandlerProps) {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      // ✅ Intentar recuperar sesión actual
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("❌ Error obteniendo sesión:", error.message);
        setLoading(false);
        return;
      }

      if (session?.user) {
        console.log("✅ Usuario activo:", session.user.id);
        setUserId(session.user.id);
        onUser(session.user.id);
        setLoading(false);
      } else {
        console.log("⚠️ No hay sesión activa");
        setUserId(null);
        setLoading(false);
      }

      // ✅ Escuchar cambios de autenticación (login/logout)
      const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          console.log("🔄 Sesión actualizada:", session.user.id);
          setUserId(session.user.id);
          onUser(session.user.id);
        } else {
          console.log("🚪 Sesión cerrada");
          setUserId(null);
        }
      });

      return () => {
        subscription.subscription.unsubscribe();
      };
    };

    initAuth();
  }, [onUser]);

  // ✅ Iniciar sesión con Google
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/empresa`, // vuelve al dashboard
      },
    });
    if (error) console.error("❌ Error iniciando sesión con Google:", error.message);
  };

  // ✅ Cerrar sesión
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("❌ Error cerrando sesión:", error.message);
    else console.log("👋 Sesión cerrada correctamente");
  };

  // 🧩 Renderizado del estado
  if (loading) return <div className="text-gray-400">Cargando usuario...</div>;

  if (!userId)
    return (
      <div className="flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-lg text-white">
        <p>No has iniciado sesión.</p>
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          Iniciar sesión con Google
        </button>
      </div>
    );

  return (
    <div className="flex items-center justify-between gap-4 p-2 bg-gray-800 text-white rounded-lg">
      <span className="text-sm">Usuario activo: {userId.slice(0, 8)}...</span>
      <button
        onClick={handleLogout}
        className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
