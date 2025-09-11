// .eslintrc.cjs
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  // standalone ignores block
  { ignores: ["dist/**", "node_modules/**", "test/**"] },

  js.configs.recommended,
  ...tseslint.configs.recommended, // TypeScript recommended rules
  {
    rules: {
      // general tweaks
      "no-console": "warn",
      "prefer-const": "warn",

      // typescript specific
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    }
  }
];
