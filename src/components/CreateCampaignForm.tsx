"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface CreateCampaignFormProps {
  userId: string;
  onCreateCampaign: (campaign: any) => void;
  onClose: () => void;
}

export default function CreateCampaignForm({
  userId,
  onCreateCampaign,
  onClose,
}: CreateCampaignFormProps) {
  const [campaignName, setCampaignName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [budget, setBudget] = useState<number | null>(null);
  const [objective, setObjective] = useState<string>("");

  const [brandName, setBrandName] = useState<string>("");
  const [brandValues, setBrandValues] = useState<string>("");
  const [brandTone, setBrandTone] = useState<string>("");
  const [brandAssets, setBrandAssets] = useState<string>("");

  const [audience, setAudience] = useState<string>("");
  const [contentType, setContentType] = useState<string>("");
  const [contentGuidelines, setContentGuidelines] = useState<string>("");
  const [restrictions, setRestrictions] = useState<string>("");
  const [rewards, setRewards] = useState<string>("");
  const [successMetrics, setSuccessMetrics] = useState<string>("");
  const [references, setReferences] = useState<string>("");

  const handleSubmit = async () => {
    if (!userId) {
      alert("Debes iniciar sesión para crear campañas");
      return;
    }

    const campaignData = {
      campaign_name: campaignName || null,
      start_date: startDate || null,
      end_date: endDate || null,
      budget: budget ?? null,
      objective: objective || null,
      brand_name: brandName || null,
      brand_values: brandValues || null,
      brand_tone: brandTone || null,
      brand_assets: brandAssets || null,
      audience: audience || null,
      content_type: contentType || null,
      content_guidelines: contentGuidelines || null,
      restrictions: restrictions || null,
      rewards: rewards || null,
      success_metrics: successMetrics || null,
      references: references || null,
      created_by: userId,
    };

    const { data, error } = await supabase
      .from("campaigns")
      .insert([campaignData])
      .select()
      .single();

    if (error) {
      alert("Error creando campaña: " + error.message);
      console.error("❌ Error:", error);
      return;
    }

    onCreateCampaign(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-700">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Nueva Campaña 🚀
          </h2>

          {/* FORMULARIO */}
          <div className="grid gap-3">
            <input
              type="text"
              placeholder="Nombre de la campaña"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            />

            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              />
            </div>

            <input
              type="number"
              placeholder="Presupuesto (€)"
              value={budget ?? ""}
              onChange={(e) =>
                setBudget(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            />

            <input
              type="text"
              placeholder="Objetivo principal"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            />

            <input
              type="text"
              placeholder="Nombre de la marca"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            />

            <textarea
              placeholder="Valores de la marca"
              value={brandValues}
              onChange={(e) => setBrandValues(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 h-24"
            />

            <input
              type="text"
              placeholder="Tono / Voz de la marca"
              value={brandTone}
              onChange={(e) => setBrandTone(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            />

            <input
              type="text"
              placeholder="Link a assets / guía de estilo"
              value={brandAssets}
              onChange={(e) => setBrandAssets(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            />

            <textarea
              placeholder="Descripción del público objetivo"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 h-24"
            />

            <input
              type="text"
              placeholder="Tipo de contenido"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            />

            <textarea
              placeholder="Guías de contenido"
              value={contentGuidelines}
              onChange={(e) => setContentGuidelines(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 h-24"
            />

            <textarea
              placeholder="Reglas y restricciones"
              value={restrictions}
              onChange={(e) => setRestrictions(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 h-24"
            />

            <input
              type="text"
              placeholder="Recompensas / incentivos"
              value={rewards}
              onChange={(e) => setRewards(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            />

            <textarea
              placeholder="Métricas de éxito"
              value={successMetrics}
              onChange={(e) => setSuccessMetrics(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 h-24"
            />

            <textarea
              placeholder="Material de referencia / links"
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 h-24"
            />
          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-3 mt-6 sticky bottom-0 bg-gray-800 py-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition text-white"
            >
              Crear
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition text-white"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
