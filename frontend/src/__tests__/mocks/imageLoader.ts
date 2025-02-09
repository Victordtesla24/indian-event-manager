import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

export const mockLoadImage = jest.fn((src: string) => {
  return new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.src = src;
    resolve(img);
  });
});

describe('Image Loader Mock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide a mock load image function', () => {
    expect(typeof mockLoadImage).toBe('function');
  });

  it('should return a promise that resolves to an image', async () => {
    const testSrc = '/test/image.jpg';
    const result = await mockLoadImage(testSrc);

    expect(result).toBeInstanceOf(HTMLImageElement);
    expect(result.src).toContain(testSrc);
    expect(mockLoadImage).toHaveBeenCalledWith(testSrc);
  });

  it('should handle multiple image loads', async () => {
    const sources = ['/test/image1.jpg', '/test/image2.jpg', '/test/image3.jpg'];
    const results = await Promise.all(sources.map(src => mockLoadImage(src)));

    results.forEach((img, index) => {
      expect(img).toBeInstanceOf(HTMLImageElement);
      expect(img.src).toContain(sources[index]);
    });

    expect(mockLoadImage).toHaveBeenCalledTimes(sources.length);
    sources.forEach(src => {
      expect(mockLoadImage).toHaveBeenCalledWith(src);
    });
  });
});
