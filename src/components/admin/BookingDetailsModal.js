'use client';

import { useEffect, useState } from 'react';
import { FiX, FiDownload, FiUser, FiCalendar, FiCreditCard, FiMapPin, FiClock, FiCheckCircle, FiPrinter } from 'react-icons/fi';

export default function BookingDetailsModal({ isOpen, onClose, bookingId }) {
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && bookingId) {
      fetchBookingDetails();
    }
  }, [isOpen, bookingId]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      setError(null);
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (!res.ok) throw new Error('Failed to fetch booking details');
      const data = await res.json();
      setBooking(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (type, id) => {
    try {
      const res = await fetch(`/api/download/${type}/${id}`);
      if (!res.ok) throw new Error(`Failed to download ${type} PDF`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
    };
    return colors[status] || colors.pending;
  };

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
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-700 sticky top-0 bg-white dark:bg-zinc-800 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">
              {booking && getBookingTypeIcon(booking.bookingType)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Booking Details
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Complete information about this booking
              </p>
            </div>
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

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-zinc-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : booking ? (
            <div className="space-y-8">
              {/* Booking Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-zinc-700/50 rounded-2xl p-6">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiCreditCard className="h-5 w-5 mr-2 text-blue-500" />
                    Booking Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Booking ID</span>
                      <span className="text-sm font-mono text-gray-900 dark:text-white">
                        {booking._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">User ID</span>
                      <span className="text-sm font-mono text-gray-900 dark:text-white">
                        {booking.userId?.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {booking.bookingType?.replace(/([A-Z])/g, ' $1')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    {booking.createdAt && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {formatDate(booking.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="bg-gray-50 dark:bg-zinc-700/50 rounded-2xl p-6">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiCalendar className="h-5 w-5 mr-2 text-green-500" />
                    Booking Details
                  </h3>
                  <div className="space-y-3">
                    {booking.bookingType === 'room' && booking.details?.roomBooking && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Check-in</span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {formatDate(booking.details.roomBooking.checkInDate)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Check-out</span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {formatDate(booking.details.roomBooking.checkOutDate)}
                          </span>
                        </div>
                      </>
                    )}
                    {booking.bookingType === 'marriageGarden' && booking.details?.gardenBooking && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Event Date</span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {formatDate(booking.details.gardenBooking.eventDate)}
                          </span>
                        </div>
                        {booking.details.gardenBooking.timeSlot && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Time Slot</span>
                            <span className="text-sm text-gray-900 dark:text-white">
                              {booking.details.gardenBooking.timeSlot}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    {booking.bookingType === 'waterPark' && booking.details?.waterParkBooking && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Visit Date</span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {formatDate(booking.details.waterParkBooking.date)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Total Tickets</span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {booking.details.waterParkBooking.tickets?.length || 0}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Tickets Section */}
              {booking.bookingType === 'waterPark' && booking.details?.waterParkBooking?.tickets?.length > 0 && (
                <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-6 flex items-center">
                    <FiCheckCircle className="h-6 w-6 mr-2 text-green-500" />
                    Issued Tickets ({booking.details.waterParkBooking.tickets.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {booking.details.waterParkBooking.tickets.map((ticket, index) => (
                      <div key={ticket._id || index} className="bg-white dark:bg-zinc-700 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="text-center">
                          <div className="w-24 h-24 mx-auto mb-4 bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                            {ticket.qrCode ? (
                              <img 
                                src={ticket.qrCode} 
                                alt="Ticket QR Code" 
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-500">QR Code</span>
                              </div>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {ticket.details?.type || 'General Ticket'}
                          </h4>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-3">
                            ${ticket.details?.price || '0.00'}
                          </p>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                            ID: {ticket._id?.slice(-6).toUpperCase() || `TKT-${index + 1}`}
                          </div>
                          <button 
                            onClick={() => handleDownloadPdf('ticket', ticket._id)}
                            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200"
                          >
                            <FiDownload className="h-4 w-4 mr-2" />
                            Download PDF
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Passes Section */}
              {booking.bookingType === 'marriageGarden' && booking.passes?.length > 0 && (
                <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-6 flex items-center">
                    <FiUser className="h-6 w-6 mr-2 text-purple-500" />
                    Issued Passes ({booking.passes.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {booking.passes.map((pass, index) => (
                      <div key={pass._id || index} className="bg-white dark:bg-zinc-700 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="text-center">
                          <div className="w-24 h-24 mx-auto mb-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                            {pass.qrCode ? (
                              <img 
                                src={pass.qrCode} 
                                alt="Pass QR Code" 
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-500">QR Code</span>
                              </div>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {pass.details?.guestName || 'Guest'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {pass.details?.eventName || 'Marriage Garden Event'}
                          </p>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                            ID: {pass._id?.slice(-6).toUpperCase() || `PASS-${index + 1}`}
                          </div>
                          <button 
                            onClick={() => handleDownloadPdf('pass', pass._id)}
                            className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-200"
                          >
                            <FiDownload className="h-4 w-4 mr-2" />
                            Download PDF
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Additional Items */}
              {(booking.bookingType !== 'waterPark' || !booking.details?.waterParkBooking?.tickets?.length) &&
               (booking.bookingType !== 'marriageGarden' || !booking.passes?.length) && (
                <div className="text-center py-8 border-t border-gray-200 dark:border-zinc-700">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-zinc-700 rounded-2xl flex items-center justify-center">
                    <FiPrinter className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Digital Items
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    This booking doesn't have any tickets or passes issued yet.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-zinc-700 rounded-2xl flex items-center justify-center">
                <FiCalendar className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">No booking data available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-zinc-700">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-gray-400 dark:hover:border-zinc-500 transition-all duration-200"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}