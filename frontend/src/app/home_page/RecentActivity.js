export default function RecentActivity() {
  const activity = [
    { text: "New vulnerability reported", time: "2 hours ago" },
    { text: "Vulnerability updated", time: "5 hours ago" },
    { text: "Vulnerability status changed", time: "8 hours ago" },
    { text: "Scan completed", time: "1 day ago" },
  ];

  return (
    <div className="text-black bg-white p-6 rounded-xl shadow-md">
      <h2 className=" text-xl font-semibold mb-4">Recent Activity</h2>

      <ul className="space-y-4">
        {activity.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
            <div>
              <p>{item.text}</p>
              <span className="text-sm text-gray-500">{item.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
