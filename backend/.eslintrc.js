module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'prettier',
  ],
  plugins: ['node'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Error prevention
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-undef': 'error',
    
    // Code style
    'indent': ['error', 2, { SwitchCase: 1 }],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    
    // Best practices
    'eqeqeq': ['error', 'always'],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-return': 'error',
    
    // Node.js specific
    'node/no-unpublished-require': 'off',
    'node/no-missing-require': 'error',
    'node/no-missing-import': 'error',
    
    // Async/await
    'require-await': 'error',
    'no-return-await': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true,
      },
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'uploads/',
    '.vercel/',
    'coverage/',
  ],
};
