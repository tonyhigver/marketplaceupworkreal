"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function GoogleLoginCallback({ onLogin }: { onLogin: (userId: string) => void }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session?.user) {
        console.error("❌ Error al obtener sesión:", error);
        setLoading(false);
        return;
      }

      const user = session.user;

      // Upsert del usuario en la tabla "users" para obtener UUID
      const { data: userData, error: upsertError } = await supabase
        .from("users")
        .upsert(
          {
            id: user.id,            // UUID proporcionado por Supabase Auth
            email: user.email,
            full_name: user.user_metadata.full_name || user.email,
          },
          { onConflict: "id", returning: "representation" } // devolver fila insertada/actualizada
        )
        .select()
        .single();

      if (upsertError) {
        console.error("❌ Error al registrar usuario:", upsertError);
        setLoading(false);
        return;
      }

      console.log("✅ Usuario autenticado con UUID:", userData.id);
      onLogin(userData.id); // <-- enviamos UUID al frontend
      setLoading(false);
    };

    handleAuth();
  }, [onLogin]);

  if (loading) return <div>Cargando sesión...</div>;
  return null;
}
