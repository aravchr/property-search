export function createPolygonSVG(
  geoJson: any,
  imageBounds: number[],
  width: number,
  height: number,
  color: string
): string {
  const [minLng, minLat, maxLng, maxLat] = imageBounds;

  let coordinates: number[][] = [];
  if (geoJson.type === 'Polygon') {
    coordinates = geoJson.coordinates[0];
  } else if (geoJson.type === 'MultiPolygon') {
    coordinates = geoJson.coordinates[0][0];
  }

  const points = coordinates
    .map(([lng, lat]) => {
      const x = ((lng - minLng) / (maxLng - minLng)) * width;
      const y = ((maxLat - lat) / (maxLat - minLat)) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return `<polygon points="${points}" fill="none" stroke="${color}" stroke-width="3" />`;
}

