import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";

const projects = [
  { title: "Video creativo TikTok", reward: 50 },
  { title: "Post viral Instagram", reward: 75 },
  { title: "Diseño meme promocional", reward: 30 },
];

export default function IndividualPage() {
  const userConnects = 15; // puedes reemplazarlo con valor dinámico del usuario

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header type="individual" connects={userConnects} />
      <div className="p-10">
        <h2 className="text-3xl font-bold mb-8">Dashboard Individual 🙋</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={i} title={p.title} reward={p.reward} />
          ))}
        </div>
      </div>
    </div>
  );
}
