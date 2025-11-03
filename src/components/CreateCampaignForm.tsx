"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface CreateCampaignFormProps {
  userId: string;
  onCreateCampaign: (campaign: any) => void;
}

export default function CreateCampaignForm({ userId, onCreateCampaign }: CreateCampaignFormProps) {
  const [showModal, setShowModal] = useState(true); // modal se abre SOLO cuando setShowForm(true)

  const [campaignName, setCampaignName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState<number | null>(null);
  const [objective, setObjective] = useState("");

  const handleSubmit = async () => {
    if (!userId) {
      alert("Debes iniciar sesión para crear campañas");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("campaigns")
        .insert([{
          campaign_name: campaignName,
          start_date: startDate,
          end_date: endDate,
          budget: budget,
          objective,
          created_by: userId
        }])
        .select()
        .single();

      if (error) {
        alert("Error creando campaña: " + error.message);
        return;
      }

      onCreateCampaign(data);
      setShowModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center overflow-auto p-4">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-3xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Nueva Campaña</h2>

        <input type="text" placeholder="Nombre de la campaña"
        value={campaignName} onChange={(e) => setCampaignName(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"/>

        <div className="flex gap-2 mb-3">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
        </div>

        <input type="number" placeholder="Presupuesto"
        value={budget ?? ""} onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : null)}
        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"/>

        <input type="text" placeholder="Objetivo"
        value={objective} onChange={(e) => setObjective(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"/>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition text-white">Crear</button>
          <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition text-white">Cancelar</button>
        </div>
      </div>
    </div>
  );
}
