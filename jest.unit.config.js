module.exports = {
  "roots": [
    "./src"
  ],
  "preset": "ts-jest",
  "testEnvironment": "node",
  "testMatch": [
    "**/?(*.)+(unit).+(spec|test).+(ts|tsx|js)"
  ],
  "setupFilesAfterEnv": ["jest-extended"]
}