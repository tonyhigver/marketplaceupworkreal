"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import CreateCampaignForm from "@/components/CreateCampaignForm";
import { supabase } from "@/lib/supabaseClient";

export default function EmpresaPage() {
  const userId = "empresa-123"; // reemplazar con el id real del usuario
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const fetchCampaigns = async () => {
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
    fetchCampaigns();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header type="empresa" />

      <div className="p-10">
        <h2 className="text-3xl font-bold mb-8">Dashboard Empresa / Startup 🚀</h2>

        <div className="mb-6">
          <CreateCampaignForm
            userId={userId}
            onCreateCampaign={(c) => setCampaigns((prev) => [...prev, c])}
          />
        </div>

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
