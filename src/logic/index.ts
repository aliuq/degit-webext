export * from './storage'

export function log(msg: string | object) {
  if (typeof msg === 'object')
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(msg, null, 2))
  else
    // eslint-disable-next-line no-console
    console.log(`[degit-webext] ${msg}`)
}
