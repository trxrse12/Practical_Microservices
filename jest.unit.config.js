module.exports = {
  "roots": [
    "./src"
  ],
  "testMatch": [
    "**/?(*.)+(unit).+(spec|test).+(ts|tsx|js)"
  ],
  "setupFilesAfterEnv": ["jest-extended"],
  "preset": "ts-jest",
  "testEnvironment": "node",
  "collectCoverage": true,
  "coverageDirectory": "coverage",
  "coverageThreshold": {
    "global": {
      "branches":100,
      "functions": 100,
      "lines":100,
      "statements":100
    }
  },
  "verbose":true,
  "testPathIgnorePatterns":[
    "/node_modules/"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
}