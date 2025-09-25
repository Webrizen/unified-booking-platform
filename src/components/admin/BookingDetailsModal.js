'use client';

import { useEffect, useState } from 'react';

export default function BookingDetailsModal({ isOpen, onClose, bookingId }) {
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && bookingId) {
      fetchBookingDetails();
    }
  }, [isOpen, bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setError(null);
      // We need an API endpoint to fetch a single booking's details including populated tickets/passes
      // For now, we'll assume an endpoint like /api/bookings/[bookingId] exists.
      // I will create this endpoint later.
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (!res.ok) throw new Error('Failed to fetch booking details');
      const data = await res.json();
      setBooking(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Booking Details</h2>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">&times;</button>
        {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
        {booking ? (
          <div className="space-y-4">
            <p><strong>Booking ID:</strong> {booking._id}</p>
            <p><strong>User ID:</strong> {booking.userId}</p>
            <p><strong>Booking Type:</strong> {booking.bookingType}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <p><strong>Created By:</strong> {booking.createdBy}</p>

            {booking.bookingType === 'waterPark' && booking.details.waterParkBooking.tickets.length > 0 && (
              <div>
                <h3 className="font-semibold mt-4">Issued Tickets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {booking.details.waterParkBooking.tickets.map(ticket => (
                    <div key={ticket._id} className="p-4 border rounded-md">
                      <p><strong>Ticket ID:</strong> {ticket._id}</p>
                      <p><strong>Type:</strong> {ticket.details.type}</p>
                      <p><strong>Price:</strong> ${ticket.details.price}</p>
                      <img src={ticket.qrCode} alt="Ticket QR Code" className="w-32 h-32 mx-auto mt-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {booking.bookingType === 'marriageGarden' && booking.passes.length > 0 && (
              <div>
                <h3 className="font-semibold mt-4">Issued Passes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {booking.passes.map(pass => (
                    <div key={pass._id} className="p-4 border rounded-md">
                      <p><strong>Pass ID:</strong> {pass._id}</p>
                      <p><strong>Event:</strong> {pass.details.eventName}</p>
                      <p><strong>Guest:</strong> {pass.details.guestName}</p>
                      <img src={pass.qrCode} alt="Pass QR Code" className="w-32 h-32 mx-auto mt-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <p>Loading...</p>
        )}
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Close</button>
        </div>
      </div>
    </div>
  );
}