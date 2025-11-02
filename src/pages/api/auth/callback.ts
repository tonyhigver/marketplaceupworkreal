import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;

  const client_id = process.env.GOOGLE_CLIENT_ID;
  const client_secret = process.env.GOOGLE_CLIENT_SECRET;
  const redirect_uri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

  const params = new URLSearchParams();
  params.append("code", code);
  params.append("client_id", client_id!);
  params.append("client_secret", client_secret!);
  params.append("redirect_uri", redirect_uri!);
  params.append("grant_type", "authorization_code");

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await response.json();

  // data contiene access_token, id_token, refresh_token, etc.
  console.log("Google OAuth Response:", data);

  // Redirige a frontend
  res.redirect(`/dashboard?token=${data.access_token}`);
}
