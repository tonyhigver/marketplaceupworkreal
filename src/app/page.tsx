"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-10">Bienvenido a BrandHub</h1>
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
      </div>
    </div>
  );
}
