'use client';

import { useState, useEffect } from 'react';
import { FiX, FiUser, FiCalendar, FiMapPin, FiDollarSign, FiPlus, FiMinus, FiClock } from 'react-icons/fi';

export default function CreateBookingModal({ isOpen, onClose, onBookingCreated }) {
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [bookingType, setBookingType] = useState('room');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedResource, setSelectedResource] = useState('');
  const [details, setDetails] = useState({
    roomBooking: { checkInDate: '', checkOutDate: '' },
    gardenBooking: { eventDate: '', timeSlot: '' },
    waterParkBooking: { date: '', tickets: [{ type: 'adult', price: '' }] },
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchResources();
      // Reset form on open
      setDetails({
        roomBooking: { checkInDate: '', checkOutDate: '' },
        gardenBooking: { eventDate: '', timeSlot: '' },
        waterParkBooking: { date: '', tickets: [{ type: 'adult', price: '' }] },
      });
      setSelectedUser('');
      setSelectedResource('');
      setBookingType('room');
      setError(null);
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
        [key]: value,
      },
    }));
  };

  const handleTicketChange = (index, e) => {
    const { name, value } = e.target;
    const newTickets = [...details.waterParkBooking.tickets];
    newTickets[index][name] = value;
    setDetails(prev => ({
      ...prev,
      waterParkBooking: {
        ...prev.waterParkBooking,
        tickets: newTickets
      }
    }));
  };

  const addTicket = () => {
    setDetails(prev => ({
      ...prev,
      waterParkBooking: {
        ...prev.waterParkBooking,
        tickets: [...prev.waterParkBooking.tickets, { type: 'adult', price: '' }]
      }
    }));
  };

  const removeTicket = (index) => {
    const newTickets = details.waterParkBooking.tickets.filter((_, i) => i !== index);
    setDetails(prev => ({
      ...prev,
      waterParkBooking: {
        ...prev.waterParkBooking,
        tickets: newTickets
      }
    }));
  };

  const getBookingTypeIcon = (type) => {
    const icons = {
      room: '🏨',
      marriageGarden: '🌿',
      waterPark: '💦'
    };
    return icons[type] || '📅';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    let bookingData;
    if (bookingType === 'waterPark') {
      bookingData = {
        userId: selectedUser,
        resourceId: selectedResource,
        bookingType,
        details: {
          date: details.waterParkBooking.date,
          tickets: details.waterParkBooking.tickets
        }
      };
    } else {
      bookingData = {
        userId: selectedUser,
        resourceId: selectedResource,
        bookingType,
        details: details[bookingType === 'room' ? 'roomBooking' : 'gardenBooking'],
      };
    }

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
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Booking
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Book resources for your customers
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-colors duration-200"
          >
            <FiX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-6 flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Customer *
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white appearance-none"
                required
              >
                <option value="">Choose a customer...</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName} • {user.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Booking Type and Resource */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Booking Type *
              </label>
              <select
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white appearance-none"
              >
                <option value="room">🏨 Room Booking</option>
                <option value="marriageGarden">🌿 Marriage Garden</option>
                <option value="waterPark">💦 Water Park</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Resource *
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <select
                  value={selectedResource}
                  onChange={(e) => setSelectedResource(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white appearance-none"
                  required
                >
                  <option value="">Choose a resource...</option>
                  {resources
                    .filter(r => r.resourceType === bookingType)
                    .map(resource => (
                      <option key={resource._id} value={resource._id}>
                        {resource.name} • ${resource.price}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Booking Type Specific Details */}
          <div className="border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-2xl p-6">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="text-2xl mr-3">{getBookingTypeIcon(bookingType)}</span>
              {bookingType === 'room' && 'Room Booking Details'}
              {bookingType === 'marriageGarden' && 'Marriage Garden Details'}
              {bookingType === 'waterPark' && 'Water Park Details'}
            </h3>

            {/* Room Booking Details */}
            {bookingType === 'room' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Check-in Date *
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="roomBooking.checkInDate"
                      value={details.roomBooking.checkInDate}
                      onChange={handleDetailChange}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Check-out Date *
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="roomBooking.checkOutDate"
                      value={details.roomBooking.checkOutDate}
                      onChange={handleDetailChange}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Marriage Garden Details */}
            {bookingType === 'marriageGarden' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Date *
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="gardenBooking.eventDate"
                      value={details.gardenBooking.eventDate}
                      onChange={handleDetailChange}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Slot
                  </label>
                  <div className="relative">
                    <FiClock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="gardenBooking.timeSlot"
                      value={details.gardenBooking.timeSlot}
                      onChange={handleDetailChange}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white"
                      placeholder="e.g., 2:00 PM - 6:00 PM"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Water Park Details */}
            {bookingType === 'waterPark' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Visit Date *
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="waterParkBooking.date"
                      value={details.waterParkBooking.date}
                      onChange={handleDetailChange}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tickets
                    </label>
                    <button
                      type="button"
                      onClick={addTicket}
                      className="flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      <FiPlus className="h-4 w-4 mr-1" />
                      Add Ticket
                    </button>
                  </div>

                  <div className="space-y-3">
                    {details.waterParkBooking.tickets.map((ticket, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-zinc-700/50 rounded-xl">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Ticket Type
                          </label>
                          <input
                            type="text"
                            name="type"
                            value={ticket.type}
                            onChange={(e) => handleTicketChange(index, e)}
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-600 border border-gray-300 dark:border-zinc-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                            placeholder="e.g., Adult, Child, VIP"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Price ($)
                          </label>
                          <div className="relative">
                            <FiDollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                              type="number"
                              name="price"
                              value={ticket.price}
                              onChange={(e) => handleTicketChange(index, e)}
                              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-600 border border-gray-300 dark:border-zinc-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                        </div>
                        {details.waterParkBooking.tickets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTicket(index)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 mt-6"
                          >
                            <FiMinus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-gray-400 dark:hover:border-zinc-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Booking...
                </div>
              ) : (
                'Create Booking'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}