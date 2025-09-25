'use client';

import { useState } from 'react';

export default function IssuePassModal({ isOpen, onClose, bookingId, onPassesIssued }) {
  const [passes, setPasses] = useState([{ eventName: '', guestName: '', accessLevel: 'full-access' }]);
  const [error, setError] = useState(null);

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
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Issue Marriage Garden Passes</h2>
        {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {passes.map((pass, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-md">
              <input
                type="text"
                name="eventName"
                value={pass.eventName}
                onChange={(e) => handlePassChange(index, e)}
                className="w-full p-2 border rounded"
                placeholder="Event Name"
                required
              />
              <input
                type="text"
                name="guestName"
                value={pass.guestName}
                onChange={(e) => handlePassChange(index, e)}
                className="w-full p-2 border rounded"
                placeholder="Guest Name"
                required
              />
              <select
                name="accessLevel"
                value={pass.accessLevel}
                onChange={(e) => handlePassChange(index, e)}
                className="w-full p-2 border rounded"
              >
                <option value="full-access">Full Access</option>
                <option value="dining-only">Dining Only</option>
              </select>
              <button type="button" onClick={() => removePass(index)} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full mt-2">- Remove Pass</button>
            </div>
          ))}
          <button type="button" onClick={addPass} className="w-full py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Add Another Pass</button>
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Issue Passes</button>
          </div>
        </form>
      </div>
    </div>
  );
}