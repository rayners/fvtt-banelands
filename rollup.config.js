import { createFoundryConfig } from '@rayners/foundry-dev-tools/rollup';

export default createFoundryConfig({
  input: 'src/module.ts',
  moduleId: 'banelands',
  cssFileName: 'banelands.css',
});
