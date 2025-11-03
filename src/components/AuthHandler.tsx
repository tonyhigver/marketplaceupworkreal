"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthHandlerProps {
  onUser: (userId: string) => void;
}

export default function AuthHandler({ onUser }: AuthHandlerProps) {
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error obteniendo sesión:", error);
        return;
      }

      if (session?.user) {
        onUser(session.user.id); // ✅ UUID válido de Supabase
      }
    };

    fetchUser();
  }, [onUser]);

  return <div>Cargando usuario...</div>;
}
