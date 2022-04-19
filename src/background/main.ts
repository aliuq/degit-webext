import { sendMessage } from 'webext-bridge'
import { log } from '~/logic'

const hosts = ['github.com']
const pathRules = [
  // Project root
  /^\/(?<name>[^\/]*)\/(?<repo>[^\/]*)$/,
  // Subdirectory
  /^\/(?<name>[^\/]*)\/(?<repo>[^\/]*)\/tree\/(?<branch>[^\/]*)(\/(?<directory>.*))?$/,
]
const getHostName = (hostname: string) => hosts.find(h => h === hostname)
const getRules = (pathname: string) => {
  for (const rule of pathRules) {
    const match = pathname.match(rule)
    if (match)
      return match.groups
  }
  return null
}

browser.runtime.onConnect.addListener(async() => {
  const commands = await browser.commands.getAll()
  const copyPathShortcut = commands.find(c => c.name === 'copy-path')
  if (copyPathShortcut)
    await browser.storage.local.set({ shortcut: copyPathShortcut.shortcut })
})

browser.tabs.onUpdated.addListener(async(tabId, changeInfo, { url }) => {
  const { 'show-element': showElement } = await browser.storage.local.get('show-element')
  if (changeInfo.status === 'complete' && showElement) {
    const { host, source } = getSource(url as string)
    if (!source)
      return
    sendMessage('modify-pages-changed', { source, host }, { context: 'content-script', tabId })
  }
})

browser.storage.onChanged.addListener(async(changes: Record<string, any>) => {
  for (const [key, { newValue }] of Object.entries(changes)) {
    if (key === 'show-element') {
      const tabs = await getAllTabs()
      tabs.forEach((tab) => {
        const data: any = { status: newValue }
        if (newValue) {
          const { host, source } = getSource(tab.url as string)
          if (!source)
            return
          data.source = source
          data.host = host
        }
        sendMessage('update-element', data, { context: 'content-script', tabId: tab.id as number })
      })
    }
  }
})

browser.commands.onCommand.addListener(async(command) => {
  const { 'enable-shortcut': enableShortcut } = await browser.storage.local.get('enable-shortcut')
  if (command === 'copy-path' && enableShortcut) {
    const tab = await browser.tabs.query({ active: true, currentWindow: true })
    if (!tab.length)
      return

    const { source } = getSource(tab[0].url as string)
    if (!source)
      return
    log(source)
    sendMessage('copy-source', { source }, { context: 'content-script', tabId: tab[0].id as number })
  }
})

// Get the current tab source for `degit` command
function getSource(url: string) {
  try {
    const { hostname, pathname } = new URL(url as string)
    const host = getHostName(hostname)
    const match = getRules(pathname)
    if (!host || !match)
      return { host: null, source: null }

    const { name, repo, directory, branch } = match
    let source = `npx degit ${name}/${repo}`
    if (directory)
      source += `/${directory}`

    if (branch && branch !== 'master')
      source += `#${branch}`

    return { source, host }
  }
  catch (e) {
    console.error(e)
    return { host: null, source: null }
  }
}

// Get all valid tabs
async function getAllTabs() {
  return await browser.tabs.query({
    url: [
      'http://github.com/*',
      'https://github.com/*',
    ],
  })
}
