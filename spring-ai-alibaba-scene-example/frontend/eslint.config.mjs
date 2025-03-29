import {dirname} from "path";
import {fileURLToPath} from "url";
import {FlatCompat} from "@eslint/eslintrc";
import nextEslint from 'eslint-config-next';
import eslint from "@next/eslint-plugin-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    resolvePluginsRelativeTo: __dirname,
    recommendedConfig: eslint.configs.recommended
});

const eslintConfig = [
    nextEslint,
    ...compat.extends("next/core-web-vitals", "next/typescript",  'eslint-config-next'),
];

export default eslintConfig;
