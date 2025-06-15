import { defineConfig, globalIgnores } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores(["projects/**/*", "src/version/version.ts", "src/assets/**/*"]),
    {
        files: ["**/*.ts"],

        extends: compat.extends(
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended",
            "plugin:@angular-eslint/recommended",
            "plugin:@angular-eslint/template/process-inline-templates",
            "plugin:prettier/recommended",
        ),

        plugins: {
            "simple-import-sort": simpleImportSort,
        },

        rules: {
            "@angular-eslint/directive-selector": ["error", {
                type: "attribute",
                prefix: "fac",
                style: "camelCase",
            }],

            "@angular-eslint/component-selector": ["error", {
                type: "element",
                prefix: "fac",
                style: "kebab-case",
            }],

            "simple-import-sort/imports": ["error", {
                groups: [
                    ["^@angular", "^@?\\w"],
                    ["^(@|components)(/.*|$)"],
                    ["^\\u0000"],
                    ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
                    ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
                ],
            }],

            "simple-import-sort/exports": "error",
        },
    },
    {
        files: ["**/*.html"],

        extends: compat.extends(
            "plugin:@angular-eslint/template/recommended",
            "plugin:@angular-eslint/template/accessibility",
        ),

        rules: {},
    },
    {
        files: ["**/*.html"],
        ignores: ["**/*inline-template-*.component.html"],
        extends: compat.extends("plugin:prettier/recommended"),

        rules: {
            "prettier/prettier": ["error", {
                parser: "angular",
            }],
        },
    },
]);