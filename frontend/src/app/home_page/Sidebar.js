'use client'
import { Home, Flag, FileText, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const menu = [
    { 
      name: "Dashboard", 
      icon: <Home size={20} />, 
      action: () => router.push("/") 
    },
    { 
      name: "Vulnerabilities", 
      icon: <Flag size={20} />, 
      action: () => router.push("/VulnerabilitiesTable") 
    },
    { 
      name: "Reports", 
      icon: <FileText size={20} />, 
      action: () => router.push("/Reports")   // ✅ CORRECT
    },
    { 
      name: "Settings", 
      icon: <Settings size={20} />, 
      action: () => router.push("/Settings") 
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
