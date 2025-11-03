"use client";

import CreateCampaignForm from "./CreateCampaignForm";
import { useState } from "react";

interface HeaderProps {
  type: "empresa" | "individual";
  connects?: number;
  userId?: string;
  onCreateCampaign?: (campaign: any) => void;
}

export default function Header({
  type,
  connects = 0,
  userId,
  onCreateCampaign,
}: HeaderProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <header className="w-full flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <h1 className="text-xl font-bold">BrandHub</h1>

      {type === "empresa" && (
        <div>
          <button
            className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition"
            onClick={() => {
              if (!userId) {
                alert("Debes iniciar sesión para crear campañas");
                return;
              }
              setShowForm(true);
            }}
          >
            Crear Campaña
          </button>

          {/* Modal del formulario */}
          {showForm && userId && onCreateCampaign && (
            <CreateCampaignForm
              userId={userId}
              onCreateCampaign={onCreateCampaign}
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
