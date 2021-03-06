/** @typedef {import('@jest/types').Config.InitialOptions} JestConfig */

import createConfigFactory from 'next/jest.js'

/** @type {JestConfig} */
const config = {
  coverageProvider: 'v8',
  collectCoverageFrom: ['**/*.@(ts|tsx)', '!**/*.d.ts', '!**/node_modules/**'],
  rootDir: '../',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
}

const createConfig = createConfigFactory({ dir: process.cwd() })

export default createConfig(config)
