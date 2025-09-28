// Test setup file
const mongoose = require('mongoose');

// Mock console methods in test environment
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    // Uncomment to suppress console logs during tests
    // log: jest.fn(),
    // debug: jest.fn(),
    // info: jest.fn(),
    // warn: jest.fn(),
    // error: jest.fn(),
  };
}

// Global test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(async () => {
  // Clear all mocks
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(async () => {
  // Close database connection if open
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});
