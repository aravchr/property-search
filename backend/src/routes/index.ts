import { Router } from 'express';
import {
  getAllProperties,
  findPropertiesByCoordinates,
  displayPropertyImage,
} from '../controllers';
import {
  validateGeoJSONPoint,
  validatePropertyId,
  validateImageQueryParams,
} from '../middleware';

const router = Router();

router.get('/properties', getAllProperties);
router.post('/find', validateGeoJSONPoint, findPropertiesByCoordinates);
router.get(
  '/display/:id',
  validatePropertyId,
  validateImageQueryParams,
  displayPropertyImage
);

export default router;
