'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function VerifyTicketPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      // This API endpoint needs to be created. It will fetch public ticket data.
      const res = await fetch(`/api/verify/ticket/${ticketId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch ticket details');
      }
      const data = await res.json();
      setTicket(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p className="text-red-500">{error}</p></div>;
  }

  if (!ticket) {
    return <div className="flex justify-center items-center h-screen"><p>Ticket not found.</p></div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Ticket Verification</h1>
        <div className="space-y-2">
          <p><strong>Ticket ID:</strong> {ticket._id}</p>
          <p><strong>Booking ID:</strong> {ticket.bookingId}</p>
          <p><strong>Type:</strong> {ticket.details.type}</p>
          <p><strong>Price:</strong> ${ticket.details.price}</p>
          <p><strong>Status:</strong> <span className={`font-semibold ${ticket.status === 'valid' ? 'text-green-600' : 'text-red-600'}`}>{ticket.status}</span></p>
          <p><strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
        </div>
        <div className="mt-6 text-center">
            <img src={ticket.qrCode} alt="Ticket QR Code" className="w-40 h-40 mx-auto" />
        </div>
      </div>
    </div>
  );
}