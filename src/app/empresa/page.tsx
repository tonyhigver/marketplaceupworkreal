import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import CreateCampaignForm from "@/components/CreateCampaignForm";

const projects = [
  { title: "Campaña TikTok viral", reward: 100 },
  { title: "Rediseño de marca", reward: 250 },
  { title: "Marketing en Instagram", reward: 150 },
];

export default function EmpresaPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header superior */}
      <Header type="empresa" />

      {/* Botón de Crear Campaña */}
      <div className="p-4 flex justify-end">
        <CreateCampaignForm />
      </div>

      {/* Dashboard de proyectos */}
      <div className="p-10">
        <h2 className="text-3xl font-bold mb-8">Dashboard Empresa / Startup 🚀</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={i} title={p.title} reward={p.reward} />
          ))}
        </div>
      </div>
    </div>
  );
}
