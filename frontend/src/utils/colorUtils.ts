// Function to get average color from an image
export const getAverageColor = (imgElement: HTMLImageElement): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      resolve('#000000');
      return;
    }

    const width = 50; // Small sample size for performance
    const height = 50;
    
    canvas.width = width;
    canvas.height = height;
    
    // Draw image and get color data
    context.drawImage(imgElement, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height).data;
    
    let red = 0;
    let green = 0;
    let blue = 0;
    const total = width * height;
    
    // Calculate average RGB values
    for (let i = 0; i < imageData.length; i += 4) {
      red += imageData[i];
      green += imageData[i + 1];
      blue += imageData[i + 2];
    }
    
    const r = Math.round(red / total);
    const g = Math.round(green / total);
    const b = Math.round(blue / total);
    
    resolve(`rgb(${r}, ${g}, ${b})`);
  });
};

// Function to generate a color palette from a base color
export const generatePalette = (baseColor: string) => {
  // Convert rgb string to values
  const rgb = baseColor.match(/\d+/g)?.map(Number) || [0, 0, 0];
  const [r, g, b] = rgb;

  // Convert to HSL for better color manipulation
  const hsl = rgbToHsl(r, g, b);
  const [h, s, l] = hsl;

  return {
    primary: baseColor,
    light: `hsl(${h}, ${s * 100}%, ${Math.min(l * 1.2, 1) * 100}%)`,
    dark: `hsl(${h}, ${s * 100}%, ${l * 0.8 * 100}%)`,
    accent: `hsl(${(h + 180) % 360}, ${s * 100}%, ${l * 100}%)`,
  };
};

// Helper function to convert RGB to HSL
const rgbToHsl = (red: number, green: number, blue: number): [number, number, number] => {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h * 360, s, l];
};

// Create CSS variables for dynamic colors
export const applyColorPalette = (palette: ReturnType<typeof generatePalette>) => {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(palette)) {
    root.style.setProperty(`--color-${key}`, value);
  }
};
