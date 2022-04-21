import { sendMessage } from 'webext-bridge'
import { log } from '~/logic'

browser.runtime.onConnect.addListener(async() => {
  const commands = await browser.commands.getAll()
  const copyPathShortcut = commands.find(c => c.name === 'copy-path')
  if (copyPathShortcut)
    await browser.storage.local.set({ shortcut: copyPathShortcut.shortcut })
})

browser.tabs.onUpdated.addListener(async(tabId, changeInfo) => {
  const { 'show-element': showElement } = await browser.storage.local.get('show-element')
  if (changeInfo.status === 'complete' && showElement) {
    const source = await getSource(tabId)
    if (!source)
      return
    sendMessage('modify-pages-changed', { source }, { context: 'content-script', tabId })
  }
})

browser.storage.onChanged.addListener(async(changes: Record<string, any>) => {
  for (const [key, { newValue }] of Object.entries(changes)) {
    if (key === 'show-element') {
      const tabs = await getAllTabs()
      tabs.forEach(async(tab) => {
        const data: any = { status: newValue }
        if (newValue) {
          const source = await getSource(tab.id as number)
          if (!source)
            return
          data.source = source
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

    const source = await getSource(tab[0].id as number)
    if (!source)
      return
    log(source)
    sendMessage('copy-source', { source }, { context: 'content-script', tabId: tab[0].id as number })
  }
})

async function getSource(tabId: number) {
  return await sendMessage('get-source', {}, { context: 'content-script', tabId })
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
