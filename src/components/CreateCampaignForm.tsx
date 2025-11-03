"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface CreateCampaignFormProps {
  userId: string;
  onCreateCampaign: (campaign: any) => void;
}

export default function CreateCampaignForm({ userId, onCreateCampaign }: CreateCampaignFormProps) {
  const [showModal, setShowModal] = useState(false);

  const [campaignName, setCampaignName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState(0);
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
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (!session) {
      alert("Debes estar logueado para crear campañas.");
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
      created_by: session.user.email, // AQUI EL CAMBIO IMPORTANTE
    };

    console.log("📤 Enviando campaña a Supabase:", campaignData);

    try {
      const { data, error } = await supabase
        .from("campaigns")
        .insert([campaignData])
        .select()
        .single();

      if (error) {
        console.error("❌ Error creando campaña:", error);
        alert("Error creando campaña: " + error.message);
        return;
      }

      console.log("✅ Campaña guardada en Supabase:", data);
      onCreateCampaign(data);
      setShowModal(false);

      setCampaignName(""); setStartDate(""); setEndDate(""); setBudget(0); setObjective("");
      setBrandName(""); setBrandValues(""); setBrandTone(""); setBrandAssets("");
      setAudience(""); setContentType(""); setContentGuidelines(""); setRestrictions("");
      setRewards(""); setSuccessMetrics(""); setReferences("");

    } catch (err) {
      console.error("💥 Error inesperado:", err);
      alert("Error inesperado al crear la campaña");
    }
  };

  return ( ... el resto igual como lo tenías ... );
}
