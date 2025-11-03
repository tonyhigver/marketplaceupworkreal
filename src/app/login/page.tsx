"use client";

import LoginButton from "@/components/LoginButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="p-8 rounded-xl bg-gray-800 shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Accede a tu cuenta 🚀</h1>
        <LoginButton />
      </div>
    </div>
  );
}
