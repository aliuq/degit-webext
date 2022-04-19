import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'
import { sharedConfig } from './vite.config'
import { isDev, r } from './scripts/utils'
import windiConfig from './windi.config'

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  base: 'http://localhost:3304/',
  server: {
    port: 3304,
    hmr: {
      host: 'localhost',
    },
  },
  build: {
    watch: isDev
      ? {}
      : undefined,
    outDir: r('extension/dist/background'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    terserOptions: {
      mangle: false,
    },
    lib: {
      entry: r('src/background/main.ts'),
      formats: ['cjs'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'background.js',
        extend: true,
      },
    },
  },
  plugins: [
    ...sharedConfig.plugins!,

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      config: {
        ...windiConfig,
        // disable preflight to avoid css population
        preflight: false,
      },
    }),
  ],
})
