import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  silent: true,
  testPathIgnorePatterns: ['dist', 'node_modules'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
  },
};

export default config;
