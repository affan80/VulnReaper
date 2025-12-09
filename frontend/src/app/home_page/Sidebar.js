'use client'
import { Home, Flag, FileText, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const menu = [
    {
      name: "Dashboard",
      icon: <Home size={20} />,
      action: () => router.push("/home_page")
    },
    {
      name: "Vulnerabilities",
      icon: <Flag size={20} />,
      action: () => router.push("/VulnerabilitiesTable")
    },
    {
      name: "Scan",
      icon: <Search size={20} />,
      action: () => router.push("/Scan")
    },
    {
      name: "Reports",
      icon: <FileText size={20} />,
      action: () => router.push("/Reports")   // ✅ CORRECT
    },
  ];

  return (
    <aside className="text-black w-60 bg-slate-100 shadow-md">
      <div className="py-6">
        {menu.map((item, index) => (
          <div
            key={index}
            onClick={item.action}   // ✅ REQUIRED
            className="flex items-center gap-3 px-6 py-4 hover:bg-blue-100 cursor-pointer font-medium"
          >
            {item.icon}
            {item.name}
          </div>
        ))}
      </div>
    </aside>
  );
}
