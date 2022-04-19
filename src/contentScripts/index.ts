/* eslint-disable no-console */
import { onMessage } from 'webext-bridge'
import { createApp } from 'vue'
import { useClipboard } from '@vueuse/core'
import Github from './views/Github.vue'
import { log } from '~/logic'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  log('Setup from content script')

  onMessage('modify-pages-changed', ({ data }) => {
    log(`Modify pages changed: [${data.source}]`)
    renderCopyEl(data.source)
  })

  onMessage('update-element', ({ data }) => {
    log('Update element')
    log(data)
    if (data.status)
      renderCopyEl(data.source as string)
    else
      removeCopyEl()
  })

  onMessage('copy-source', ({ data }) => {
    if (!data.source)
      return
    const { copy } = useClipboard({ source: data.source })
    copy()
  })
})()

function renderCopyEl(source: string) {
  try {
    // Github: Find last element by class name `d-none`
    const container = Array.prototype.slice.call(
      document.querySelectorAll('.file-navigation .d-none'),
      -1,
    )[0]
    if (!container)
      return
    const parent = container.parentNode
    const el = parent?.querySelector('.webext-degit')
    el && el.remove()
    const root = document.createElement('div')
    root.classList.add('webext-degit')
    root.classList.add(container.classList.contains('btn') ? 'mr-2' : 'ml-2')
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
