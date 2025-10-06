'use client';

import { useState } from 'react';
import { FiX, FiUser, FiCalendar, FiKey, FiPlus, FiMinus, FiUsers } from 'react-icons/fi';

export default function IssuePassModal({ isOpen, onClose, bookingId, onPassesIssued }) {
  const [passes, setPasses] = useState([{ eventName: '', guestName: '', accessLevel: 'full-access' }]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePassChange = (index, e) => {
    const { name, value } = e.target;
    const newPasses = [...passes];
    newPasses[index][name] = value;
    setPasses(newPasses);
  };

  const addPass = () => {
    setPasses([...passes, { eventName: '', guestName: '', accessLevel: 'full-access' }]);
  };

  const removePass = (index) => {
    const newPasses = passes.filter((_, i) => i !== index);
    setPasses(newPasses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/issue-pass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passes }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to issue passes');
      }

      onPassesIssued();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAccessLevelInfo = (level) => {
    const levels = {
      'full-access': {
        label: 'Full Access',
        description: 'Access to all areas including dining and ceremonies',
        color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
      },
      'dining-only': {
        label: 'Dining Only',
        description: 'Access restricted to dining area only',
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
      }
    };
    return levels[level] || levels['full-access'];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <FiUsers className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Issue Event Passes
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create digital passes for marriage garden guests
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Passes List */}
          <div className="space-y-4 mb-6">
            {passes.map((pass, index) => (
              <div key={index} className="bg-gray-50 dark:bg-zinc-700/50 border-2 border-gray-200 dark:border-zinc-600 rounded-2xl p-6 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center">
                    <FiUser className="h-5 w-5 mr-2 text-purple-500" />
                    Guest Pass #{index + 1}
                  </h3>
                  {passes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePass(index)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-200"
                    >
                      <FiMinus className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Event Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Event Name *
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="eventName"
                        value={pass.eventName}
                        onChange={(e) => handlePassChange(index, e)}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-600 border border-gray-300 dark:border-zinc-500 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="e.g., Smith-Johnson Wedding"
                        required
                      />
                    </div>
                  </div>

                  {/* Guest Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Guest Name *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="guestName"
                        value={pass.guestName}
                        onChange={(e) => handlePassChange(index, e)}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-600 border border-gray-300 dark:border-zinc-500 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="e.g., John Smith"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Access Level */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Access Level
                  </label>
                  <div className="relative">
                    <FiKey className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <select
                      name="accessLevel"
                      value={pass.accessLevel}
                      onChange={(e) => handlePassChange(index, e)}
                      className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-600 border border-gray-300 dark:border-zinc-500 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white appearance-none"
                    >
                      <option value="full-access">Full Access</option>
                      <option value="dining-only">Dining Only</option>
                    </select>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getAccessLevelInfo(pass.accessLevel).color}`}>
                      {getAccessLevelInfo(pass.accessLevel).label}
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {getAccessLevelInfo(pass.accessLevel).description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Pass Button */}
          <button
            type="button"
            onClick={addPass}
            className="w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-2xl text-gray-600 dark:text-gray-400 hover:border-purple-400 dark:hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 mb-6"
          >
            <FiPlus className="h-5 w-5 mr-2" />
            Add Another Guest Pass
          </button>

          {/* Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Total Passes to Issue
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Each pass will include a unique QR code
                </p>
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {passes.length}
              </div>
            </div>
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
              disabled={loading || passes.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Issuing Passes...
                </div>
              ) : (
                `Issue ${passes.length} Pass${passes.length !== 1 ? 'es' : ''}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}