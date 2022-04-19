import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/utils'

const isFirefox = process.env.TARGET === 'firefox'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: isFirefox ? 2 : 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    ...(isFirefox
      ? {
        browser_action: {
          default_icon: './assets/icon-512.png',
          default_popup: './dist/popup/index.html',
        },
      }
      : {
        action: {
          default_icon: './assets/icon-512.png',
          default_popup: './dist/popup/index.html',
        },
      }),
    // options_ui: {
    //   page: './dist/options/index.html',
    //   open_in_tab: true,
    // },
    background: isFirefox
      ? {
        scripts: ['./dist/background/background.js'],
      }
      : {
        service_worker: './dist/background/background.js',
      },
    icons: {
      16: './assets/icon-512.png',
      48: './assets/icon-512.png',
      128: './assets/icon-512.png',
    },
    permissions: [
      'tabs',
      'storage',
      'activeTab',
    ],
    host_permissions: [
      'http://github.com/*',
      'https://github.com/*',
    ],
    content_scripts: [{
      matches: ['http://github.com/*', 'https://github.com/*'],
      js: ['./dist/contentScripts/index.global.js'],
    }],
    web_accessible_resources: isFirefox
      ? ['dist/contentScripts/style.css']
      : [{
        resources: ['dist/contentScripts/style.css'],
        matches: ['<all_urls>'],
      }],
    commands: {
      'copy-path': {
        description: 'Copy the current page degit path',
        suggested_key: {
          default: 'Alt+Shift+C',
          mac: 'Alt+Shift+C',
        },
      },
    },
    content_security_policy: {
      extension_pages: 'script-src \'self\'; object-src \'self\'',
    },
  }

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts
    manifest.permissions?.push('webNavigation')

    // this is required on dev for Vite script to load
    manifest.content_security_policy = {
      extension_pages: `script-src 'self' http://localhost:${port}; object-src \'self\' http://localhost:${port}`,
    }
  }

  return manifest
}

// import fs from 'fs-extra'
// import type { Manifest } from 'webextension-polyfill'
// import type PkgType from '../package.json'
// import { isDev, port, r } from '../scripts/utils'

// export async function getManifest() {
//   const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

//   // update this file to update this manifest.json
//   // can also be conditional based on your need
//   const manifest: Manifest.WebExtensionManifest = {
//     manifest_version: 2,
//     name: pkg.displayName || pkg.name,
//     version: pkg.version,
//     description: pkg.description,
//     browser_action: {
//       default_icon: './assets/icon-512.png',
//       default_popup: './dist/popup/index.html',
//     },
//     options_ui: {
//       page: './dist/options/index.html',
//       open_in_tab: true,
//       chrome_style: true,
//     },
//     background: {
//       page: './dist/background/index.html',
//       persistent: false,
//     },
//     icons: {
//       16: './assets/icon-512.png',
//       48: './assets/icon-512.png',
//       128: './assets/icon-512.png',
//     },
//     permissions: [
//       'tabs',
//       'storage',
//       'activeTab',
//       'http://*/',
//       'https://*/',
//     ],
//     content_scripts: [{
//       matches: ['http://*/*', 'https://*/*'],
//       js: ['./dist/contentScripts/index.global.js'],
//     }],
//     web_accessible_resources: [
//       'dist/contentScripts/style.css',
//     ],
//   }

//   if (isDev) {
//     // for content script, as browsers will cache them for each reload,
//     // we use a background script to always inject the latest version
//     // see src/background/contentScriptHMR.ts
//     delete manifest.content_scripts
//     manifest.permissions?.push('webNavigation')

//     // this is required on dev for Vite script to load
//     manifest.content_security_policy = `script-src \'self\' http://localhost:${port}; object-src \'self\'`
//   }

//   return manifest
// }
