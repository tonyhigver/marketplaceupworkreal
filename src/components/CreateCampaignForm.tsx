"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface CreateCampaignFormProps {
  userId: string; // UUID real del usuario logueado
  onCreateCampaign: (campaign: any) => void;
}

export default function CreateCampaignForm({ userId, onCreateCampaign }: CreateCampaignFormProps) {
  const [showModal, setShowModal] = useState(false);

  const [campaignName, setCampaignName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState<number | null>(null);
  const [objective, setObjective] = useState("");

  const [brandName, setBrandName] = useState("");
  const [brandValues, setBrandValues] = useState("");
  const [brandTone, setBrandTone] = useState("");
  const [brandAssets, setBrandAssets] = useState("");

  const [audience, setAudience] = useState("");
  const [contentType, setContentType] = useState("");
  const [contentGuidelines, setContentGuidelines] = useState("");

  const [restrictions, setRestrictions] = useState("");
  const [rewards, setRewards] = useState("");
  const [successMetrics, setSuccessMetrics] = useState("");
  const [references, setReferences] = useState("");

  const handleSubmit = async () => {
    console.log("🚀 handleSubmit triggered");
    console.log("userId recibido:", userId);

    if (!userId) {
      alert("Debes iniciar sesión para crear campañas");
      console.error("❌ No hay userId válido");
      return;
    }

    const campaignData = {
      campaign_name: campaignName || null,
      start_date: startDate || null,
      end_date: endDate || null,
      budget: budget || null,
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
      created_by: userId, // ✅ UUID real
    };

    console.log("📤 Datos que se van a enviar a Supabase:", campaignData);

    try {
      const { data, error } = await supabase
        .from("campaigns")
        .insert([campaignData])
        .select()
        .single();

      console.log("💾 Respuesta de Supabase:", { data, error });

      if (error) {
        console.error("❌ Error creando campaña:", error);
        alert("Error creando campaña: " + error.message);
        return;
      }

      console.log("✅ Campaña creada correctamente:", data);
      onCreateCampaign(data);
      setShowModal(false);

      // Limpiar campos
      setCampaignName(""); setStartDate(""); setEndDate(""); setBudget(null); setObjective("");
      setBrandName(""); setBrandValues(""); setBrandTone(""); setBrandAssets("");
      setAudience(""); setContentType(""); setContentGuidelines(""); setRestrictions("");
      setRewards(""); setSuccessMetrics(""); setReferences("");
      console.log("🧹 Campos del formulario reseteados");
    } catch (err) {
      console.error("💥 Error inesperado al crear campaña:", err);
      alert("Error inesperado al crear la campaña");
    }
  };

  return (
    <>
      {/* BOTÓN SIEMPRE VISIBLE */}
      <button
        className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition"
        onClick={() => {
          console.log("📌 Abriendo modal de crear campaña");
          setShowModal(true);
        }}
      >
        Crear Campaña
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center overflow-auto p-4">
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-3xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Nueva Campaña</h2>
            <div className="grid gap-3">
              <input type="text" placeholder="Nombre de la campaña" value={campaignName} onChange={(e) => { setCampaignName(e.target.value); console.log("campaignName:", e.target.value) }} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <div className="flex gap-2">
                <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); console.log("startDate:", e.target.value) }} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
                <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); console.log("endDate:", e.target.value) }} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              </div>
              <input type="number" placeholder="Presupuesto" value={budget ?? ""} onChange={(e) => { setBudget(e.target.value ? Number(e.target.value) : null); console.log("budget:", e.target.value) }} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <input type="text" placeholder="Objetivo principal" value={objective} onChange={(e) => { setObjective(e.target.value); console.log("objective:", e.target.value) }} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <input type="text" placeholder="Nombre de la marca" value={brandName} onChange={(e) => { setBrandName(e.target.value); console.log("brandName:", e.target.value) }} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <textarea placeholder="Valores de la marca" value={brandValues} onChange={(e) => { setBrandValues(e.target.value); console.log("brandValues:", e.target.value) }} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <input type="text" placeholder="Tono / Voz de la marca" value={brandTone} onChange={(e) => { setBrandTone(e.target.value); console.log("brandTone:", e.target.value) }} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <input type="text" placeholder="Link a assets / guía de estilo" value={brandAssets} onChange={(e) => { setBrandAssets(e.target.value); console.log("brandAssets:", e.target.value) }} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <textarea placeholder="Descripción del público objetivo" value={audience} onChange={(e) => { setAudience(e.target.value); console.log("audience:", e.target.value) }} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <input type="text" placeholder="Tipo de contenido" value={contentType} onChange={(e) => { setContentType(e.target.value); console.log("contentType:", e.target.value) }} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <textarea placeholder="Guías de contenido" value={contentGuidelines} onChange={(e) => { setContentGuidelines(e.target.value); console.log("contentGuidelines:", e.target.value) }} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <textarea placeholder="Reglas y restricciones" value={restrictions} onChange={(e) => { setRestrictions(e.target.value); console.log("restrictions:", e.target.value) }} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <input type="text" placeholder="Recompensas / incentivos" value={rewards} onChange={(e) => { setRewards(e.target.value); console.log("rewards:", e.target.value) }} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <textarea placeholder="Métricas de éxito" value={successMetrics} onChange={(e) => { setSuccessMetrics(e.target.value); console.log("successMetrics:", e.target.value) }} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
              <textarea placeholder="Material de referencia / links" value={references} onChange={(e) => { setReferences(e.target.value); console.log("references:", e.target.value) }} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"/>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition text-white">Crear</button>
              <button onClick={() => { console.log("📌 Cerrando modal de crear campaña"); setShowModal(false) }} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition text-white">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
