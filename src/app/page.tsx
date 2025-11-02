"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Chequea sesión al montar y subscribirse a cambios de auth
  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      }
      if (!mounted) return;
      setUser(sessionData?.session?.user ?? null);
      setLoading(false);
    };

    check();

    // Subscribe a cambios de auth (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      setErrorMsg(null);
      // Esto redirige al flujo OAuth de Supabase/Google
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // scopes opcionales, p. ej. "email profile openid"
          scopes: "email profile openid",
        },
      });
      if (error) {
        console.error("Error signInWithOAuth:", error);
        setErrorMsg(error.message);
      }
      // después de esto, Supabase redirigirá a la consola de Google y volverá al callback de Supabase
    } catch (err: any) {
      console.error("Unexpected error on sign in:", err);
      setErrorMsg(err?.message ?? "Error desconocido");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div>Comprobando sesión…</div>
      </div>
    );
  }

  // Si NO hay usuario autenticado → mostrar CTA de login con Google
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
              <path d="M21.35 11.1h-9.18v2.92h5.5c-.24 1.5-1.7 4.39-5.5 4.39-3.31 0-6-2.73-6-6.09s2.69-6.09 6-6.09c1.88 0 3.14.8 3.86 1.49l2.64-2.55C17.87 2.9 15.22 1.5 12 1.5 6.21 1.5 1.5 6.18 1.5 11.97S6.21 22.44 12 22.44c6.59 0 11.25-4.62 11.25-11.34 0-.77-.09-1.35-.1-1.99z" fill="white" />
            </svg>
            Iniciar sesión con Google
          </button>

          <div className="text-center text-sm text-gray-400">
            O crea una cuenta con tu correo (habilítalo en Supabase si quieres).
          </div>

          {errorMsg && <div className="text-red-400 text-sm mt-2">{errorMsg}</div>}
        </div>
      </div>
    );
  }

  // Si hay usuario autenticado → mostrar la UI original
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-10">Bienvenido a BrandHub</h1>
      <div className="text-sm text-gray-300 mb-6">
        Conectado como <span className="font-medium">{user.email ?? user.id}</span>
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
