import { useState } from "react";

export default function CreateCampaignForm() {
  const [showModal, setShowModal] = useState(false);

  const [campaignName, setCampaignName] = useState("");
  const [budget, setBudget] = useState(0);

  const handleSubmit = () => {
    // Aquí enviarías los datos al backend
    console.log({ campaignName, budget });
    setShowModal(false);
  };

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-600 rounded-lg text-white"
        onClick={() => setShowModal(true)}
      >
        Crear Campaña
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-gray-800 p-8 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Nueva Campaña</h2>
            <input
              type="text"
              placeholder="Nombre de la campaña"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full mb-3 p-2 rounded"
            />
            <input
              type="number"
              placeholder="Presupuesto"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full mb-3 p-2 rounded"
            />
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 rounded text-white"
            >
              Crear
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 ml-2 bg-red-600 rounded text-white"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
