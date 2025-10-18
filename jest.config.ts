import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.(test|spec).ts', '**/?(*.)+(test|spec).ts'],
  testPathIgnorePatterns: ['/node_modules/', '/deno/'],
};
export default config;
