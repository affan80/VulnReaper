'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Shield, 
  Search, 
  FileText, 
  Activity,
  User 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/home_page', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/scan', label: 'Scans', icon: Search },
    { href: '/vulnerabilities', label: 'Vulnerabilities', icon: Shield },
    { href: '/reports', label: 'Reports', icon: FileText },
    { href: '/activity', label: 'Activity', icon: Activity },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-indigo-400">VulnReaper</h2>
        <p className="text-sm text-gray-400">Vulnerability Management</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
