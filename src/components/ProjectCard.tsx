interface ProjectCardProps {
  title: string;
  reward: number; // dinero
}

export default function ProjectCard({ title, reward }: ProjectCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-green-400 font-semibold">💰 ${reward}</p>
      <button className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white">
        Ver proyecto
      </button>
    </div>
  );
}
