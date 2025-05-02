import { defineConfig } from 'tsdev'

export default defineConfig({
  outDir: './dist',
  rootDir: '.',
  target: 'ES2020',
  module: 'ESNext',
  moduleResolution: 'Node',
  strict: true,
  emsNext: true,
  lib: ['dom', 'dom.iterable', 'esnext']
})
