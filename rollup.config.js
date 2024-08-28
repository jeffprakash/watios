// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json'; // JSON plugin for handling JSON files

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.cjs.js',
      format: 'cjs',
    },
    plugins: [
      resolve(),
      commonjs({
        include: 'node_modules/**',
        namedExports: {
          'node_modules/axios/index.js': ['default']
        }
      }),
      json(),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
    },
    plugins: [
      resolve(),
      commonjs({
        include: 'node_modules/**',
        namedExports: {
          'node_modules/axios/index.js': ['default']
        }
      }),
      json(),
    ],
  },
];
