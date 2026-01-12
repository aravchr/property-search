import { Request, Response, NextFunction } from 'express';
import { GeoJSONPoint } from '../types';
import { VALID_COLORS } from '../utils/constants';

export const validateGeoJSONPoint = (
  req: Request<{}, {}, GeoJSONPoint>,
  res: Response,
  next: NextFunction
): void => {
  const { type, geometry, 'x-distance': distance } = req.body;

  if (type !== 'Feature') {
    res.status(400).json({ error: 'Invalid GeoJSON: type must be "Feature"' });
    return;
  }

  if (!geometry || geometry.type !== 'Point') {
    res.status(400).json({ error: 'Invalid GeoJSON: geometry.type must be "Point"' });
    return;
  }

  if (!geometry.coordinates || geometry.coordinates.length !== 2) {
    res.status(400).json({ error: 'Invalid GeoJSON point: coordinates must be [longitude, latitude]' });
    return;
  }

  const [longitude, latitude] = geometry.coordinates;
  if (typeof longitude !== 'number' || typeof latitude !== 'number' ||
      longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    res.status(400).json({ error: 'Invalid coordinates' });
    return;
  }

  if (distance === undefined || distance === null || typeof distance !== 'number' || distance <= 0) {
    res.status(400).json({ error: 'x-distance is required and must be a positive number' });
    return;
  }

  next();
};

export const validatePropertyId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;

  if (!id || id.length === 0) {
    res.status(400).json({ error: 'Property ID is required' });
    return;
  }

  next();
};

export const validateImageQueryParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { overlay, parcel, building } = req.query;

  if (overlay !== undefined && overlay !== 'yes') {
    res.status(400).json({ error: 'Invalid overlay parameter: must be "yes" if provided' });
    return;
  }

  if (parcel !== undefined) {
    const normalizedColor = typeof parcel === 'string' ? parcel.toLowerCase() : undefined;
    if (!normalizedColor || !VALID_COLORS.includes(normalizedColor as any)) {
      res.status(400).json({
        error: `Invalid parcel color: "${parcel}". Must be a valid color name (e.g., red, green, orange)`,
      });
      return;
    }
  }

  if (building !== undefined) {
    const normalizedColor = typeof building === 'string' ? building.toLowerCase() : undefined;
    if (!normalizedColor || !VALID_COLORS.includes(normalizedColor as any)) {
      res.status(400).json({
        error: `Invalid building color: "${building}". Must be a valid color name (e.g., red, green, orange)`,
      });
      return;
    }
  }

  next();
};
