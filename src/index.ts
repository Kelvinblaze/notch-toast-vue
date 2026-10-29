import type { App } from 'vue'
import NotchToaster from './components/NotchToaster.vue'

export { toast, useNotchToast } from './composables/useNotchToast'
export { NotchToaster }
export type {
  ToastType,
  ToastPosition,
  ToastMode,
  ToastAnimation,
  ToastAction,
  ToastOptions,
  ToastPromiseOptions,
  ToastState,
} from './composables/useNotchToast'

export const NotchToastPlugin = {
  install(app: App) {
    app.component('NotchToaster', NotchToaster)
  },
}

export default NotchToastPlugin
