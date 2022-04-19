import { isFirefox, isForbiddenUrl } from '~/env'

// // Firefox fetch files from cache instead of reloading changes from disk,
// // hmr will not work as Chromium based browser
// browser.webNavigation.onCommitted.addListener(({ tabId, frameId, url }) => {
//   console.log(23)
//   // Filter out non main window events.
//   if (frameId !== 0)
//     return

//   if (isForbiddenUrl(url))
//     return

//   // inject the latest scripts
//   // browser.tabs.executeScript(tabId, {
//   //   file: `${isFirefox ? '' : '.'}/dist/contentScripts/index.global.js`,
//   //   runAt: 'document_end',
//   // }).catch(error => console.error(error))

//   browser.scripting.executeScript({
//     target: { tabId },
//     files: [`${isFirefox ? '' : '.'}/dist/contentScripts/index.global.js`],
//     // // @ts-expect-error Pending
//     // injectImmediately: true,
//   })
// })

console.log(1)
