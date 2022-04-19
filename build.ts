// import { execSync } from 'child_process'
import type { InlineConfig } from 'vite'
import { mergeConfig, build as viteBuild } from 'vite'
import WindiCSS from 'vite-plugin-windicss'
import chokidar from 'chokidar'
import fs from 'fs-extra'
import { getManifest } from './src/manifest'
import { isDev, log, r } from './scripts/utils'
import { sharedConfig } from './vite.config'
import windiConfig from './windi.config'
import packageJson from './package.json'

const config: InlineConfig = {
  ...sharedConfig,
  build: {
    watch: isDev ? {} : undefined,
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

async function writeManifest() {
  await fs.writeJSON(r('extension/manifest.json'), await getManifest(), { spaces: 2 })
  log('PRE', 'write manifest.json')
}

(async() => {
  log('HTML', 'building popup')
  await viteBuild(mergeConfig(config, {
    build: {
      outDir: r('extension/dist'),
      rollupOptions: {
        input: {
          popup: r('src/popup/index.html'),
        },
      },
    },
  }))

  log('Content Scripts', 'building contentScripts')
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

  await writeManifest()
})()

if (isDev) {
  chokidar.watch([r('src/manifest.ts'), r('package.json')])
    .on('change', async() => {
      await writeManifest()
    })
}
