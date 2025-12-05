const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const tseslint = require('typescript-eslint');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  tseslint.configs.recommended,
  {
    ignores: ['dist/*'],
  },
]);
