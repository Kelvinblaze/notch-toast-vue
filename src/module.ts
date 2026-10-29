import { defineNuxtModule, addComponent, addImports, createResolver } from '@nuxt/kit'

export interface ModuleOptions {
  /** Injects $toast into the Nuxt app via a client-only plugin */
  injectPlugin?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'notch-toast-vue',
    configKey: 'notchToast',
    compatibility: { nuxt: '>=3.0.0' },
  },
  defaults: {
    injectPlugin: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Auto-import <NotchToaster /> component
    addComponent({
      name: 'NotchToaster',
      filePath: resolver.resolve('./components/NotchToaster.vue'),
      mode: 'client',
    })

    // Auto-import composable and toast API
    addImports([
      {
        name: 'useNotchToast',
        as: 'useNotchToast',
        from: resolver.resolve('./composables/useNotchToast'),
      },
      {
        name: 'toast',
        as: 'toast',
        from: resolver.resolve('./composables/useNotchToast'),
      },
    ])
  },
})
