module.exports = {
  extends: ['@pure-org/eslint-config-water/node'],
  rules: {
    'no-param-reassign': 'warn',
    'class-methods-use-this': 'warn',
    'no-plusplus': 'off',
    '@typescript-eslint/no-unused-vars': 'warn'
  }
}

