import js from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

export default [
  { ignores: ["dist/**", "node_modules/**", "test/**", "nuxt/**"] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  stylistic.configs.recommended,

  {
    rules: {
      // enable some stylistic rules
      "@stylistic/indent": ["error", 2],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/quotes": ["error", "double"],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
];
