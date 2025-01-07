const esbuild = require('esbuild');
const { readFileSync, writeFileSync } = require('fs');
const { brotliCompressSync } = require('zlib');

// Build configuration
esbuild
  .build({
    entryPoints: ['src/index.ts'], // Entry point for your application
    bundle: true, // Bundle all dependencies
    minify: true, // Minify the output files
    splitting: true, // Enable code splitting
    format: 'esm', // Output format (ESM)
    outdir: 'dist', // Output directory
    sourcemap: true, // Generate sourcemaps
    metafile: true, // Generate metafile for analysis
  })
  .then(() => {
    // Optionally compress files with Brotli
    const files = ['dist/index.js'];
    files.forEach((file) => {
      const contents = readFileSync(file);
      const compressed = brotliCompressSync(contents);
      writeFileSync(`${file}.br`, compressed);
    });
  })
  .catch(() => process.exit(1));
