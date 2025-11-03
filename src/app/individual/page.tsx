"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import AuthHandler from "@/components/AuthHandler";
import { supabase } from "@/lib/supabaseClient";

export default function IndividualPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // ✅ Cuando se loguee el usuario, cargamos sus campañas
  const handleUser = async (uid: string) => {
    console.log("🧭 Usuario logeado:", uid);
    setUserId(uid);
    await fetchCampaigns(uid);
  };

  // ✅ Cargar campañas del usuario
  const fetchCampaigns = async (uid: string) => {
    setLoadingCampaigns(true);
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("created_by", uid)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error cargando campañas:", error.message);
    } else {
      console.log("📦 Campañas cargadas para individual:", data);
      setCampaigns(data || []);
    }
    setLoadingCampaigns(false);
    setInitialLoadDone(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 🔐 Manejo de autenticación */}
      <div className="p-4">
        <AuthHandler onUser={handleUser} />
      </div>

      {/* ✅ Header visible solo cuando hay usuario logueado */}
      {userId && <Header type="individual" connects={15} />}

      <div className="p-10">
        <h2 className="text-3xl font-bold mb-8">Dashboard Individual 🙋</h2>

        {/* Estado de carga solo en la primera carga */}
        {loadingCampaigns && !initialLoadDone && (
          <p className="text-gray-400">Cargando tus campañas...</p>
        )}

        {/* Si no hay campañas */}
        {!loadingCampaigns && campaigns.length === 0 && initialLoadDone && (
          <p className="text-gray-400">
            No le sale ninguna, contacte a soporte.
          </p>
        )}

        {/* Lista de campañas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {campaigns.map((c) => (
            <ProjectCard key={c.id} title={c.campaign_name} reward={c.budget} />
          ))}
        </div>
      </div>
    </div>
  );
}
