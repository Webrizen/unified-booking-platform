'use client';

import { useEffect, useState } from 'react';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);
  const [newResource, setNewResource] = useState({
    name: '',
    resourceType: 'room',
    price: 0,
    description: ''
  });

  useEffect(() => {
    fetchResources();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResource),
      });
      if (!res.ok) throw new Error('Failed to create resource');
      fetchResources(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Resource Management</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Create New Resource</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={newResource.name} onChange={handleInputChange} placeholder="Name" required />
        <select name="resourceType" value={newResource.resourceType} onChange={handleInputChange}>
          <option value="room">Room</option>
          <option value="marriageGarden">Marriage Garden</option>
          <option value="waterPark">Water Park</option>
        </select>
        <input name="price" type="number" value={newResource.price} onChange={handleInputChange} placeholder="Price" required />
        <textarea name="description" value={newResource.description} onChange={handleInputChange} placeholder="Description" />
        <button type="submit">Create</button>
      </form>

      <h2>Existing Resources</h2>
      <ul>
        {resources.map(resource => (
          <li key={resource._id}>
            {resource.name} ({resource.resourceType}) - ${resource.price}
          </li>
        ))}
      </ul>
    </div>
  );
}