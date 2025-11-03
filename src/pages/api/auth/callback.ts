"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback({ onUser }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error obteniendo sesión:", sessionError);
        setLoading(false);
        return;
      }

      if (!session) {
        setLoading(false);
        return;
      }

      const user = session.user;

      // Upsert en tabla 'users' para obtener el UUID correcto
      const { data: userData, error: upsertError } = await supabase
        .from("users")
        .upsert(
          {
            id: user.id, // ✅ UUID generado por Supabase
            email: user.email,
            full_name: user.user_metadata.full_name || null
          },
          { onConflict: "id", returning: "representation" }
        )
        .select()
        .single();

      if (upsertError) {
        console.error("Error al guardar usuario:", upsertError);
        setLoading(false);
        return;
      }

      console.log("Usuario logueado con UUID:", userData.id);

      // Pasamos al frontend
      onUser(userData.id); // ✅ Esto será el userId que usarás en CreateCampaignForm
      setLoading(false);
    };

    fetchUser();
  }, [onUser]);

  if (loading) return <div>Cargando...</div>;
  return null;
}
