// jest.config.js
export default {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.js'],
  transform: {},
  testMatch: ['**/__tests__/**/*.test.js'],
   collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/index.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  forceExit: true,
  testTimeout: 60000,
  bail: false,
};
