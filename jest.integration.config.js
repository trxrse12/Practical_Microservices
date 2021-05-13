module.exports = {
  "roots": [
    "./src"
  ],
  "testMatch": [
    "**/?(*.)+(integration).+(spec|test).+(ts|tsx|js)"
  ],
  "setupFilesAfterEnv": ["jest-extended"]
}