import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  verbose: true,
  moduleFileExtensions: ['js', 'ts', 'vue'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.svg$': '<rootDir>/tests/utils/svgTransform.js',
  },
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
  },
  globals: {
    'vue-jest': {
      tsConfig: './tsconfig.json',
    },
  },
};

export default config;
