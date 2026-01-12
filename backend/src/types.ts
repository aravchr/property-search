export interface Property {
  id: string;
  longitude: number;
  latitude: number;
  geocode_geo: object | null;
  parcel_geo: object | null;
  building_geo: object | null;
  image_bounds: number[];
  image_url: string;
}

export interface GeoJSONPoint {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  'x-distance': number;
}

