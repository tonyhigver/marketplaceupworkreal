"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface CreateCampaignFormProps {
  userId: string; // id del usuario / empresa
  onCreateCampaign: (campaign: any) => void;
}

export default function CreateCampaignForm({ userId, onCreateCampaign }: CreateCampaignFormProps) {
  const [showModal, setShowModal] = useState(false);

  // Información básica
  const [campaignName, setCampaignName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState(0);
  const [objective, setObjective] = useState("");

  // Información de la marca
  const [brandName, setBrandName] = useState("");
  const [brandValues, setBrandValues] = useState("");
  const [brandTone, setBrandTone] = useState("");
  const [brandAssets, setBrandAssets] = useState("");

  // Público objetivo
  const [audience, setAudience] = useState("");

  // Tipo de contenido
  const [contentType, setContentType] = useState("");
  const [contentGuidelines, setContentGuidelines] = useState("");

  // Reglas y restricciones
  const [restrictions, setRestrictions] = useState("");

  // Incentivos / métricas
  const [rewards, setRewards] = useState("");
  const [successMetrics, setSuccessMetrics] = useState("");

  // Material de referencia
  const [references, setReferences] = useState("");

  const handleSubmit = async () => {
    const campaignData = {
      campaign_name: campaignName,
      start_date: startDate,
      end_date: endDate,
      budget,
      objective,
      brand_name: brandName,
      brand_values: brandValues,
      brand_tone: brandTone,
      brand_assets: brandAssets,
      audience,
      content_type: contentType,
      content_guidelines: contentGuidelines,
      restrictions,
      rewards,
      success_metrics: successMetrics,
      references,
      created_by: userId,
    };

    const { data, error } = await supabase
      .from("campaigns")
      .insert([campaignData])
      .select()
      .single();

    if (error) {
      console.error("Error creando campaña:", error.message);
      return;
    }

    onCreateCampaign(data);
    setShowModal(false);

    // Limpiar campos
    setCampaignName(""); setStartDate(""); setEndDate(""); setBudget(0); setObjective("");
    setBrandName(""); setBrandValues(""); setBrandTone(""); setBrandAssets("");
    setAudience(""); setContentType(""); setContentGuidelines(""); setRestrictions("");
    setRewards(""); setSuccessMetrics(""); setReferences("");
  };

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition"
        onClick={() => setShowModal(true)}
      >
        Crear Campaña
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center overflow-auto p-4">
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-3xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Nueva Campaña</h2>
            <div className="grid gap-3">
              <input type="text" placeholder="Nombre de la campaña" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <div className="flex gap-2">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              </div>
              <input type="number" placeholder="Presupuesto" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <input type="text" placeholder="Objetivo principal" value={objective} onChange={(e) => setObjective(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>

              <input type="text" placeholder="Nombre de la marca" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <textarea placeholder="Valores de la marca" value={brandValues} onChange={(e) => setBrandValues(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <input type="text" placeholder="Tono / Voz de la marca" value={brandTone} onChange={(e) => setBrandTone(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <input type="text" placeholder="Link a assets / guía de estilo" value={brandAssets} onChange={(e) => setBrandAssets(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>

              <textarea placeholder="Descripción del público objetivo" value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>

              <input type="text" placeholder="Tipo de contenido" value={contentType} onChange={(e) => setContentType(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <textarea placeholder="Guías de contenido" value={contentGuidelines} onChange={(e) => setContentGuidelines(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>

              <textarea placeholder="Reglas y restricciones" value={restrictions} onChange={(e) => setRestrictions(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <input type="text" placeholder="Recompensas / incentivos" value={rewards} onChange={(e) => setRewards(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <textarea placeholder="Métricas de éxito" value={successMetrics} onChange={(e) => setSuccessMetrics(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <textarea placeholder="Material de referencia / links" value={references} onChange={(e) => setReferences(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition text-white">Crear</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition text-white">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
