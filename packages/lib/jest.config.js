module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        tsconfig: {
          lib: ['ES2017'],
          target: 'ES2017',
        },
      },
    ],
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};