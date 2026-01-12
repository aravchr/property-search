import axios from 'axios';
import type { Property, ImageOptions } from '../types';

const api = {
  // GET /properties - List all properties
  getAllProperties: async (): Promise<Property[]> => {
    const response = await axios.get('/properties');
    return response.data;
  },

  // POST /find - Find properties by coordinates
  findProperties: async (longitude: string | number, latitude: string | number, distance: string | number): Promise<string[]> => {
    const response = await axios.post('/find', {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(longitude.toString()), parseFloat(latitude.toString())]
      },
      'x-distance': parseInt(distance.toString())
    });
    return response.data;
  },

  // GET /display/:id - Get property image URL with optional overlays
  getPropertyImageUrl: (id: string, options: ImageOptions = {}): string => {
    const params = new URLSearchParams();
    
    if (options.overlay) {
      params.append('overlay', 'yes');
    }
    if (options.parcelColor) {
      params.append('parcel', options.parcelColor);
    }
    if (options.buildingColor) {
      params.append('building', options.buildingColor);
    }
    
    const queryString = params.toString();
    return `/display/${id}${queryString ? '?' + queryString : ''}`;
  }
};

export default api;
