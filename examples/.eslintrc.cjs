module.exports = {
  extends: ['../.eslintrc.cjs'],
  parserOptions: {
    project: ['./tsconfig.settings.json'],
    tsconfigRootDir: `${__dirname}/..`,
  },
  rules: {
    'no-console': 'off',
  },
}
