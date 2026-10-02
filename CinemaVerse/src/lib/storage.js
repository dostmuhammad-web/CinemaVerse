/**
 * localStorage helpers that never throw — private-mode browsers and disabled
 * storage fall back to an in-memory map for the session.
 */

const memory = new Map()
const PREFIX = 'cinemaverse:'

function backend() {
  try {
    const probe = `${PREFIX}__probe`
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return window.localStorage
  } catch {
    return null
  }
}

export const isPersistent = () => backend() !== null

export function readValue(key, fallback) {
  try {
    const store = backend()
    const raw = store ? store.getItem(PREFIX + key) : memory.get(PREFIX + key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeValue(key, value) {
  try {
    const serialised = JSON.stringify(value)
    const store = backend()
    if (store) store.setItem(PREFIX + key, serialised)
    else memory.set(PREFIX + key, serialised)
    return true
  } catch {
    return false
  }
}

export function removeValue(key) {
  try {
    const store = backend()
    if (store) store.removeItem(PREFIX + key)
    else memory.delete(PREFIX + key)
  } catch {
    /* nothing useful to do */
  }
}

export function clearAll() {
  try {
    const store = backend()
    if (store) {
      Object.keys(store)
        .filter((key) => key.startsWith(PREFIX))
        .forEach((key) => store.removeItem(key))
    }
    memory.clear()
  } catch {
    /* nothing useful to do */
  }
}