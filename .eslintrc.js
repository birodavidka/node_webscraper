module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier", // kikapcsolja az ESLint-stíluskonfliktusokat
    "plugin:prettier/recommended",
  ],
  env: {
    node: true,
    es2020: true,
  },
  rules: {
    // itt testreszabhatod a szabályokat
  },
};
