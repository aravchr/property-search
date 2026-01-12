export interface Property {
  id: string;
  longitude: number;
  latitude: number;
  [key: string]: any;
}

export interface ImageOptions {
  overlay?: boolean;
  parcelColor?: string;
  buildingColor?: string;
}