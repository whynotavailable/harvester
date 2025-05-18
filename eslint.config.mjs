import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  { ignores: ['pkg/ui'] }, // It has it's own eslint
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js, stylistic }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  stylistic.configs.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@stylistic/js/multiline-comment-style": "off",
      "@stylistic/semi": ["error", "always"],
      "@stylistic/quotes": ["error", "single", { "avoidEscape": true }]
    }
  }
]);
