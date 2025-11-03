"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import AuthHandler from "@/components/AuthHandler";
import { supabase } from "@/lib/supabaseClient";

export default function EmpresaPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const hasFetched = useRef(false); // ✅ Evita recargar varias veces

  // ✅ Cuando se loguee el usuario, cargamos sus campañas una sola vez
  const handleUser = async (uid: string) => {
    console.log("🧭 Usuario logueado:", uid);
    setUserId(uid);

    if (!hasFetched.current) {
      hasFetched.current = true;
      await fetchCampaigns(uid);
    }
  };

  // ✅ Cargar campañas del usuario
  const fetchCampaigns = async (uid: string) => {
    try {
      setLoadingCampaigns(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("created_by", uid)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error cargando campañas:", error.message);
        setErrorMsg("Error al cargar campañas. Contacte a soporte.");
        setCampaigns([]);
      } else if (!data || data.length === 0) {
        console.warn("⚠️ No se encontraron campañas para el usuario.");
        setCampaigns([]);
      } else {
        console.log("📦 Campañas cargadas:", data);
        setCampaigns(data);
      }
    } catch (err: any) {
      console.error("💥 Error inesperado al obtener campañas:", err);
      setErrorMsg("Error de conexión con el servidor. Contacte a soporte.");
      setCampaigns([]);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 🔐 Manejo de autenticación */}
      <div className="p-4">
        <AuthHandler onUser={handleUser} />
      </div>

      {/* ✅ Header visible solo cuando hay usuario logueado */}
      {userId && (
        <Header
          type="empresa"
          onCreateCampaign={(newCampaign) => {
            setCampaigns((prev) => [newCampaign, ...prev]);
          }}
        />
      )}

      <div className="p-10">
        <h2 className="text-3xl font-bold mb-8">
          Dashboard Empresa / Startup 🚀
        </h2>

        {/* 🌀 Estado de carga (solo primera vez) */}
        {loadingCampaigns && !errorMsg && campaigns.length === 0 && (
          <p className="text-gray-400">Cargando tus campañas...</p>
        )}

        {/* ⚠️ Mensaje de error o sin campañas */}
        {!loadingCampaigns && campaigns.length === 0 && (
          <p className="text-gray-400">
            {errorMsg
              ? errorMsg
              : "No le sale ninguna, contacte a soporte."}
          </p>
        )}

        {/* ✅ Lista de campañas */}
        {!loadingCampaigns && campaigns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {campaigns.map((c) => (
              <ProjectCard
                key={c.id}
                title={c.campaign_name}
                reward={c.budget}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
