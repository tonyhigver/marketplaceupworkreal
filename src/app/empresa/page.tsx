"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";

export default function EmpresaPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header
        type="empresa"
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
