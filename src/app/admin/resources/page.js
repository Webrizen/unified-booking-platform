'use client';

import { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const ResourceModal = ({ resource, onSave, onCancel }) => {
  const [formData, setFormData] = useState(resource || { name: '', resourceType: 'room', price: 0, description: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">{resource ? 'Edit Resource' : 'Create Resource'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
            <select name="resourceType" value={formData.resourceType} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3">
              <option value="room">Room</option>
              <option value="marriageGarden">Marriage Garden</option>
              <option value="waterPark">Water Park</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
            <input name="price" type="number" value={formData.price} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3" />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

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

  const handleSave = async (resourceData) => {
    try {
      const url = resourceData._id ? `/api/resources/${resourceData._id}` : '/api/resources';
      const method = resourceData._id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resourceData),
      });
      if (!res.ok) throw new Error(`Failed to ${resourceData._id ? 'update' : 'create'} resource`);
      setIsModalOpen(false);
      setEditingResource(null);
      fetchResources();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        const res = await fetch(`/api/resources/${resourceId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete resource');
        fetchResources();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resource Management</h1>
        <button onClick={() => { setEditingResource(null); setIsModalOpen(true); }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
          <FiPlus className="mr-2" /> Create Resource
        </button>
      </div>
      {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg mb-6">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(resource => (
              <tr key={resource._id}>
                <td className="py-2 px-4 border-b">{resource.name}</td>
                <td className="py-2 px-4 border-b">{resource.resourceType}</td>
                <td className="py-2 px-4 border-b">${resource.price}</td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => { setEditingResource(resource); setIsModalOpen(true); }} className="text-blue-500 hover:text-blue-700 mr-4"><FiEdit /></button>
                  <button onClick={() => handleDelete(resource._id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <ResourceModal resource={editingResource} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />}
    </div>
  );
}