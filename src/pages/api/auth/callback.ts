// C:\Proyectos\marketplaceupworkreal\marketplaceupworkreal\src\pages\api\auth\callback.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const code = req.query.code as string;

    if (!code) {
      res.status(400).json({ error: "Missing code query parameter" });
      return;
    }

    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;
    const redirect_uri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

    if (!client_id || !client_secret || !redirect_uri) {
      res.status(500).json({ error: "Missing Google OAuth environment variables" });
      return;
    }

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
      console.error("Google OAuth token error:", text);
      res.status(500).json({ error: "Failed to exchange code for token" });
      return;
    }

    const data = await response.json();

    console.log("Google OAuth Response:", data);

    // Redirige al frontend con el token
    res.redirect(`/dashboard?token=${data.access_token}`);
  } catch (err) {
    console.error("Unexpected error in Google OAuth callback:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
