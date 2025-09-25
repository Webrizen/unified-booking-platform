'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiBox, FiBookmark } from 'react-icons/fi';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { href: '/admin/resources', label: 'Resources', icon: FiBox },
  { href: '/admin/bookings', label: 'Bookings', icon: FiBookmark },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center px-6 py-4 text-gray-700 hover:bg-gray-200 ${
                    isActive ? 'bg-gray-200 border-r-4 border-blue-500' : ''
                  }`}
                >
                  <item.icon className="h-6 w-6 mr-3" />
                  <span className="font-semibold">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}