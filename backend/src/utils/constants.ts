export const VALID_COLORS = [
  'red', 'green', 'blue', 'orange', 'yellow', 'purple', 'pink', 'brown',
  'black', 'white', 'gold', 'silver' 
] as const;

export type ValidColor = typeof VALID_COLORS[number];

