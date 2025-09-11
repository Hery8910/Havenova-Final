import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [".next"],
    rules: {
      "react/no-unescaped-entities": "error",
      "@next/next/no-assign-module-variable": "error",
    },
  },
];

export default eslintConfig;
