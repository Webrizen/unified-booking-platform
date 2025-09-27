'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');

  useEffect(() => {
    fetchResources();
  }, [searchParams]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(searchParams);
      const res = await fetch(`/api/public/resources?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch resources');
      }
      const data = await res.json();
      setResources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (typeFilter) params.set('type', typeFilter);
    router.push(`/resources?${params.toString()}`);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Resources</h1>

      <form onSubmit={handleSearch} className="mb-8 p-4 bg-gray-100 rounded-lg flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or description..."
          className="w-full sm:flex-grow px-4 py-2 border rounded-md"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border rounded-md"
        >
          <option value="">All Types</option>
          <option value="room">Hotel Room</option>
          <option value="marriageGarden">Marriage Garden</option>
          <option value="waterPark">Water Park</option>
        </select>
        <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Search
        </button>
      </form>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map(resource => (
            <Link key={resource._id} href={`/resources/${resource._id}`} legacyBehavior>
              <a className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{resource.name}</h2>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <div className="text-lg font-semibold text-blue-600">
                    ${resource.price}
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      )}

      {!loading && resources.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No resources found.</p>
      )}
    </div>
  );
}