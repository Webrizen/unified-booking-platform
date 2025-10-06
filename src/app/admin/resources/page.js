'use client';

import { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiX, FiDollarSign, FiType, FiInfo } from 'react-icons/fi';

const ResourceModal = ({ resource, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    resource || { 
      name: '', 
      resourceType: 'room', 
      price: 0, 
      description: '',
      capacity: '',
      amenities: ''
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const resourceTypes = [
    { value: 'room', label: 'Room', icon: '🏨' },
    { value: 'marriageGarden', label: 'Marriage Garden', icon: '🌿' },
    { value: 'waterPark', label: 'Water Park', icon: '💦' },
    { value: 'conferenceHall', label: 'Conference Hall', icon: '🎤' },
    { value: 'banquet', label: 'Banquet Hall', icon: '🎉' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {resource ? 'Edit Resource' : 'Create New Resource'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-colors duration-200"
          >
            <FiX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Resource Name *
            </label>
            <div className="relative">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter resource name"
              />
              <FiType className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Type and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resource Type *
              </label>
              <select
                name="resourceType"
                value={formData.resourceType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white appearance-none"
              >
                {resourceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (₹) *
              </label>
              <div className="relative">
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="0.00"
                />
                <FiDollarSign className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Capacity and Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Capacity
              </label>
              <input
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Number of people"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amenities
              </label>
              <input
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="WiFi, AC, Projector, etc."
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                placeholder="Describe the resource features and details..."
              />
              <FiInfo className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-gray-400 dark:hover:border-zinc-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {resource ? 'Update Resource' : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ResourceCard = ({ resource, onEdit, onDelete }) => {
  const getTypeIcon = (type) => {
    const icons = {
      room: '🏨',
      marriageGarden: '🌿',
      waterPark: '💦',
      conferenceHall: '🎤',
      banquet: '🎉'
    };
    return icons[type] || '📦';
  };

  const getTypeColor = (type) => {
    const colors = {
      room: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      marriageGarden: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      waterPark: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
      conferenceHall: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      banquet: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
    };
    return colors[type] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-2xl ${getTypeColor(resource.resourceType)}`}>
            <span className="text-2xl">{getTypeIcon(resource.resourceType)}</span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              {resource.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {resource.resourceType?.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(resource)}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors duration-200"
          >
            <FiEdit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(resource._id)}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-200"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
          <span className="font-bold text-lg text-gray-900 dark:text-white">
             ₹{parseFloat(resource.price).toFixed(2)}
          </span>
        </div>

        {resource.capacity && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Capacity</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {resource.capacity} people
            </span>
          </div>
        )}

        {resource.amenities && (
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Amenities</span>
            <p className="text-sm text-gray-900 dark:text-white mt-1 line-clamp-2">
              {resource.amenities}
            </p>
          </div>
        )}

        {resource.description && (
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Description</span>
            <p className="text-sm text-gray-900 dark:text-white mt-1 line-clamp-3">
              {resource.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resources');
      if (!res.ok) throw new Error('Failed to fetch resources');
      const data = await res.json();
      setResources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
    if (window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Resource Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and organize all your booking resources in one place
          </p>
        </div>
        <button
          onClick={() => { setEditingResource(null); setIsModalOpen(true); }}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <FiPlus className="h-5 w-5 mr-2" />
          Create Resource
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
            <FiX className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Resources Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-700 rounded-2xl" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-24" />
                  <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-16" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(resource => (
            <ResourceCard
              key={resource._id}
              resource={resource}
              onEdit={(resource) => { setEditingResource(resource); setIsModalOpen(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
            <FiPlus className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No resources yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get started by creating your first resource
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <FiPlus className="h-5 w-5 mr-2" />
            Create Your First Resource
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <ResourceModal
          resource={editingResource}
          onSave={handleSave}
          onCancel={() => { setIsModalOpen(false); setEditingResource(null); }}
        />
      )}
    </div>
  );
}