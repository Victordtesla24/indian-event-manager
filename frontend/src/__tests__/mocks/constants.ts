import '@testing-library/jest-dom';

export const mockConstants = {
  API_URL: 'http://localhost:8000/api/v1',
  IMAGE_BASE_URL: 'http://localhost:8000/static/uploads',
  DEFAULT_PAGE_SIZE: 10,
  SUPPORTED_LANGUAGES: ['English', 'Hindi', 'Tamil', 'Telugu'],
  EVENT_CATEGORIES: ['Cultural', 'Entertainment', 'Dance', 'Music', 'Food', 'Sports'],
  CITIES: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'],
  DATE_FORMAT: 'YYYY-MM-DD',
  CURRENCY: 'INR',
};

describe('Constants Mock', () => {
  it('should provide API URL', () => {
    expect(mockConstants.API_URL).toBeDefined();
    expect(typeof mockConstants.API_URL).toBe('string');
    expect(mockConstants.API_URL).toContain('localhost');
  });

  it('should provide image base URL', () => {
    expect(mockConstants.IMAGE_BASE_URL).toBeDefined();
    expect(typeof mockConstants.IMAGE_BASE_URL).toBe('string');
    expect(mockConstants.IMAGE_BASE_URL).toContain('uploads');
  });

  it('should provide default page size', () => {
    expect(mockConstants.DEFAULT_PAGE_SIZE).toBeDefined();
    expect(typeof mockConstants.DEFAULT_PAGE_SIZE).toBe('number');
    expect(mockConstants.DEFAULT_PAGE_SIZE).toBeGreaterThan(0);
  });

  it('should provide supported languages', () => {
    expect(mockConstants.SUPPORTED_LANGUAGES).toBeDefined();
    expect(Array.isArray(mockConstants.SUPPORTED_LANGUAGES)).toBe(true);
    expect(mockConstants.SUPPORTED_LANGUAGES.length).toBeGreaterThan(0);
    mockConstants.SUPPORTED_LANGUAGES.forEach(lang => {
      expect(typeof lang).toBe('string');
    });
  });

  it('should provide event categories', () => {
    expect(mockConstants.EVENT_CATEGORIES).toBeDefined();
    expect(Array.isArray(mockConstants.EVENT_CATEGORIES)).toBe(true);
    expect(mockConstants.EVENT_CATEGORIES.length).toBeGreaterThan(0);
    mockConstants.EVENT_CATEGORIES.forEach(category => {
      expect(typeof category).toBe('string');
    });
  });

  it('should provide cities', () => {
    expect(mockConstants.CITIES).toBeDefined();
    expect(Array.isArray(mockConstants.CITIES)).toBe(true);
    expect(mockConstants.CITIES.length).toBeGreaterThan(0);
    mockConstants.CITIES.forEach(city => {
      expect(typeof city).toBe('string');
    });
  });

  it('should provide date format', () => {
    expect(mockConstants.DATE_FORMAT).toBeDefined();
    expect(typeof mockConstants.DATE_FORMAT).toBe('string');
    expect(mockConstants.DATE_FORMAT).toBe('YYYY-MM-DD');
  });

  it('should provide currency', () => {
    expect(mockConstants.CURRENCY).toBeDefined();
    expect(typeof mockConstants.CURRENCY).toBe('string');
    expect(mockConstants.CURRENCY).toBe('INR');
  });
});
