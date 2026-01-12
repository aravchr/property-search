import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Property } from '../types';

function PropertiesList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await api.getAllProperties();
      setProperties(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch properties. Please try again.');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading properties...</div>;
  }

  if (error) {
    return <div className="text-red-600 mt-4">{error}</div>;
  }
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Properties List</h2>
        <p>Total properties found: {properties.length}</p>
      </div>
      
      <div className="border border-white">
        <table className="w-full text-left bg-[#333]">
          <thead className="bg-black text-white border-b border-white">
            <tr>
              <th className="p-2 border-r border-white">ID</th>
              <th className="p-2 border-r border-white">Longitude</th>
              <th className="p-2 border-r border-white">Latitude</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white">
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-[#444]">
                <td className="p-2 border-r border-white">{property.id}</td>
                <td className="p-2 border-r border-white">{property.longitude}</td>
                <td className="p-2 border-r border-white">{property.latitude}</td>
                <td className="p-2 text-center">
                  <Link 
                    to={`/property/${property.id}`}
                    className="text-blue-300 hover:text-blue-100 underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {properties.length === 0 && (
        <p className="text-center mt-5 text-gray-600">
          No properties found.
        </p>
      )}
    </div>
  );
}

export default PropertiesList;

