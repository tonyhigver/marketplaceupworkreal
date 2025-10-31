interface HeaderProps {
  type: "empresa" | "individual";
  connects?: number; // solo para individual
}

export default function Header({ type, connects = 0 }: HeaderProps) {
  return (
    <div className="w-full flex justify-end p-4 bg-gray-800 text-white shadow-md">
      {type === "empresa" && (
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg">
          Crear Campaña
        </button>
      )}
      {type === "individual" && (
        <div className="px-4 py-2 bg-green-600 rounded-lg">
          Connects: {connects}
        </div>
      )}
    </div>
  );
}
