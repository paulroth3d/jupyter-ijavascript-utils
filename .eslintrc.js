module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'no-trailing-spaces': ['error', { skipBlankLines: true, ignoreComments: true }],
    'comma-dangle': 'off',
    'spaced-comment': 'off',
    'no-confusing-arrow': 'off',
    'no-console': 'off',
    'no-unused-vars': ['error', { args: 'none' }],
    'arrow-parens': ['error', 'always'],
    'no-nested-ternary': 'off',
    'no-restricted-syntax': 'off',
    'consistent-return': 'off',
    'object-curly-newline': 'off',
    'no-multi-spaces': 'off',
    'lines-between-class-members': 'off',
    'no-unneeded-ternary': 'off',
    'no-else-return': ['error', { allowElseIf: true }],
    'implicit-arrow-linebreak': 'off',
    'max-len': ['error', { code: 150 }]
  }
};
