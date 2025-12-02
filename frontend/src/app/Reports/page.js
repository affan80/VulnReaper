import Sidebar from "../home_page/Sidebar";
import Header from "./Header";

export default function ReportsPage() {
  const reports = [
    {
      name: "Weekly Summary",
      date: "Apr 22, 2024",
      user: "User 2",
      status: "In Progress",
    },
    {
      name: "High-Risk Vulnerabilities",
      date: "Apr 18, 2024",
      user: "User 2",
      status: "Completed",
    },
    {
      name: "Monthly Overview",
      date: "Apr 1, 2024",
      user: "User 1",
      status: "Completed",
    },
    {
      name: "Q1 Vulnerability Report",
      date: "Mar 31, 2024",
      user: "User 1",
      status: "Completed",
    },
  ];

  return (
    <>
      <Header />

      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <main className="flex-1 p-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-6">Reports</h1>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium shadow">
              Generate Report
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3">Name</th>
                  <th>Date</th>
                  <th>Created By</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((r, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3">{r.name}</td>
                    <td>{r.date}</td>
                    <td>{r.user}</td>
                    <td>
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          r.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}
