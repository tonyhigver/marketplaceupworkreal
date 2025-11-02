// src/pages/api/auth/google.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const redirect_uri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

  if (!client_id || !redirect_uri) {
    return res
      .status(500)
      .json({ error: "Falta configurar GOOGLE_CLIENT_ID o NEXT_PUBLIC_GOOGLE_REDIRECT_URI" });
  }

  // Construir URL de autorización de Google OAuth 2.0
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", client_id);
  authUrl.searchParams.set("redirect_uri", redirect_uri);
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("access_type", "offline"); // para obtener refresh_token
  authUrl.searchParams.set("prompt", "consent"); // fuerza pedir consentimiento

  // Redirigir al usuario a Google
  res.redirect(authUrl.toString());
}
