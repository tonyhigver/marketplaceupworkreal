"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [choosingRole, setChoosingRole] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      // 🔹 Obtener sesión actual
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("❌ Error al obtener sesión:", error.message);

      const currentUser = data?.session?.user;

      if (currentUser) {
        console.log("✅ Sesión activa:", currentUser.email);
        setUser(currentUser);

        // 🔹 Buscar usuario por email en la tabla users
        const { data: existingUser, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("email", currentUser.email)
          .maybeSingle();

        if (userError) {
          console.error("❌ Error buscando usuario:", userError.message);
        }

        if (!existingUser) {
          console.log("🆕 Usuario nuevo → debe elegir rol");
          setChoosingRole(true);
        } else {
          console.log("🎯 Usuario existente, rol:", existingUser.role);
          router.replace(`/${existingUser.role}`);
        }
      } else {
        console.log("⚠️ No hay sesión activa");
      }

      setLoading(false);
    };

    checkSession();

    // 🔹 Escucha cambios de sesión (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  // ✅ Login con Google
  const handleLogin = async () => {
    const redirectUrl =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    console.log("🌍 redirectUrl:", redirectUrl);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectUrl}/`, // 👈 vuelve a la raíz
      },
    });

    if (error) console.error("❌ Error al iniciar sesión:", error.message);
  };

  // ✅ Guardar elección de rol en Supabase (por email)
  const handleSelectRole = async (selectedRole: string) => {
    if (!user) return;

    const { error } = await supabase.from("users").insert([
      {
        email: user.email,
        role: selectedRole,
      },
    ]);

    if (error) {
      console.error("❌ Error guardando rol:", error.message);
      alert("Hubo un error guardando tu rol. Revisa la consola.");
      return;
    }

    console.log("✅ Rol guardado correctamente:", selectedRole);
    setChoosingRole(false);
    router.replace(`/${selectedRole}`);
  };

  // 🌀 Pantalla de carga
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        Cargando sesión…
      </div>
    );

  // 🚪 Usuario no logueado → pantalla de login
  if (!user)
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

  // 🧩 Usuario nuevo → elegir rol
  if (choosingRole)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Elige tu tipo de cuenta</h1>
        <p className="text-gray-300 mb-8 text-center">
          Selecciona cómo quieres usar BrandHub.
        </p>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={() => handleSelectRole("empresa")}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-lg font-semibold shadow-lg transition-all"
          >
            🚀 Soy una empresa / startup
          </button>
          <button
            onClick={() => handleSelectRole("individual")}
            className="w-full py-3 rounded-2xl bg-green-600 hover:bg-green-500 text-lg font-semibold shadow-lg transition-all"
          >
            🙋 Soy un creador individual
          </button>
        </div>
      </div>
    );

  // 🚀 Usuario existente → redirigiendo
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
      <p>Redirigiendo al dashboard...</p>
    </div>
  );
}
