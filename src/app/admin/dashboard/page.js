'use client';

import { useEffect, useState } from 'react';
import { FiUsers, FiBox, FiBookmark } from 'react-icons/fi';

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({ bookings: 0, resources: 0, users: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsRes = await fetch('/api/bookings');
        if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
        const bookingsData = await bookingsRes.json();
        setStats(prev => ({ ...prev, bookings: bookingsData.length }));
        setRecentBookings(bookingsData.slice(0, 5));

        const resourcesRes = await fetch('/api/resources');
        if (!resourcesRes.ok) throw new Error('Failed to fetch resources');
        const resourcesData = await resourcesRes.json();
        setStats(prev => ({ ...prev, resources: resourcesData.length }));

        const usersRes = await fetch('/api/users/count');
        if (!usersRes.ok) throw new Error('Failed to fetch users');
        const usersData = await usersRes.json();
        setStats(prev => ({ ...prev, users: usersData.count }));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg mb-6">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard icon={<FiBookmark className="h-6 w-6 text-white" />} title="Total Bookings" value={stats.bookings} color="bg-blue-500" />
        <StatCard icon={<FiBox className="h-6 w-6 text-white" />} title="Total Resources" value={stats.resources} color="bg-green-500" />
        <StatCard icon={<FiUsers className="h-6 w-6 text-white" />} title="Total Users" value={stats.users} color="bg-yellow-500" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Booking ID</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.length > 0 ? (
              recentBookings.map(booking => (
                <tr key={booking._id}>
                  <td className="py-2 px-4 border-b text-center">{booking._id.slice(-6)}</td>
                  <td className="py-2 px-4 border-b text-center">{booking.bookingType}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">No recent bookings.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}