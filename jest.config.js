export default {
  // Use ESM for test files
  extensionsToTreatAsEsm: [".ts"],

  // Enable ESM support for tests
  testEnvironment: "node",
  transform: {},
  transformIgnorePatterns: ["/node_modules/", "\\.pnp\\.[^\\/]+$"],
  testMatch: ["**/tests/**/*.js", "**/?(*.)+(test).mjs"],
};
