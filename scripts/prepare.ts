// generate stub index.html files for dev entry
import { execSync } from 'child_process'
import fs from 'fs-extra'
import chokidar from 'chokidar'
// import fetch from 'node-fetch'
import { isDev, log, port, r } from './utils'

/**
 * Stub index.html to use Vite in development
 */
async function stubIndexHtml() {
  const views = [
    'options',
    'popup',
    'background',
  ]

  for (const view of views) {
    await fs.ensureDir(r(`extension/dist/${view}`))
    let data = await fs.readFile(r(`src/${view}/index.html`), 'utf-8')

    data = data
      // .replace('"./main.ts"', `"http://localhost:${port}/${view}/main.ts"`)
      .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>')

    await fs.writeFile(r(`extension/dist/${view}/index.html`), data, 'utf-8')
    // Write ts
    const dataTs = await fs.readFile(r(`src/${view}/main.ts`), 'utf-8')
    await fs.writeFile(r(`extension/dist/${view}/main.ts`), dataTs, 'utf-8')
    log('PRE', `stub ${view}`)
  }
}

async function stubMainTs() {
  const views = [
    'background',
  ]

  for (const view of views) {
    await fs.ensureDir(r(`extension/dist/${view}`))
    const data = await fs.readFile(r(`src/${view}/main.ts`), 'utf-8')

    await fs.writeFile(r(`extension/dist/${view}/main.ts`), data, 'utf-8')
    log('PRE', `stub ${view}`)
  }
}

function writeManifest() {
  execSync('npx esno ./scripts/manifest.ts', { stdio: 'inherit' })
}

writeManifest()

if (isDev) {
  stubIndexHtml()
  // stubMainTs()
  chokidar.watch(r('src/**/*.html'))
    .on('change', () => {
      stubIndexHtml()
      // stubMainTs()
    })
  chokidar.watch([r('src/manifest.ts'), r('package.json')])
    .on('change', () => {
      writeManifest()
    })
}
