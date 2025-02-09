/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom';
import { jest, beforeEach, afterEach } from '@jest/globals';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace jest {
    interface Matchers<R = void, T = {}> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
  }
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
  root = null;
  rootMargin = '';
  thresholds = [];
  takeRecords = () => [];
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

// Mock fetch
const mockFetchImplementation = () => 
  Promise.resolve(new Response(JSON.stringify({}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  }));

const fetchMock = jest.fn(mockFetchImplementation);

// Type assertion for global fetch
(global as any).fetch = fetchMock;

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  fetchMock.mockImplementation(mockFetchImplementation);
});

// Clean up after each test
afterEach(() => {
  jest.restoreAllMocks();
});
