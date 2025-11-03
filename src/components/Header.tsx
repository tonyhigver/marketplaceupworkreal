"use client";

import { useState, useEffect } from "react";
import CreateCampaignForm from "./CreateCampaignForm";
import { supabase } from "@/lib/supabaseClient";

interface HeaderProps {
  type: "empresa" | "individual";
  connects?: number;
  onCreateCampaign?: (campaign: any) => void;
}

export default function Header({ type, connects = 0, onCreateCampaign }: HeaderProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Obtener el UUID real del usuario logueado directamente desde Supabase Auth
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error obteniendo usuario:", error);
          return;
        }

        if (user?.id) {
          console.log("✅ UUID del usuario logeado:", user.id);
          setUserId(user.id);
        } else {
          console.warn("⚠️ No hay usuario logeado");
        }
      } catch (err) {
        console.error("💥 Error obteniendo UUID desde Header:", err);
      }
    };

    fetchUserId();
  }, []);

  return (
    <header className="w-full flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <h1 className="text-xl font-bold">BrandHub</h1>

      {type === "empresa" && (
        <div>
          {/* ✅ Botón que abre el formulario completo */}
          <button
            className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition"
            onClick={() => {
              console.log("📌 Click en Crear Campaña desde Header");
              setShowForm(true);
            }}
            disabled={!userId}
          >
            {userId ? "Crear Campaña" : "Cargando..."}
          </button>

          {/* ✅ Mostrar modal del formulario cuando showForm es true */}
          {showForm && userId && (
            <CreateCampaignForm
              userId={userId}
              onCreateCampaign={(campaign) => {
                console.log("🎉 Campaña creada:", campaign);
                onCreateCampaign?.(campaign);
                setShowForm(false); // cerrar formulario después de crear
              }}
            />
          )}
        </div>
      )}

      {type === "individual" && (
        <div className="px-4 py-2 bg-green-600 rounded-lg">
          Connects: {connects}
        </div>
      )}
    </header>
  );
}
