import { ref, readonly } from 'vue'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading'
export type ToastPosition = 'top-center' | 'bottom-center'
export type ToastMode = 'attached' | 'floating'
export type ToastAnimation = 'fluid' | 'gooey' | 'smooth' | 'subtle' | 'snappy'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastOptions {
  id?: string
  duration?: number
  dismissible?: boolean
  action?: ToastAction
}

export interface ToastState {
  id: string
  title: string
  type: ToastType
  duration: number
  dismissible: boolean
  action?: ToastAction
  /** Bumps on every show/update so the renderer can re-animate content. */
  revision: number
}

export interface ToastPromiseOptions extends Omit<ToastOptions, 'id'> {
  /**
   * Duration (ms) for the resolved success toast. Default: 3600.
   * Pass 0 to keep it open until manually dismissed.
   */
  successDuration?: number
  /**
   * Duration (ms) for the rejected error toast. Default: 0 (persistent).
   */
  errorDuration?: number
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_DURATIONS: Record<ToastType, number> = {
  default: 3600,
  success: 3600,
  info: 3600,
  warning: 0,
  error: 0,
  loading: 0,
}

const DEFAULT_DISMISSIBLE: Record<ToastType, boolean> = {
  default: false,
  success: false,
  info: false,
  warning: true,
  error: true,
  loading: true,
}

// ─── Singleton store ───────────────────────────────────────────────────────────
// Module-level reactive state — one active toast at a time, latest wins.

const activeToast = ref<ToastState | null>(null)
let revisionSeed = 0
let dismissTimer: ReturnType<typeof setTimeout> | null = null

function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

function clearTimer(): void {
  if (dismissTimer !== null) {
    clearTimeout(dismissTimer)
    dismissTimer = null
  }
}

function scheduleClose(id: string, duration: number): void {
  clearTimer()
  if (duration > 0) {
    dismissTimer = setTimeout(() => {
      if (activeToast.value?.id === id) {
        activeToast.value = null
      }
    }, duration)
  }
}

// ─── Core API ─────────────────────────────────────────────────────────────────

function show(title: string, type: ToastType, options: ToastOptions = {}): string {
  const id = options.id ?? uid()
  const duration = options.duration ?? DEFAULT_DURATIONS[type]
  const dismissible = options.dismissible ?? DEFAULT_DISMISSIBLE[type]

  activeToast.value = { id, title, type, duration, dismissible, action: options.action, revision: revisionSeed++ }
  scheduleClose(id, duration)
  return id
}

function update(id: string, updates: Partial<Omit<ToastState, 'id' | 'revision'>>): void {
  if (activeToast.value?.id !== id) return
  const next = { ...activeToast.value, ...updates, revision: revisionSeed++ }
  activeToast.value = next
  scheduleClose(id, next.duration)
}

function dismiss(id?: string): void {
  if (!id || activeToast.value?.id === id) {
    clearTimer()
    activeToast.value = null
  }
}

async function promise<T>(
  p: Promise<T>,
  messages: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((err: unknown) => string)
  },
  options?: ToastPromiseOptions,
): Promise<T> {
  const { successDuration = 3600, errorDuration = 0, ...baseOptions } = options ?? {}
  const id = show(messages.loading, 'loading', { ...baseOptions, duration: 0, dismissible: false })
  try {
    const data = await p
    const title = typeof messages.success === 'function' ? messages.success(data) : messages.success
    // Success: auto-dismiss after successDuration; dismissible only if persistent
    update(id, { title, type: 'success', duration: successDuration, dismissible: successDuration === 0 })
    return data
  } catch (err) {
    const title = typeof messages.error === 'function' ? messages.error(err) : messages.error
    // Error: persistent by default (errorDuration=0), always dismissible
    update(id, { title, type: 'error', duration: errorDuration, dismissible: true })
    throw err
  }
}

// ─── Public toast object ───────────────────────────────────────────────────────

export const toast = {
  show: (title: string, opts?: ToastOptions) => show(title, 'default', opts),
  success: (title: string, opts?: ToastOptions) => show(title, 'success', opts),
  error: (title: string, opts?: ToastOptions) => show(title, 'error', opts),
  warning: (title: string, opts?: ToastOptions) => show(title, 'warning', opts),
  info: (title: string, opts?: ToastOptions) => show(title, 'info', opts),
  loading: (title: string, opts?: ToastOptions) => show(title, 'loading', opts),
  update,
  dismiss,
  promise,
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useNotchToast() {
  return {
    activeToast: readonly(activeToast),
    toast,
  }
}
