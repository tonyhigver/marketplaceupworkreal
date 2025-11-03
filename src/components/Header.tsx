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
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
        } else {
          setUserId(null);
        }
      });

      return () => {
        listener.subscription.unsubscribe();
      };
    };

    loadUser();
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

          {showForm && userId && (
            <CreateCampaignForm
              userId={userId}
              onCreateCampaign={(campaign) => {
                onCreateCampaign?.(campaign);
                setShowForm(false);
              }}
              onClose={() => setShowForm(false)}
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
