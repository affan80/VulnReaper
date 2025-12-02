"use client";
import Header from "../home_page/Header";
import Sidebar from "../home_page/Sidebar";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Home() {
  // Donut Chart Data
  const donutData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [20, 15, 10],
        backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6"],
      },
    ],
  };

  // Bar Chart Data
  const barData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Open Vulns",
        data: [40, 15, 7],
        backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6"],
      },
    ],
  };

  return (
    <>
      <Header />

      <div className="flex min-h-screen">
        <Sidebar />

        {/* ---------------- MAIN CONTENT ---------------- */}
        <main className="flex-1 p-10">

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-8">Vulnerabilities</h1>

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ---- TABLE ---- */}
          <div className="text-black bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Vulnerability List</h2>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Vulnerability</th>
                  <th>Risk</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {[
                  { name: "Vulnerability name 1", risk: "High", status: "Open" },
                  { name: "Vulnerability name 2", risk: "Medium", status: "Low" },
                  { name: "Vulnerability name 3", risk: "Low", status: "In Progress" },
                  { name: "Vulnerability name 4", risk: "High", status: "Closed" },
                ].map((v, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{v.name}</td>
                    <td>
                      <span
                        className={`px-3 py-1 text-white rounded-full text-sm ${
                          v.risk === "High"
                            ? "bg-red-500"
                            : v.risk === "Medium"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {v.risk}
                      </span>
                    </td>
                    <td>{v.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ---- DONUT CHART ---- */}
          <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-center items-center">
            <h2 className="text-black text-xl font-semibold mb-4">Risk Distribution</h2>

            <div className="w-64">
              <Doughnut data={donutData} />
            </div>

            <div className="flex gap-4 mt-4 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div> High
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div> Medium
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div> Low
              </span>
            </div>
          </div>
        </div>

        {/* ---------------- BOTTOM BAR CHARTS ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

          <div className="text-black bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Open Vulnerabilities by Risk</h2>
            <Bar data={barData} />
          </div>

          <div className="text-black bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Open Vulnerabilities by Risk</h2>
            <Bar data={barData} />
          </div>

        </div>
      </main>
      </div>
    </>
  );
}
