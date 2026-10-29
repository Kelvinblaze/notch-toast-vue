# notch-toast-vue

A polished notch/floating toast notification library for Vue 3 and Nuxt 3. A Vue/Nuxt port of [notch-toast](https://github.com/Devsethi3/notch-toast) by [Devsethi3](https://github.com/Devsethi3); the design, styling and motion come from that project.

## Features

- 6 toast types: `default`, `success`, `error`, `warning`, `info`, `loading`
- Attached notch and floating display modes
- Top-center and bottom-center placement
- 5 animation presets: `fluid`, `gooey`, `smooth`, `subtle`, `snappy`
- In-place morphing updates (no queue — latest wins)
- Promise lifecycle: `toast.promise()`
- Optional action button + dismiss control
- Accessible live-region announcements + Escape-key dismissal
- Reduced-motion support
- TypeScript-first
- Works as a Vue 3 plugin or Nuxt 3 module

## Install

```bash
npm install notch-toast-vue
```

## Vue 3 usage

```ts
// main.ts
import { createApp } from 'vue'
import NotchToastPlugin from 'notch-toast-vue'
import App from './App.vue'

createApp(App).use(NotchToastPlugin).mount('#app')
```

Mount the toaster once in your root component:

```vue
<template>
  <NotchToaster position="top-center" mode="attached" animation="fluid" />
  <RouterView />
</template>
```

## Nuxt 3 usage

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['notch-toast-vue/nuxt'],
})
```

Mount the toaster in your default layout:

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <slot />
    <ClientOnly>
      <NotchToaster position="top-center" mode="attached" animation="fluid" />
    </ClientOnly>
  </div>
</template>
```

`NotchToaster`, `useNotchToast`, and `toast` are auto-imported — no manual imports needed.

## API

### Basic toasts

```ts
toast.show('Message')
toast.success('Payment sent')
toast.error('Card declined', { dismissible: true })
toast.warning('Session expires soon')
toast.info('2FA enabled')
toast.loading('Uploading...')
```

### `toast.update(id, updates)`

Morph the active toast in-place. Has no effect if the toast with that `id` is no longer active.

```ts
const id = toast.loading('Processing KYC...')
toast.update(id, { title: 'Identity verified', type: 'success', duration: 3600 })
```

### `toast.dismiss(id?)`

Dismiss a specific toast by id, or the active toast if `id` is omitted.

```ts
toast.dismiss()       // dismiss whatever is showing
toast.dismiss(myId)   // only dismiss if it's still active
```

### `toast.promise(promise, messages, options?)`

Manages the full loading → success/error lifecycle.

```ts
await toast.promise(
  saveProfile(),
  {
    loading: 'Saving changes...',
    success: (data) => `Saved: ${data.name}`,
    error: (err) => err instanceof Error ? err.message : 'Something went wrong',
  },
  {
    successDuration: 3600,  // ms before success toast dismisses (default: 3600)
    errorDuration: 0,       // ms before error toast dismisses (default: 0 = persistent)
    action: { label: 'Undo', onClick: undoSave },
  }
)
```

## Options reference

### `ToastOptions`

| Option        | Type                          | Default                          | Description                                       |
|---------------|-------------------------------|----------------------------------|---------------------------------------------------|
| `id`          | `string`                      | auto-generated                   | Custom id; replaces any existing toast with same id |
| `duration`    | `number`                      | type-dependent (see below)       | Auto-dismiss delay in ms. `0` = persistent        |
| `dismissible` | `boolean`                     | type-dependent (see below)       | Show the × dismiss button                         |
| `action`      | `{ label: string; onClick }` | —                                | Optional action button                            |

**Default durations:**

| Type      | `duration` | `dismissible` |
|-----------|-----------|---------------|
| `default` | 3600 ms   | false         |
| `success` | 3600 ms   | false         |
| `info`    | 3600 ms   | false         |
| `warning` | 0 (persistent) | true     |
| `error`   | 0 (persistent) | true     |
| `loading` | 0 (persistent) | true     |

### `ToastPromiseOptions`

Extends `ToastOptions` (minus `id`) with:

| Option            | Type     | Default | Description                                  |
|-------------------|----------|---------|----------------------------------------------|
| `successDuration` | `number` | 3600    | Auto-dismiss delay after promise resolves     |
| `errorDuration`   | `number` | 0       | Auto-dismiss delay after promise rejects      |

## `<NotchToaster>` props

| Prop        | Values                                                  | Default       |
|-------------|---------------------------------------------------------|---------------|
| `position`  | `top-center` \| `bottom-center`                         | `top-center`  |
| `mode`      | `attached` \| `floating`                                | `attached`    |
| `animation` | `fluid` \| `gooey` \| `smooth` \| `subtle` \| `snappy` | `fluid`       |

## Composable

```ts
import { useNotchToast } from 'notch-toast-vue'

const { activeToast, toast } = useNotchToast()
// activeToast is a readonly Ref<ToastState | null>
```

## License

MIT

## Credits

Based on [notch-toast](https://github.com/Devsethi3/notch-toast) by Devsethi3 (MIT). Ported to Vue and Nuxt by Kelvin Ossai.

## License

MIT
