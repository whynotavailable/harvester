import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import stylisticJs from '@stylistic/eslint-plugin-js'


export default defineConfig([
  { ignores: ['pkg/ui'] }, // It has it's own eslint
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js, stylisticJs }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  stylisticJs.configs.all,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@stylistic/js/multiline-comment-style": "off"
    }
  }
]);
