module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.tsx?$': 'ts-jest',
    "^.+\\.svg$": "jest-svg-transformer",
  },
  moduleNameMapper: {
    "^components(.*)$": "<rootDir>/src/components/$1",
    "^types(.*)$": "<rootDir>/src/types/$1",
    "^libraries(.*)$": "<rootDir>/src/libraries/$1",
    "^assets(.*)$": "<rootDir>/src/assets/$1",
  },
  testRegex: '/__tests__/.*\\.(test|spec)\\.(ts|tsx|js)?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ["<rootDir>src/__tests__/setup.ts"]
}