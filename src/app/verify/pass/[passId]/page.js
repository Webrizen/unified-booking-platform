'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function VerifyPassPage() {
  const { passId } = useParams();
  const [pass, setPass] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (passId) {
      fetchPassDetails();
    }
  }, [passId]);

  const fetchPassDetails = async () => {
    try {
      setLoading(true);
      // This API endpoint needs to be created. It will fetch public pass data.
      const res = await fetch(`/api/verify/pass/${passId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch pass details');
      }
      const data = await res.json();
      setPass(data);
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

  if (!pass) {
    return <div className="flex justify-center items-center h-screen"><p>Pass not found.</p></div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Pass Verification</h1>
        <div className="space-y-2">
          <p><strong>Pass ID:</strong> {pass._id}</p>
          <p><strong>Booking ID:</strong> {pass.bookingId}</p>
          <p><strong>Event Name:</strong> {pass.details.eventName}</p>
          <p><strong>Guest Name:</strong> {pass.details.guestName}</p>
          <p><strong>Access Level:</strong> {pass.details.accessLevel}</p>
          <p><strong>Status:</strong> <span className={`font-semibold ${pass.status === 'valid' ? 'text-green-600' : 'text-red-600'}`}>{pass.status}</span></p>
          <p><strong>Created At:</strong> {new Date(pass.createdAt).toLocaleString()}</p>
        </div>
        <div className="mt-6 text-center">
          <img src={pass.qrCode} alt="Pass QR Code" className="w-40 h-40 mx-auto" />
        </div>
      </div>
    </div>
  );
}