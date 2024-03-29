module.exports = {
  name: 'strict-script',
  plugins: {
    lint: {
      presetEslint: 'node',
      eslint: {
        entry: ['src/**/*.ts', 'test/**/*.ts'],
      },
      stylelint: {
        disable: true,
      },
      presetCommitlint: 'recommended',
    },
  },
};

