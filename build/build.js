import esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';
import { brotliCompressSync } from 'zlib';
import { execSync } from 'child_process';

async function build() {
  try {
    // Generate Type Definitions using TypeScript compiler
    execSync('tsc --declaration --emitDeclarationOnly --outDir dist/types');

    const esbuildOptions = {
      entryPoints: ['src/index.ts'],
      bundle: true,
      minify: true,
      splitting: true,
      sourcemap: 'external', // Generate external sourcemaps
      sourcesContent: false, // Omit original source code from sourcemaps
      metafile: true,
    };

    // Build configuration for ESM
    await esbuild.build({
      ...esbuildOptions,
      format: 'esm',
      outdir: 'dist/esm', // Separate ESM output directory
    });

    // Build configuration for CJS
    await esbuild.build({
      ...esbuildOptions,
      splitting: false,
      format: 'cjs',
      outdir: 'dist/cjs', // Separate CJS output directory
    });

    // Optionally compress files with Brotli
    const filesToCompress = [
      'dist/esm/index.js',
      'dist/esm/index.js.map',
      'dist/cjs/index.js',
      'dist/cjs/index.js.map',
    ];

    filesToCompress.forEach((file) => {
      const contents = readFileSync(file);
      const compressed = brotliCompressSync(contents);
      writeFileSync(`${file}.br`, compressed);
    });

    console.log('Build completed successfully.');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
