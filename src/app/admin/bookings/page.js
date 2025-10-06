'use client';

import { useEffect, useState } from 'react';
import CreateBookingModal from '@/components/admin/CreateBookingModal';
import IssuePassModal from '@/components/admin/IssuePassModal';
import BookingDetailsModal from '@/components/admin/BookingDetailsModal';
import { FiPlus, FiEye, FiUsers, FiRefreshCw, FiCalendar, FiSearch } from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300', label: 'Pending' },
    confirmed: { color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300', label: 'Confirmed' },
    cancelled: { color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300', label: 'Cancelled' },
    completed: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300', label: 'Completed' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const BookingCard = ({ booking, onStatusChange, onViewDetails, onIssuePasses }) => {
  const getBookingTypeIcon = (type) => {
    const icons = {
      room: '🏨',
      marriageGarden: '🌿',
      waterPark: '💦',
      conferenceHall: '🎤',
      banquet: '🎉'
    };
    return icons[type] || '📅';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {getBookingTypeIcon(booking.bookingType)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              {booking.bookingType?.replace(/([A-Z])/g, ' $1')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ID: {booking._id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">User</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {booking.userId?.slice(-6).toUpperCase()}
          </span>
        </div>

        {booking.date && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(booking.date)}
            </span>
          </div>
        )}

        {booking.resourceId && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Resource</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate ml-2">
              {booking.resourceId}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-zinc-700">
        <select
          value={booking.status}
          onChange={(e) => onStatusChange(booking._id, e.target.value)}
          className="text-sm border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-1.5 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewDetails(booking._id)}
            className="flex items-center px-3 py-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
          >
            <FiEye className="h-4 w-4 mr-1" />
            Details
          </button>

          {booking.bookingType === 'marriageGarden' && (
            <button
              onClick={() => onIssuePasses(booking._id)}
              className="flex items-center px-3 py-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors duration-200"
            >
              <FiUsers className="h-4 w-4 mr-1" />
              Passes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isPassModalOpen, setPassModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.bookingType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Booking Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all bookings across your resources
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <FiPlus className="h-5 w-5 mr-2" />
          Create Booking
        </button>
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

      {/* Filters and Search */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchBookings}
            disabled={loading}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors duration-200 disabled:opacity-50"
          >
            <FiRefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Bookings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-700 rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-20" />
                    <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-16" />
                  </div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-zinc-700 rounded-full w-16" />
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map(booking => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onStatusChange={handleStatusChange}
              onViewDetails={openDetailsModal}
              onIssuePasses={openPassModal}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
            <FiCalendar className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Get started by creating your first booking'
            }
          </p>
          {(searchTerm || statusFilter !== 'all') ? (
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
              className="inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-gray-400 dark:hover:border-zinc-500 transition-all duration-200"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <FiPlus className="h-5 w-5 mr-2" />
              Create Your First Booking
            </button>
          )}
        </div>
      )}

      {/* Modals */}
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