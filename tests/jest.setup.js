import '@testing-library/jest-dom';
import React from 'react';

process.env.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// JSDOM does not expose Request, but Next defines request subclasses while loading
// modules used by these tests. The exercised paths mock network transport, so a minimal
// constructor is sufficient and remains scoped to Jest.
if (typeof globalThis.Request === 'undefined') {
  globalThis.Request = class Request {
    constructor(input, init = {}) {
      this.url = String(input);
      Object.assign(this, init);
    }
  };
}

if (typeof globalThis.Response === 'undefined') {
  globalThis.Response = class Response {
    constructor(body = null, init = {}) {
      this.body = body;
      Object.assign(this, init);
    }
  };
}

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src = '', alt = '', priority, fetchPriority, ...props }) =>
    React.createElement('img', { src, alt, ...props }),
}));

Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});
