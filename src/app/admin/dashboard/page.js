'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsRes = await fetch('/api/bookings');
        if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);

        const resourcesRes = await fetch('/api/resources');
        if (!resourcesRes.ok) throw new Error('Failed to fetch resources');
        const resourcesData = await resourcesRes.json();
        setResources(resourcesData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Recent Bookings</h2>
      {bookings.length > 0 ? (
        <ul>
          {bookings.slice(0, 5).map(booking => (
            <li key={booking._id}>
              {booking.bookingType} - {booking.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}

      <h2>Resources</h2>
      {resources.length > 0 ? (
        <ul>
          {resources.map(resource => (
            <li key={resource._id}>
              {resource.name} ({resource.resourceType})
            </li>
          ))}
        </ul>
      ) : (
        <p>No resources found.</p>
      )}
    </div>
  );
}