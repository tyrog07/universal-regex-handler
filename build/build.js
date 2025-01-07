// build.js
const esbuild = require('esbuild');
const { createOptions } = require('esbuild-plugin-ts');

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/bundle.js',
    minify: true,
    plugins: [createOptions()],
  })
  .catch(() => process.exit(1));
