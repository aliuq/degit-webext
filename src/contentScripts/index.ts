/* eslint-disable no-console */
import { onMessage } from 'webext-bridge'
import { createApp } from 'vue'
import { useClipboard } from '@vueuse/core'
import type { Source } from 'shim'
import Github from './views/Github.vue'
import { log } from '~/logic'

const hosts = ['github.com']
const allowPathReg = [
  // Github repository root
  /^\/[^/]*\/[^/]*\/?$/,
  // Github repository Subdirectory
  /^\/[^/]*\/[^/]*\/tree\/[^/]*(\/.*)?$/,
]

const validHost = () => hosts.includes(location.hostname)
const validPath = () => allowPathReg.some(reg => location.pathname.match(reg))

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
;(() => {
  log('Setup from content script')

  onMessage('modify-pages-changed', ({ data }) => {
    log(`Modify pages changed: [${data.source}]`)
    renderGithubButton(data.source)
  })

  onMessage('update-element', ({ data }) => {
    log('Update element')
    log(data)
    if (data.status)
      renderGithubButton(data.source as string)
    else
      removeCopyEl()
  })

  onMessage('copy-source', ({ data }) => {
    log('copy-source')
    log(data)
    if (!data.source)
      return
    const { copy } = useClipboard({ source: data.source })
    copy()
  })

  onMessage('get-source', () => {
    log('get-source')
    if (!validHost() || !validPath())
      return
    const source: Source | undefined = getGithubSource()
    if (!source)
      return
    const directoryText: string | undefined = (<HTMLElement>document.querySelector('.flex-self-center')).innerText
    const dirMatch = validDirectory(directoryText)
    return renderSource(Object.assign(source, dirMatch))
  })
})()

function renderGithubButton(source: string) {
  try {
    // Github: Find last element by class name `d-none`
    const selectors = [
      // Root
      '.file-navigation > span.d-none:last-of-type',
      // Subdirectory
      '.file-navigation > .d-flex > .d-none:last-of-type',
    ].join(', ')
    const container = document.querySelector(selectors)
    if (!container)
      return
    const parent = container.parentNode
    const el = parent?.querySelector('.webext-degit')
    el && el.remove()
    const root = document.createElement('div')
    root.classList.add('webext-degit', container.classList.contains('btn') ? 'mr-2' : 'ml-2')
    parent?.insertBefore(root, container)
    createApp(Github, { source }).mount(root)
  }
  catch (err) {
    console.error(err)
  }
}

function removeCopyEl(container = document) {
  const el = container.querySelector('.webext-degit')
  el && el.remove()
}

function validDirectory(dir: string) {
  const match = dir.match(/^[^/]*\/(?<directory>.*\/)$/)
  return match?.groups
}

/**
 * If this repo path is root, use `pathname` to resolved
 * If this repo path is subdirectory, use selector `.js-repo-root a` to resolved
 * @returns {Source}
 */
function getGithubSource(): Source | undefined {
  const subUrl = (<HTMLAnchorElement>document.querySelector('.js-repo-root a'))?.href
  if (subUrl) {
    const reg = /^https?:\/\/github\.com\/(?<name>[^/]*)\/(?<repo>[^/]*)(\/tree\/(?<branch>.*))?$/
    // @ts-expect-error Fix { [key: string]: string; } | undefined
    return subUrl.match(reg)?.groups
  }
  else {
    const reg = /^\/(?<name>[^/]*)\/(?<repo>[^/]*)(\/tree\/(?<branch>.*))?\/?$/
    // @ts-expect-error Fix { [key: string]: string; } | undefined
    return location.pathname.match(reg)?.groups
  }
}

function renderSource(source: Source) {
  const { name, repo, directory, branch } = source
  let text = `npx degit ${name}/${repo}`

  if (directory)
    text += `/${directory}`

  if (branch && branch !== 'master')
    text += `#${branch}`

  return text.trim()
}
