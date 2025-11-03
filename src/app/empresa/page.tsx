"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import { supabase } from "@/lib/supabaseClient";

export default function EmpresaPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const fetchUserId = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) setUserId(user.id);
    } catch (err) {
      console.error("Error obteniendo UUID:", err);
    }
  };

  const fetchCampaigns = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("created_by", userId);
    if (!error) setCampaigns(data || []);
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header con botón de crear campaña */}
      <Header
        type="empresa"
        userId={userId ?? undefined}
        onCreateCampaign={(c) => setCampaigns((prev) => [...prev, c])}
      />

      <div className="p-10">
        <h2 className="text-3xl font-bold mb-8">Dashboard Empresa / Startup 🚀</h2>

        {campaigns.length === 0 && (
          <p className="text-gray-400">No tienes campañas creadas todavía.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {campaigns.map((c, i) => (
            <ProjectCard key={i} title={c.campaign_name} reward={c.budget} />
          ))}
        </div>
      </div>
    </div>
  );
}
