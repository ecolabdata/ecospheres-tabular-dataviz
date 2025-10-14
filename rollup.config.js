import { nodeResolve } from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import postcss from 'rollup-plugin-postcss'

export default {
  input: 'src/index.mjs',
  output: {
    file: 'dist/index.js',
    format: 'es'
  },
  plugins: [json(), nodeResolve(), postcss()],
  external: ['chart.js']
}
