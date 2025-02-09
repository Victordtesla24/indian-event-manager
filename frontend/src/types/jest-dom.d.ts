import '@testing-library/jest-dom';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace jest {
    interface Matchers<R = void, T = {}> 
      extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
  }
}

declare module '@testing-library/jest-dom' {
  export interface JestMatchers<R = void, T = {}> 
    extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
}
