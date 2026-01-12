import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Property } from '../types';

function SearchByCoordinates() {
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [distance, setDistance] = useState('10000');
  const [results, setResults] = useState<Property[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!longitude || !latitude) {
      setError('Please enter both longitude and latitude');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get property IDs within radius
      const propertyIds = await api.findProperties(longitude, latitude, distance);
      
      // Fetch all properties to get details
      const properties = await api.getAllProperties();
      
      // Filter properties by IDs
      const foundProperties = properties.filter(p => propertyIds.includes(p.id));
      
      setResults(foundProperties);
      setSearched(true);
    } catch (err) {
      setError('Failed to search properties. Please try again.');
      console.error('Error searching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLongitude('');
    setLatitude('');
    setDistance('10000');
    setResults([]);
    setSearched(false);
    setError(null);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Search Properties by Coordinates</h2>

      <div className="bg-[#333] p-4 border border-white mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block mb-1">Latitude</label>
              <input
                type="number"
                id="latitude"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="0.00"
                className="w-full p-2 bg-black border border-gray-500 text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block mb-1">Longitude</label>
              <input
                type="number"
                id="longitude"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="0.00"
                className="w-full p-2 bg-black border border-gray-500 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="distance" className="block mb-1">Radius (in meters)</label>
            <input
              type="number"
              id="distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="10000"
              min="1"
              className="w-full p-2 bg-black border border-gray-500 text-white"
              required
            />
          </div>

          {error && <div className="p-2 bg-red-900 border border-red-500 text-white">{error}</div>}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-white text-black px-4 py-2 font-bold hover:bg-gray-200"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              className="border border-white text-white px-4 py-2 hover:bg-white hover:text-black"
              onClick={handleReset}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {searched && !loading && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4 border-b border-white pb-2">
            Search Results ({results.length})
          </h3>

          {results.length > 0 ? (
            <div className="border border-white">
              <table className="w-full text-left bg-[#333]">
                <thead className="bg-black text-white border-b border-white">
                  <tr>
                    <th className="p-2 border-r border-white">ID</th>
                    <th className="p-2 border-r border-white">Location</th>
                    <th className="p-2 text-center">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white">
                  {results.map((property) => (
                    <tr key={property.id} className="hover:bg-[#444]">
                      <td className="p-2 border-r border-white">{property.id.substring(0, 8)}...</td>
                      <td className="p-2 border-r border-white">
                        {property.latitude}, {property.longitude}
                      </td>
                      <td className="p-2 text-center">
                        <Link to={`/property/${property.id}`} className="text-blue-300 hover:text-blue-100 underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 border border-white text-center">
              No results found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchByCoordinates;

