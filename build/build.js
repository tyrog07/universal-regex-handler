const esbuild = require('esbuild');
const { readFileSync, writeFileSync } = require('fs');
const { brotliCompressSync } = require('zlib');
const { execSync } = require('child_process');

// Generate Type Definitions using TypeScript compiler
execSync('tsc --declaration --emitDeclarationOnly --outDir dist/types');

// Build configuration for ESM
esbuild
  .build({
    entryPoints: ['src/index.ts'], // Entry point for your application
    bundle: true, // Bundle all dependencies
    minify: true, // Minify the output files
    splitting: true, // Enable code splitting
    format: 'esm', // Output format (ESM)
    outdir: 'dist/esm', // Output directory for ESM
    sourcemap: true, // Generate sourcemaps
    metafile: true, // Generate metafile for analysis
  })
  .then(() => {
    // Optionally compress files with Brotli
    const files = ['dist/esm/index.js'];
    files.forEach((file) => {
      const contents = readFileSync(file);
      const compressed = brotliCompressSync(contents);
      writeFileSync(`${file}.br`, compressed);
    });
  })
  .catch(() => process.exit(1));

// Build configuration for CommonJS
esbuild
  .build({
    entryPoints: ['src/index.ts'], // Entry point for your application
    bundle: true, // Bundle all dependencies
    minify: true, // Minify the output files
    splitting: false, // Disable code splitting for CommonJS
    format: 'cjs', // Output format (CommonJS)
    outdir: 'dist/cjs', // Output directory for CommonJS
    sourcemap: true, // Generate sourcemaps
    metafile: true, // Generate metafile for analysis
  })
  .then(() => {
    // Optionally compress files with Brotli
    const files = ['dist/cjs/index.js'];
    files.forEach((file) => {
      const contents = readFileSync(file);
      const compressed = brotliCompressSync(contents);
      writeFileSync(`${file}.br`, compressed);
    });
  })
  .catch(() => process.exit(1));
