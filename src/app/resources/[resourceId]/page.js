'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ResourceDetailsPage() {
  const { resourceId } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (resourceId) {
      fetchResourceDetails();
    }
  }, [resourceId]);

  const fetchResourceDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/public/resources/${resourceId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch resource details');
      }
      const data = await res.json();
      setResource(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!resource) {
    return <div className="text-center py-10">Resource not found.</div>;
  }

  const renderResourceDetails = () => {
    switch (resource.resourceType) {
      case 'room':
        return (
          <div className="mt-4">
            <p><strong>Beds:</strong> {resource.details.roomDetails?.beds}</p>
            <p><strong>Capacity:</strong> {resource.details.roomDetails?.capacity} guests</p>
          </div>
        );
      case 'marriageGarden':
        return (
          <div className="mt-4">
            <p><strong>Max Capacity:</strong> {resource.details.gardenDetails?.maxCapacity} people</p>
            <p><strong>Features:</strong> {resource.details.gardenDetails?.features.join(', ')}</p>
          </div>
        );
      case 'waterPark':
        return (
          <div className="mt-4">
            <p><strong>Daily Capacity:</strong> {resource.details.waterParkDetails?.dailyCapacity} visitors</p>
            <p><strong>Sections:</strong> {resource.details.waterParkDetails?.sections.join(', ')}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">{resource.name}</h1>
          <p className="text-gray-600 text-lg mb-6">{resource.description}</p>
          <div className="text-3xl font-bold text-blue-600 mb-6">
            ${resource.price} <span className="text-lg font-normal text-gray-500">/ night or event</span>
          </div>
          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            {renderResourceDetails()}
          </div>
        </div>
      </div>
    </div>
  );
}