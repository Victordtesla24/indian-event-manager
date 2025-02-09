/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace jest {
    interface Matchers<R = void, T = {}> 
      extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
  }
}

declare module '@jest/expect' {
  interface AsymmetricMatchers extends TestingLibraryMatchers<typeof expect.stringContaining, void> {}
  interface Matchers<R extends void | Promise<void>, T = {}> 
    extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
}
