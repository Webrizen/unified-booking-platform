'use client';

import { useState } from 'react';

export default function IssueTicketModal({ isOpen, onClose, bookingId, onTicketsIssued }) {
  const [tickets, setTickets] = useState([{ type: 'adult', price: '' }]);
  const [error, setError] = useState(null);

  const handleTicketChange = (index, e) => {
    const { name, value } = e.target;
    const newTickets = [...tickets];
    newTickets[index][name] = value;
    setTickets(newTickets);
  };

  const addTicket = () => {
    setTickets([...tickets, { type: 'adult', price: '' }]);
  };

  const removeTicket = (index) => {
    const newTickets = tickets.filter((_, i) => i !== index);
    setTickets(newTickets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/issue-ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickets }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to issue tickets');
      }

      onTicketsIssued();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Issue Water Park Tickets</h2>
        {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tickets.map((ticket, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 border rounded-md">
              <input
                type="text"
                name="type"
                value={ticket.type}
                onChange={(e) => handleTicketChange(index, e)}
                className="w-full p-2 border rounded"
                placeholder="Ticket Type (e.g., adult)"
                required
              />
              <input
                type="number"
                name="price"
                value={ticket.price}
                onChange={(e) => handleTicketChange(index, e)}
                className="w-full p-2 border rounded"
                placeholder="Price"
                required
              />
              <button type="button" onClick={() => removeTicket(index)} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">-</button>
            </div>
          ))}
          <button type="button" onClick={addTicket} className="w-full py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Add Another Ticket</button>
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Issue Tickets</button>
          </div>
        </form>
      </div>
    </div>
  );
}