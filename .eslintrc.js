module.exports = {
  root: true,
  extends: [
    '@react-native-community', // Extends the React Native community config
    'eslint:recommended', // Use recommended rules from ESLint
    'plugin:react/recommended', // Recommended React rules
    'plugin:react-native/all', // All React Native-specific rules
    'plugin:import/errors', // Helps manage ES6+ import/export syntax
    'plugin:import/warnings',
    'plugin:jsx-a11y/recommended', // Accessibility checks
    'plugin:prettier/recommended', // Enables Prettier as a linting rule
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Enable JSX parsing
    },
    ecmaVersion: 2021, // Support modern ECMAScript features
    sourceType: 'module',
  },
  rules: {
    // Enforce Prettier rules
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 80,
      },
    ],
    'react/jsx-filename-extension': [1, {extensions: ['.js', '.jsx', '.tsx']}], // Allow JSX in .js and .tsx files
    'react/react-in-jsx-scope': 'off', // React 17+ does not require import React in JSX
    'no-unused-vars': 'warn', // Set unused variables as warning
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external', 'internal']],
        'newlines-between': 'always',
      },
    ], // Organize imports in a consistent order
    'react-native/no-inline-styles': 'warn', // Warn about inline styles in React Native
    'react-native/no-unused-styles': 'error', // Error for unused styles
    'react-native/no-color-literals': 'warn', // Warn if color literals are used in styles
    'react-hooks/rules-of-hooks': 'error', // Checks the rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks the dependency array for effects
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  plugins: [
    'react', // React-specific linting rules
    'react-native', // React Native-specific linting rules
    'import', // Linting for ES6 import/export syntax
    'jsx-a11y', // Accessibility checks for JSX elements
    'prettier', // Linting with Prettier
  ],
};
