import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).json({ error: "Falta el parámetro 'code' en la query" });
    }

    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;
    const redirect_uri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

    if (!client_id || !client_secret || !redirect_uri) {
      return res.status(500).json({ error: "Faltan variables de entorno de Google OAuth" });
    }

    // Intercambiar código por token
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("client_id", client_id);
    params.append("client_secret", client_secret);
    params.append("redirect_uri", redirect_uri);
    params.append("grant_type", "authorization_code");

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Error intercambiando código por token:", text);
      return res.status(500).json({ error: "Error al intercambiar código por token" });
    }

    const data = await response.json();

    // Decodificar id_token para obtener info del usuario
    const payload = data.id_token
      ? JSON.parse(Buffer.from(data.id_token.split(".")[1], "base64").toString())
      : null;

    if (!payload?.email) {
      return res.status(500).json({ error: "No se pudo obtener el email del token" });
    }

    const email = payload.email;
    const full_name = payload.name || "";
    const google_sub = payload.sub;

    // Guardar o actualizar usuario en tabla "users"
    const { data: userData, error: upsertError } = await supabase
      .from("users")
      .upsert(
        { google_sub, email, full_name },
        { onConflict: "google_sub" }
      )
      .select()
      .single();

    if (upsertError) {
      console.error("Error guardando usuario en Supabase:", upsertError);
      return res.status(500).json({ error: upsertError.message });
    }

    // Redirigir al frontend con token y UUID real de usuario
    res.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "/"}?token=${data.access_token}&userId=${userData.id}`
    );
  } catch (err) {
    console.error("Error inesperado en callback de Google OAuth:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
