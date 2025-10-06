'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiBox, FiBookmark, FiSettings, FiLogOut, FiMenu, FiX, FiBell, FiSun, FiMoon } from 'react-icons/fi';
import { useState } from 'react';
import { useTheme } from 'next-themes';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { href: '/admin/resources', label: 'Resources', icon: FiBox },
  { href: '/admin/bookings', label: 'Bookings', icon: FiBookmark },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    // Simple logout logic - redirect to login page
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-80 bg-white dark:bg-zinc-800 shadow-xl lg:shadow-md
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-8 border-b border-gray-200 dark:border-zinc-700">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FiGrid className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Admin Panel
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Unified Booking Platform
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`
                    flex items-center px-6 py-4 mb-2 rounded-2xl
                    transition-all duration-200 group
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-l-4 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700/50 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className={`
                    h-6 w-6 mr-4 transition-colors duration-200
                    ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}
                  `} />
                  <span className="font-semibold text-lg">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-zinc-700">
          {/* User Profile */}
          <div className="flex items-center space-x-3 mb-1 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-700/50">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                admin@example.com
              </p>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="grid grid-cols-2">
            <Link href="/admin/settings" className="flex items-center w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-700/50 rounded-xl transition-all duration-200">
              <FiSettings className="h-5 w-5 mr-3" />
              <span className="font-medium">Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
            >
              <FiLogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left Section */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-200 mr-4"
              >
                {isSidebarOpen ? (
                  <FiX className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                ) : (
                  <FiMenu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Admin</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 dark:text-white font-medium capitalize">
                  {pathname.split('/').pop() || 'Dashboard'}
                </span>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-200">
                <div className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2" />
                <FiBell className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Theme Toggle */}
              <button
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-200"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? <FiMoon /> : <FiSun />}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}