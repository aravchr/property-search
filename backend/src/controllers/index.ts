import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import axios from 'axios';
import sharp from 'sharp';
import { GeoJSONPoint, Property } from '../types';
import { createPolygonSVG } from '../utils/svgUtils';

export async function getAllProperties(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = `
      SELECT 
        id,
        ST_X(geocode_geo::geometry) as longitude,
        ST_Y(geocode_geo::geometry) as latitude,
        ST_AsGeoJSON(geocode_geo) as geocode_geo,
        ST_AsGeoJSON(parcel_geo) as parcel_geo,
        ST_AsGeoJSON(building_geo) as building_geo,
        image_bounds,
        image_url
      FROM properties
      ORDER BY id;
    `;

    const result = await pool.query(query);

    const properties: Property[] = result.rows.map((row) => ({
      id: row.id,
      longitude: row.longitude,
      latitude: row.latitude,
      geocode_geo: row.geocode_geo ? JSON.parse(row.geocode_geo) : null,
      parcel_geo: row.parcel_geo ? JSON.parse(row.parcel_geo) : null,
      building_geo: row.building_geo ? JSON.parse(row.building_geo) : null,
      image_bounds: row.image_bounds,
      image_url: row.image_url,
    }));

    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    next(error);
  }
}

export async function findPropertiesByCoordinates(
  req: Request<{}, {}, GeoJSONPoint>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { geometry, 'x-distance': distance } = req.body;
    const [longitude, latitude] = geometry.coordinates;

    const query = `
      SELECT id
      FROM properties
      WHERE ST_DWithin(
        geocode_geo,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      )
      ORDER BY ST_Distance(
        geocode_geo,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
      );
    `;

    const result = await pool.query(query, [longitude, latitude, distance]);
    const propertyIds = result.rows.map((row) => row.id);

    res.json(propertyIds);
  } catch (error) {
    console.error('Error finding properties:', error);
    next(error);
  }
}

export async function displayPropertyImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { overlay, parcel, building } = req.query;

    const query = `
      SELECT 
        id,
        ST_AsGeoJSON(parcel_geo) as parcel_geo,
        ST_AsGeoJSON(building_geo) as building_geo,
        image_bounds,
        image_url
      FROM properties
      WHERE id = $1;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    const property = result.rows[0];

    const imageResponse = await axios.get(property.image_url, {
      responseType: 'arraybuffer',
    });

    let imageBuffer = Buffer.from(imageResponse.data);

    if (overlay === 'yes' && (parcel || building)) {
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();
      const width = metadata.width || 0;
      const height = metadata.height || 0;

      const parcelGeo = property.parcel_geo ? JSON.parse(property.parcel_geo) : null;
      const buildingGeo = property.building_geo ? JSON.parse(property.building_geo) : null;

      const svgParts: string[] = [];

      const normalizedParcelColor = parcel && typeof parcel === 'string' ? parcel.toLowerCase() : undefined;
      if (normalizedParcelColor && parcelGeo) {
        svgParts.push(createPolygonSVG(parcelGeo, property.image_bounds, width, height, normalizedParcelColor));
      }

      const normalizedBuildingColor = building && typeof building === 'string' ? building.toLowerCase() : undefined;
      if (normalizedBuildingColor && buildingGeo) {
        svgParts.push(createPolygonSVG(buildingGeo, property.image_bounds, width, height, normalizedBuildingColor));
      }

      if (svgParts.length > 0) {
        const svg = `<svg width="${width}" height="${height}">${svgParts.join('')}</svg>`;
        imageBuffer = await image
          .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
          .jpeg()
          .toBuffer();
      } else {
        imageBuffer = await image.jpeg().toBuffer();
      }
    } else {
      imageBuffer = await sharp(imageBuffer).jpeg().toBuffer();
    }

    res.set('Content-Type', 'image/jpeg');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error displaying image:', error);
    next(error);
  }
}
