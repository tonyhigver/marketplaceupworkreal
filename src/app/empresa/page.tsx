"use client"; // necesario porque usamos useState

import { useState } from "react";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import CreateCampaignForm from "@/components/CreateCampaignForm";

export default function EmpresaPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  // Función que recibe la campaña creada desde el formulario
  const handleCreateCampaign = (campaign: any) => {
    setCampaigns((prev) => [...prev, campaign]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header superior con botón de Crear Campaña */}
      <Header type="empresa" onCreateCampaign={handleCreateCampaign} />

      {/* Dashboard de proyectos */}
      <div className="p-10">
        <h2 className="text-3xl font-bold mb-8">Dashboard Empresa / Startup 🚀</h2>

        {campaigns.length === 0 && (
          <p className="text-gray-400">No tienes campañas creadas todavía.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {campaigns.map((c, i) => (
            <ProjectCard key={i} title={c.campaignName} reward={c.budget} />
          ))}
        </div>
      </div>
    </div>
  );
}
