'use client';

import { useState, useEffect } from 'react';

export default function CreateBookingModal({ isOpen, onClose, onBookingCreated }) {
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [bookingType, setBookingType] = useState('room');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedResource, setSelectedResource] = useState('');
  const [details, setDetails] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchResources();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/resources');
      if (!res.ok) throw new Error('Failed to fetch resources');
      const data = await res.json();
      setResources(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    const [parent, key] = name.split('.');
    setDetails(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const bookingData = {
      userId: selectedUser,
      resourceId: selectedResource,
      bookingType,
      details,
    };

    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      onBookingCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Create New Booking</h2>
        {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select a User</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Booking Type</label>
            <select
              value={bookingType}
              onChange={(e) => setBookingType(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="room">Room</option>
              <option value="marriageGarden">Marriage Garden</option>
              <option value="waterPark">Water Park</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Resource</label>
            <select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select a Resource</option>
              {resources
                .filter(r => r.resourceType === bookingType)
                .map(resource => (
                  <option key={resource._id} value={resource._id}>{resource.name}</option>
                ))}
            </select>
          </div>

          {bookingType === 'room' && (
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="font-semibold">Room Details</h3>
              <input type="date" name="roomBooking.checkInDate" onChange={handleDetailChange} className="w-full p-2 border rounded" placeholder="Check-in Date" required />
              <input type="date" name="roomBooking.checkOutDate" onChange={handleDetailChange} className="w-full p-2 border rounded" placeholder="Check-out Date" required />
            </div>
          )}

          {bookingType === 'marriageGarden' && (
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="font-semibold">Garden Details</h3>
              <input type="date" name="gardenBooking.eventDate" onChange={handleDetailChange} className="w-full p-2 border rounded" placeholder="Event Date" required />
              <input type="text" name="gardenBooking.timeSlot" onChange={handleDetailChange} className="w-full p-2 border rounded" placeholder="Time Slot" />
            </div>
          )}

          {bookingType === 'waterPark' && (
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="font-semibold">Water Park Details</h3>
              <input type="date" name="waterParkBooking.date" onChange={handleDetailChange} className="w-full p-2 border rounded" placeholder="Date" required />
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create Booking</button>
          </div>
        </form>
      </div>
    </div>
  );
}