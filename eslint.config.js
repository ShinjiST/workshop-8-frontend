import { fixupPluginRules } from '@eslint/compat';
import eslintJS from "@eslint/js"
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from "eslint-config-prettier"
import eslintPluginImport from 'eslint-plugin-import'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import eslintPluginReact from "eslint-plugin-react"
import eslintPluginReactHooks from "eslint-plugin-react-hooks"
import eslintPluginReactRefresh from "eslint-plugin-react-refresh"
import eslintPluginUnicorn from "eslint-plugin-unicorn"
import globals from "globals"
import typescriptEslint from 'typescript-eslint';

const patchedReactHooksPlugin = fixupPluginRules(eslintPluginReactHooks)
const patchedImportPlugin = fixupPluginRules(eslintPluginImport)

// 1. ГЛОБАЛЬНЕ ІГНОРУВАННЯ (Щоб не сканував зайве)
const ignoreConfig = {
  ignores: [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.tanstack/**",
    "**/coverage/**",
    "**/playwright-report/**",
    "**/*.config.js",
    "**/*.config.ts"
  ]
}

const baseESLintConfig = {
  name: "eslint",
  extends: [
    eslintJS.configs.recommended,
  ],
  rules: {
    "no-await-in-loop": "error",
    "no-constant-binary-expression": "error",
    "no-duplicate-imports": "error",
    "no-new-native-nonconstructor": "error",
    "no-promise-executor-return": "error",
    "no-self-compare": "error",
    "no-template-curly-in-string": "error",
    "no-unmodified-loop-condition": "error",
    "no-unreachable-loop": "error",
    "no-unused-private-class-members": "error",
    "no-use-before-define": "off", // Вимкнув, бо конфліктує з React
    "require-atomic-updates": "error",
    "camelcase": "off", // Вимкнув, щоб не сварився на ps_id, pz_name
  }
}

const typescriptConfig = {
  name: "typescript",
  extends: [
    ...typescriptEslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaFeatures: { modules: true },
      ecmaVersion: "latest",
      project: "./tsconfig.json",
    },
    globals: {
      ...globals.builtin,
      ...globals.browser,
      ...globals.es2025
    },
  },
  linterOptions: {
    reportUnusedDisableDirectives: "off" // Вимкнув суворість до директив
  },
  plugins: {
    import: patchedImportPlugin
  },
  rules: {
    // === ВІДКЛЮЧЕННЯ СУВОРИХ ПРАВИЛ TYPESCRIPT ===
    "react-refresh/only-export-components": "off",
    // Не вимагати тип повернення функцій
    "@typescript-eslint/explicit-function-return-type": "off",
    // Не вимагати public/private
    "@typescript-eslint/explicit-member-accessibility": "off",
    // Не вимагати типізацію модулів
    "@typescript-eslint/explicit-module-boundary-types": "off",
    // Дозволити any (важливо для швидкої розробки)
    "@typescript-eslint/no-explicit-any": "off",
    // Дозволити require
    "@typescript-eslint/no-require-imports": "off",
    // Не сваритися на невикористані змінні (тільки попередження)
    "@typescript-eslint/no-unused-vars": "warn",
    // Дозволити пусті функції
    "@typescript-eslint/no-empty-function": "off",
    // Дозволити ігнорування TS
    "@typescript-eslint/ban-ts-comment": "off",
    // Вимкнути перевірку промісів (часто дає помилкові спрацювання)
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/unbound-method": "off",
    
    // Імпорти
    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/consistent-type-exports": "off",
    "no-duplicate-imports": "off", // <--- ДОДАНО: Дозволяє дублювати імпорти
    "import/no-duplicates": "off", // <--- ДОДАНО: Страховка

    // === ВІДКЛЮЧЕННЯ ПРАВИЛ ПРОМІСІВ ===
    "@typescript-eslint/prefer-promise-reject-errors": "off", // <--- ДОДАНО: Для axios.ts

    // === REACT ===
    "react-refresh/only-export-components": "off", // <--- ДОДАНО: Прибирає ворнінги в сторінках
    
    // Інші
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unsafe-argument": "off"
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      }
    }
  }
}

const reactConfig = {
  name: "react",
  extends: [
    eslintPluginReact.configs.flat["jsx-runtime"],
  ],
  plugins: {
    "react-hooks": patchedReactHooksPlugin,
    "react-refresh": eslintPluginReactRefresh,
  },
  rules: {
    "import/no-anonymous-default-export": "off",
    "react/jsx-boolean-value": "off",
    "react/jsx-filename-extension": [
      1,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
    ],
    "react/jsx-no-target-blank": "off",
    "react/jsx-max-props-per-line": "off",
    "react/jsx-sort-props": "off", // Вимкнув сортування пропсів
    "react/no-unknown-property": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/exhaustive-deps": "warn", // Тільки попередження
    ...patchedReactHooksPlugin.configs.recommended.rules,
    "react-refresh/only-export-components": "off",
  },
}

const jsxA11yConfig = {
  name: "jsxA11y",
  ...jsxA11yPlugin.flatConfigs.recommended,
  plugins: {
    "jsx-a11y": jsxA11yPlugin,
  },
  rules: {
    "jsx-a11y/alt-text": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    // Можна вимкнути інші правила доступності, якщо вони заважають
  }
}

const unicornConfig = {
  name: "unicorn",
  plugins: {
    unicorn: eslintPluginUnicorn,
  },
  rules: {
    "unicorn/filename-case": "off",
    "unicorn/prevent-abbreviations": "off",
    "unicorn/no-null": "off",
    "unicorn/no-console-spaces": "off",
    "unicorn/prefer-module": "off",
    "unicorn/no-array-for-each": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/empty-brace-spaces": "off"
  }
}

const eslintConfig = typescriptEslint.config(
  ignoreConfig, // Додано на початок!
  baseESLintConfig,
  typescriptConfig,
  eslintConfigPrettier,
  reactConfig,
  jsxA11yConfig,
  unicornConfig
)

// Обмежуємо дію конфігів тільки на src папку
eslintConfig.map((config) => {
  if (config.name !== "Global Ignores") {
      config.files = ["src/**/*.ts", "src/**/*.tsx"]
  }
})

export default eslintConfig;