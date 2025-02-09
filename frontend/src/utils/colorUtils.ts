export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }).join('')}`;
};

export const getContrastColor = (hex: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  // Return black for bright colors, white for dark ones
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

export const adjustBrightness = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { r, g, b } = rgb;
  const amount = Math.floor((percent / 100) * 255);

  const newR = Math.max(0, Math.min(255, r + amount));
  const newG = Math.max(0, Math.min(255, g + amount));
  const newB = Math.max(0, Math.min(255, b + amount));

  return rgbToHex(newR, newG, newB);
};

export const generateGradient = (startColor: string, endColor: string, steps: number): string[] => {
  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);
  if (!start || !end) return [startColor, endColor];

  const gradient: string[] = [];
  for (let i = 0; i < steps; i++) {
    const r = Math.round(start.r + (end.r - start.r) * (i / (steps - 1)));
    const g = Math.round(start.g + (end.g - start.g) * (i / (steps - 1)));
    const b = Math.round(start.b + (end.b - start.b) * (i / (steps - 1)));
    gradient.push(rgbToHex(r, g, b));
  }

  return gradient;
};
