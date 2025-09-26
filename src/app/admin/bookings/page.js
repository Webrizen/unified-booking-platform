'use client';

import { useEffect, useState } from 'react';
import CreateBookingModal from '@/components/admin/CreateBookingModal';
import IssuePassModal from '@/components/admin/IssuePassModal';
import BookingDetailsModal from '@/components/admin/BookingDetailsModal';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isPassModalOpen, setPassModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update booking status');
      fetchBookings(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  const openPassModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setPassModalOpen(true);
  };

  const openDetailsModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setDetailsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Booking
        </button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg mb-6">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Booking ID</th>
              <th className="py-2 px-4 border-b text-left">User ID</th>
              <th className="py-2 px-4 border-b text-left">Type</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{booking._id}</td>
                <td className="py-2 px-4 border-b">{booking.userId}</td>
                <td className="py-2 px-4 border-b">{booking.bookingType}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                    booking.status === 'cancelled' ? 'bg-red-200 text-red-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="py-2 px-4 border-b flex items-center space-x-2">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                    className="shadow-sm border rounded py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button onClick={() => openDetailsModal(booking._id)} className="text-blue-600 hover:underline">Details</button>
                  {booking.bookingType === 'marriageGarden' && (
                    <button onClick={() => openPassModal(booking._id)} className="text-purple-600 hover:underline">Issue Passes</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onBookingCreated={() => {
          fetchBookings();
          setCreateModalOpen(false);
        }}
      />

      {selectedBookingId && (
        <>
          <IssuePassModal
            isOpen={isPassModalOpen}
            onClose={() => setPassModalOpen(false)}
            bookingId={selectedBookingId}
            onPassesIssued={() => {
              fetchBookings();
              setPassModalOpen(false);
            }}
          />
          <BookingDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
            bookingId={selectedBookingId}
          />
        </>
      )}
    </div>
  );
}