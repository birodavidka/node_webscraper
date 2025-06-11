const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // where to look for tests and modules
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  // only .ts test files matching *.test.ts or *.spec.ts
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
