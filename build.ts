import { execSync } from 'child_process'
import type { InlineConfig } from 'vite'
import { mergeConfig, build as viteBuild } from 'vite'
import WindiCSS from 'vite-plugin-windicss'
import chokidar from 'chokidar'
import { isDev, log, port, r } from './scripts/utils'
import { sharedConfig } from './vite.config'
import windiConfig from './windi.config'
import packageJson from './package.json'

const config: InlineConfig = {
  ...sharedConfig,
  build: {
    watch: isDev
      ? {}
      : undefined,
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    minify: isDev ? 'esbuild' : 'terser',
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false,
      compress: {
        // 生产环境时移除console
        drop_console: true,
        drop_debugger: true,
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
}

function writeManifest() {
  execSync('npx esno ./scripts/manifest.ts', { stdio: 'inherit' })
}

(async() => {
  log('HTML', 'building popup and options')
  await viteBuild(mergeConfig(config, {
    base: '/dist/',
    server: {
      port,
      hmr: {
        host: 'localhost',
      },
    },
    build: {
      outDir: r('extension/dist'),
      rollupOptions: {
        input: {
          options: r('src/options/index.html'),
          popup: r('src/popup/index.html'),
        },
      },
    },
  }))

  log('HTML', 'building contentScripts')
  await viteBuild(mergeConfig(config, {
    build: {
      outDir: r('extension/dist/contentScripts'),
      lib: {
        entry: r('src/contentScripts/index.ts'),
        name: packageJson.name,
        formats: ['iife'],
      },
      rollupOptions: {
        output: {
          entryFileNames: 'index.global.js',
          extend: true,
        },
      },
    },
  }))

  log('Background', 'building background.js')
  await viteBuild(mergeConfig(config, {
    build: {
      outDir: r('extension/dist/background'),
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
  }))

  log('Build', 'done')

  writeManifest()
})()

if (isDev) {
  chokidar.watch([r('src/manifest.ts'), r('package.json')])
    .on('change', () => {
      writeManifest()
    })
}
