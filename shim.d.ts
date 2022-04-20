import type { ProtocolWithReturn } from 'webext-bridge'

declare module 'webext-bridge' {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    'tab-prev': { title: string | undefined }
    'get-current-tab': ProtocolWithReturn<{ tabId: number }, { title?: string }>
    'modify-pages-changed': { source: string; host: string }
    'update-element': { status: boolean; source?: string; host?: string }
    'copy-source': { source: string }
  }
}

export interface BuildCliOptions {
  /**
   * Target platform
   */
  target: ['chromium' | 'firefox']
  /**
   * Production mode
   */
  prod: boolean
  /**
   * Extension name
   * @default `target` value
   */
  name?: string[] | undefined
}
