module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        diagnostics: false,
        tsconfig: {
          esModuleInterop: true,
          lib: ["ES2017"],
          module: "CommonJS",
          moduleResolution: "Node",
          target: "ES2017",
        },
      },
    ],
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.schema.ts",
    "!src/**/*.route.ts",
    "!src/**/*.controller.ts",
    "!src/**/*.d.ts",
  ],
};
