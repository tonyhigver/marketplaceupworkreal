"use client"; // necesario porque usamos useState dentro del Header 

import CreateCampaignForm from "./CreateCampaignForm";

interface HeaderProps {
  type: "empresa" | "individual";
  connects?: number; // solo para individual
  onCreateCampaign?: (campaign: any) => void; // callback para crear campañas
}

export default function Header({ type, connects = 0, onCreateCampaign }: HeaderProps) {
  return (
    <header className="w-full flex justify-end items-center p-4 bg-gray-800 text-white shadow-md">
      <h1 className="text-xl font-bold mr-auto">BrandHub</h1>

      {type === "empresa" && onCreateCampaign && (
        // Botón en el Header que abre el modal
        <CreateCampaignForm onCreateCampaign={onCreateCampaign} />
      )}

      {type === "individual" && (
        <div className="px-4 py-2 bg-green-600 rounded-lg">
          Connects: {connects}
        </div>
      )}
    </header>
  );
}
