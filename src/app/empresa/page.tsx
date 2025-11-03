"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import { supabase } from "@/lib/supabaseClient";

export default function EmpresaPage() {
  const [userId, setUserId] = useState<string | null>(null); // UUID real del usuario
  const [campaigns, setCampaigns] = useState<any[]>([]);

  // Obtener UUID real del usuario logueado
  const fetchUserId = async () => {
    try {
      const user = supabase.auth.getUser(); // obtener usuario logueado
      const { data: sessionData } = await user;
      if (!sessionData?.user?.email) {
        console.error("❌ No se encontró email del usuario autenticado");
        return;
      }
      const email = sessionData.user.email;
      console.log("📧 Email del usuario autenticado:", email);

      const { data: userData, error } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (error) {
        console.error("❌ Error obteniendo UUID del usuario:", error);
        return;
      }

      console.log("🆔 UUID del usuario obtenido:", userData.id);
      setUserId(userData.id);
    } catch (err) {
      console.error("💥 Error inesperado al obtener UUID:", err);
    }
  };

  const fetchCampaigns = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("created_by", userId);
    if (error) console.error("❌ Error fetching campaigns:", error);
    else {
      console.log("📥 Campañas cargadas:", data);
      setCampaigns(data || []);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* PASAR userId y callback onCreateCampaign al Header */}
      <Header
        type="empresa"
        userId={userId ?? undefined}
        onCreateCampaign={(c) => setCampaigns((prev) => [...prev, c])}
      />

      <div className="p-10">
        <h2 className="text-3xl font-bold mb-8">Dashboard Empresa / Startup 🚀</h2>

        {campaigns.length === 0 && <p className="text-gray-400">No tienes campañas creadas todavía.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {campaigns.map((c, i) => (
            <ProjectCard key={i} title={c.campaign_name} reward={c.budget} />
          ))}
        </div>
      </div>
    </div>
  );
}
