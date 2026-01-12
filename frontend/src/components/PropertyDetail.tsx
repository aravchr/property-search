import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import type { Property, ImageOptions } from '../types';

function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Overlay controls
  const [parcelColor, setParcelColor] = useState('orange');
  const [buildingColor, setBuildingColor] = useState('green');
  const [showParcel, setShowParcel] = useState(false);
  const [showBuilding, setShowBuilding] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const data = await api.getAllProperties();
      const foundProperty = data.find(p => p.id === id);
      
      if (foundProperty) {
        setProperty(foundProperty);
        setError(null);
      } else {
        setError('Property not found');
      }
    } catch (err) {
      setError('Failed to fetch property details. Please try again.');
      console.error('Error fetching property:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (): string => {
    if (!property) return '';
    
    const options: ImageOptions = {};
    if (showParcel || showBuilding) {
      options.overlay = true;
      if (showParcel) options.parcelColor = parcelColor;
      if (showBuilding) options.buildingColor = buildingColor;
    }
    
    return api.getPropertyImageUrl(property.id, options);
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading property details...</div>;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-600">{error}</div>
        <Link to="/">
          <button className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 transition-colors mt-5">
            Back to Properties
          </button>
        </Link>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/" className="inline-block mb-4 text-blue-300 hover:underline">
        &larr; Back to Properties List
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#333] border border-white p-4">
            <h1 className="text-xl font-bold mb-4 border-b border-white pb-2">Property Details</h1>
            <div className="space-y-4">
              <div>
                <span className="block font-bold">Property ID:</span>
                <span className="block break-all">{property.id}</span>
              </div>
              <div>
                <span className="block font-bold">Latitude:</span>
                <span>{property.latitude}</span>
              </div>
              <div>
                <span className="block font-bold">Longitude:</span>
                <span>{property.longitude}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#333] border border-white p-4">
            <h3 className="text-lg font-bold mb-4 border-b border-white pb-2">Map Overlays</h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 mb-2">
                  <input type="checkbox" checked={showParcel} onChange={e => setShowParcel(e.target.checked)} className="w-4 h-4" />
                  <span>Show Parcel Boundary</span>
                </label>
                <label className="block mb-1 text-sm">Color:</label>
                <select 
                  value={parcelColor}
                  onChange={(e) => setParcelColor(e.target.value)}
                  className="w-full p-2 bg-black border border-white text-white"
                >
                  <option value="orange">Orange</option>
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2 mb-2">
                  <input type="checkbox" checked={showBuilding} onChange={e => setShowBuilding(e.target.checked)} className="w-4 h-4" />
                  <span>Show Building Footprint</span>
                </label>
                <label className="block mb-1 text-sm">Color:</label>
                <select 
                  value={buildingColor}
                  onChange={(e) => setBuildingColor(e.target.value)}
                  className="w-full p-2 bg-black border border-white text-white"
                >
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="yellow">Yellow</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Image */}
        <div className="lg:col-span-8">
          <div className="border border-white bg-black min-h-[500px] flex items-center justify-center">
            <img
              src={getImageUrl()}
              alt={`Property ${property.id}`}
              className="w-full h-auto object-contain"
              key={getImageUrl()} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;

