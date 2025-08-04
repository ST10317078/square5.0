module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
<<<<<<< HEAD
    project: ["./tsconfig.json", "./tsconfig.dev.json"],
=======
    project: ["tsconfig.json", "tsconfig.dev.json"],
>>>>>>> 19676a782321ebe9a783a6a59363415e2bad9248
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts", ".tsx"],
      },
    },
  },
  ignorePatterns: ["lib/**", "generated/**"],
  plugins: ["@typescript-eslint", "import"],
  rules: {
<<<<<<< HEAD
    "quotes": ["error", "double", { avoidEscape: true }],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
    "object-curly-spacing": ["error", "always"],
    "max-len": ["error", { code: 120, ignoreUrls: true }],
    "operator-linebreak": ["error", "before"],
=======
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
>>>>>>> 19676a782321ebe9a783a6a59363415e2bad9248
  },
};
