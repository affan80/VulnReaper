export default function VulnerabilitiesTable() {
  const data = [
    { name: "Vulnerability name 1", risk: "High", status: "Open" },
    { name: "Vulnerability name 2", risk: "Medium", status: "Low" },
    { name: "Vulnerability name 3", risk: "Low", status: "In Progress" },
    { name: "Vulnerability name 4", risk: "High", status: "Closed" },
  ];

  const badgeColors = {
    High: "bg-red-500",
    Medium: "bg-orange-400",
    Low: "bg-blue-500",
  };

  return (
    <div className="text-black bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Vulnerabilities</h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2">Vulnerability</th>
            <th>Risk</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b last:border-none">
              <td className="py-3">{item.name}</td>
              <td>
                <span
                  className={`text-white text-sm px-3 py-1 rounded-full ${badgeColors[item.risk]}`}
                >
                  {item.risk}
                </span>
              </td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
