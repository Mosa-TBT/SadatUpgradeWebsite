import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist", "coverage"] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  {
    files: ["**/*.{js,jsx}"],
    linterOptions: { reportUnusedDisableDirectives: "error" },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    settings: { react: { version: "19.2" } },
    plugins: { "react-refresh": reactRefresh },
    rules: {
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    // React Three Fiber scenes use custom JSX props (position, args, intensity,
    // castShadow, ...) and mutate three.js objects imperatively; the core React
    // lint rules below do not apply to them.
    files: ["src/containers/workstation/**/*.{js,jsx}"],
    rules: {
      "react/no-unknown-property": "off",
      "react/prop-types": "off",
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
      "no-unused-vars": "off",
    },
  },
];
