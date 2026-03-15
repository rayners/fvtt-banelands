import foundryConfig from '@rayners/foundry-dev-tools/eslint';

export default [
  ...foundryConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
