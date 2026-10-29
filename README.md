<div align="center">
  <img src="https://raw.githubusercontent.com/Kelvinblaze/notch-toast-vue/main/playground/public/favicon.svg" alt="notch-toast-vue logo" width="96" height="96" />

# notch-toast-vue

A Vue 3 and Nuxt toast library that turns notifications into a polished, morphing notch or floating surface.

[![npm](https://img.shields.io/npm/v/notch-toast-vue?style=for-the-badge&color=black)](https://www.npmjs.com/package/notch-toast-vue)
[![GitHub Stars](https://img.shields.io/github/stars/Kelvinblaze/notch-toast-vue?style=for-the-badge&logo=github&color=yellow)](https://github.com/Kelvinblaze/notch-toast-vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)
[![Based on notch-toast](https://img.shields.io/badge/Based_on-notch--toast-black?style=for-the-badge)](https://github.com/Devsethi3/notch-toast)

<br />

<img src="https://raw.githubusercontent.com/Kelvinblaze/notch-toast-vue/main/playground/public/og-image.png" alt="notch-toast-vue notification preview" width="750" />

</div>

## Overview

notch-toast-vue is a lightweight, client-side notification system for Vue 3 and Nuxt. It renders one focused toast at a time, morphs updates in place, and supports a notch attached to the viewport edge or a floating notification surface.

It is a Vue/Nuxt port of [notch-toast](https://github.com/Devsethi3/notch-toast) by [Dev Sethi](https://devsethi.site). The design, styling and motion come from that project; this package reimplements them for Vue with [`motion-v`](https://motion.dev/docs/vue).

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
- Works as a Vue 3 plugin or a Nuxt 3/4 module

## Requirements

- Vue `^3.4` (Vue 3.4 or newer)
- Nuxt 3 or Nuxt 4 (optional)
- Peer dependencies: [`motion-v`](https://motion.dev/docs/vue) (spring animations) and [`@vueuse/core`](https://vueuse.org)

## Install

```bash
npm install notch-toast-vue motion-v @vueuse/core
```

## Vue 3 usage

Import the stylesheet once, and register the plugin (or import the component where you use it):

```ts
// main.ts
import { createApp } from 'vue'
import NotchToastPlugin from 'notch-toast-vue'
import 'notch-toast-vue/style.css'
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

Then call `toast` from anywhere on the client:

```ts
import { toast } from 'notch-toast-vue'

toast.success('Payment sent')
```

Without the plugin, import the component directly: `import { NotchToaster } from 'notch-toast-vue'`.

## Nuxt usage (Nuxt 3 and 4)

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['motion-v/nuxt', 'notch-toast-vue/nuxt'],
})
```

Mount the toaster in your default layout (or `app.vue`). Toasts are client-side only, so wrap it in `ClientOnly`:

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

`NotchToaster`, `useNotchToast`, and `toast` are auto-imported — no manual imports or stylesheet import needed.

> Toasts only work in the browser. Call `toast` from event handlers, `onMounted`, or client-only code, not during server rendering.

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

## Accessibility

Status messages are announced through live regions without moving focus. Errors use an assertive announcement; other toast types use polite announcements. Dismissible toasts can be closed with their close button or the Escape key, except while focus is inside an editable control. With `prefers-reduced-motion`, movement is replaced by a brief fade.

## Development

```bash
git clone https://github.com/Kelvinblaze/notch-toast-vue.git
cd notch-toast-vue
npm install
npm run dev     # run the Nuxt playground / landing page
npm run build   # build the library into dist/
```

Issues and pull requests are welcome on [GitHub](https://github.com/Kelvinblaze/notch-toast-vue/issues).

## Credits

notch-toast-vue exists because of [notch-toast](https://github.com/Devsethi3/notch-toast), created and maintained by [Dev Sethi](https://devsethi.site) ([X](https://x.com/imsethidev)) and released under the MIT license. The notch shape, visual design, motion presets and API shape are theirs; this is an independent Vue/Nuxt port by [Kelvin Ossai](https://github.com/Kelvinblaze).

## License

Distributed under the [MIT License](./LICENSE). Copyright © 2026 Kelvin Ossai and notch-toast contributors.
