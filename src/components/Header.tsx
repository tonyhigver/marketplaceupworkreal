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

  // Obtener userId automáticamente desde supabase y tabla users
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) return;

        const { data: userData, error } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        if (!error && userData?.id) setUserId(userData.id);
      } catch (err) {
        console.error("Error obteniendo UUID desde Header:", err);
      }
    };

    fetchUserId();
  }, []);

  return (
    <header className="w-full flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <h1 className="text-xl font-bold">BrandHub</h1>

      {type === "empresa" && (
        <div>
          <button
            className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition"
            onClick={() => {
              if (!userId) return; // todavía no se cargó
              setShowForm(true);
            }}
          >
            Crear Campaña
          </button>

          {showForm && userId && onCreateCampaign && (
            <CreateCampaignForm userId={userId} onCreateCampaign={onCreateCampaign} />
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
