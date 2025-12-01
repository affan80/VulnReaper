export default function StatsCards() {
  const stats = [
    { title: "Total Vulnerabilities", value: 124, color: "from-red-500 to-red-600" },
    { title: "High Risk", value: 45, color: "from-orange-500 to-orange-600" },
    { title: "Medium Risk", value: 27, color: "from-yellow-400 to-yellow-500", text: "text-black" },
    { title: "Low Risk", value: 52, color: "from-blue-500 to-blue-600" },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-gradient-to-r ${stat.color} text-white rounded-xl p-6 shadow-lg ${
            stat.text || ""
          }`}
        >
          <h2 className="text-4xl font-bold">{stat.value}</h2>
          <p className="mt-2">{stat.title}</p>
        </div>
      ))}
    </div>
  );
}
