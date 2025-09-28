import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// Add any global test setup here
Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance']
    };
  }
});

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    };
  }
});

// Mock global timer functions for Jest environment
global.setInterval = jest.fn().mockImplementation((callback, delay) => {
  return setTimeout(callback, delay);
});

global.clearInterval = jest.fn().mockImplementation((id) => {
  clearTimeout(id);
});