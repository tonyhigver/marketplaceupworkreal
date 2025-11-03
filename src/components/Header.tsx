"use client";

import { useState, useEffect } from "react";
import CreateCampaignForm from "./CreateCampaignForm";
import { supabase } from "@/lib/supabaseClient";

interface HeaderProps {
  type: "empresa" | "individual";
  connects?: number;
  onCreateCampaign?: (campaign: any) => void;
}

export default function Header({ type, connects = 0, onCreateCampaign }: HeaderProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id); // <--- aquí ya tienes UUID real
    };
    fetchUser();
  }, []);

  return (
    <header className="w-full flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <h1 className="text-xl font-bold">BrandHub</h1>

      {type === "empresa" && (
        <div>
          <button
            className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition"
            onClick={() => setShowForm(true)}
            disabled={!userId}
          >
            {userId ? "Crear Campaña" : "Cargando..."}
          </button>

          {showForm && userId && onCreateCampaign && (
            <CreateCampaignForm
              userId={userId}
              onCreateCampaign={(campaign) => {
                onCreateCampaign(campaign);
                setShowForm(false);
              }}
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
