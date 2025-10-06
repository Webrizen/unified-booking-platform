'use client';

import { useEffect, useState } from 'react';
import { FiUsers, FiBox, FiBookmark, FiCalendar, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';

const StatCard = ({ icon, title, value, color, trend, loading }) => (
  <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
          ) : (
            value.toLocaleString()
          )}
        </p>
        {trend && (
          <div className={`flex items-center mt-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <FiTrendingUp className={`h-4 w-4 mr-1 ${trend < 0 ? 'transform rotate-180' : ''}`} />
            <span>{Math.abs(trend)}% from last month</span>
          </div>
        )}
      </div>
      <div className={`p-4 rounded-2xl ${color} shadow-lg`}>
        {icon}
      </div>
    </div>
  </div>
);

const BookingStatusBadge = ({ status }) => {
  const statusConfig = {
    confirmed: { color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300', label: 'Confirmed' },
    pending: { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300', label: 'Pending' },
    cancelled: { color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300', label: 'Cancelled' },
    completed: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300', label: 'Completed' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export default function DashboardPage() {
  const [stats, setStats] = useState({ bookings: 0, resources: 0, users: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, resourcesRes, usersRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/resources'),
        fetch('/api/users/count')
      ]);

      if (!bookingsRes.ok || !resourcesRes.ok || !usersRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [bookingsData, resourcesData, usersData] = await Promise.all([
        bookingsRes.json(),
        resourcesRes.json(),
        usersRes.json()
      ]);

      setStats({
        bookings: bookingsData.length,
        resources: resourcesData.length,
        users: usersData.count
      });
      
      setRecentBookings(bookingsData.slice(0, 5));
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your bookings today.
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors duration-200 disabled:opacity-50"
          >
            <FiRefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<FiBookmark className="h-6 w-6 text-white" />}
          title="Total Bookings"
          value={stats.bookings}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          trend={12.5}
          loading={loading}
        />
        <StatCard
          icon={<FiBox className="h-6 w-6 text-white" />}
          title="Total Resources"
          value={stats.resources}
          color="bg-gradient-to-r from-green-500 to-green-600"
          trend={8.2}
          loading={loading}
        />
        <StatCard
          icon={<FiUsers className="h-6 w-6 text-white" />}
          title="Total Users"
          value={stats.users}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          trend={15.3}
          loading={loading}
        />
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <FiCalendar className="h-5 w-5 mr-2 text-blue-500" />
              Recent Bookings
            </h2>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
              View All
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-700/50">
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse w-20" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse w-24" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse w-32" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-6 bg-gray-200 dark:bg-zinc-700 rounded-full animate-pulse w-20" />
                    </td>
                  </tr>
                ))
              ) : recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors duration-150">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                      #{booking._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {booking.bookingType || 'General'}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                      {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <BookingStatusBadge status={booking.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-12 px-6 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <FiCalendar className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No recent bookings</p>
                      <p className="text-sm">Bookings will appear here once they're created.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}