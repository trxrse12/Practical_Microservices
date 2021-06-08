module.exports = {
  "roots": [
    "./src"
  ],
  "preset": "ts-jest",
  "testEnvironment": "node",
  "testMatch": [
    "**/?(*.)+(integration).+(spec|test).+(ts|tsx|js)"
  ],
  "setupFilesAfterEnv": ["jest-extended"]
}