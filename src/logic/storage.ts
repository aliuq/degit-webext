import { useStorageLocal } from '~/composables/useStorageLocal'

const serializer = {
  read: (raw: any) => raw,
  write: (raw: any) => raw,
}

export const showElement = useStorageLocal('show-element', true, { serializer })
export const enableShortcut = useStorageLocal('enable-shortcut', false, { serializer })
export const shortcut = useStorageLocal('shortcut', 'Alt+Shift+C')
