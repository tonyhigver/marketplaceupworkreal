"use client";

import CreateCampaignForm from "./CreateCampaignForm";

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
  return (
    <header className="w-full flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <h1 className="text-xl font-bold">BrandHub</h1>

      {type === "empresa" && (
        // Siempre renderiza el botón, aunque userId todavía no esté
        <div>
          {userId && onCreateCampaign ? (
            <CreateCampaignForm userId={userId} onCreateCampaign={onCreateCampaign} />
          ) : (
            <button
              className="px-4 py-2 bg-blue-600 rounded-lg text-white cursor-not-allowed opacity-50"
              disabled
            >
              Cargando...
            </button>
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
