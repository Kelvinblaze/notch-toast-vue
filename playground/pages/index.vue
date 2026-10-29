<script setup lang="ts">
const b = useBuilder()

// ─── Theme ────────────────────────────────────────────────────────────────────

const theme = useState<'dark' | 'light'>('nt-theme', () => 'dark')
onMounted(() => {
  try {
    const saved = localStorage.getItem('nt-theme')
    if (saved === 'light' || saved === 'dark') theme.value = saved
  } catch {}
})
watchEffect(() => {
  if (import.meta.client) document.documentElement.dataset.theme = theme.value
})
useHead({ htmlAttrs: { 'data-theme': 'dark' } })
function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  try { localStorage.setItem('nt-theme', theme.value) } catch {}
}

// ─── Install ──────────────────────────────────────────────────────────────────

const managers = [
  { id: 'npm', cmd: 'npm i notch-toast-vue motion-v @vueuse/core' },
  { id: 'pnpm', cmd: 'pnpm add notch-toast-vue motion-v @vueuse/core' },
  { id: 'yarn', cmd: 'yarn add notch-toast-vue motion-v @vueuse/core' },
  { id: 'bun', cmd: 'bun add notch-toast-vue motion-v @vueuse/core' },
] as const
const pm = ref<(typeof managers)[number]['id']>('npm')
const installCmd = computed(() => managers.find((m) => m.id === pm.value)!.cmd)

const agentMd = `# notch-toast-vue

Mount <NotchToaster /> once in the app root, then call toast from anywhere (client-side only).

- Install: npm i notch-toast-vue motion-v @vueuse/core
- Vue: import { NotchToaster, toast } from 'notch-toast-vue'; import 'notch-toast-vue/style.css'
- Nuxt: modules: ['motion-v/nuxt', 'notch-toast-vue/nuxt'] (component and toast are auto-imported)
- API: toast.show/success/error/warning/info/loading(title, { id, duration, dismissible, action })
- toast.promise(promise, { loading, success, error }) morphs one toast through its states
- toast.update(id, patch), toast.dismiss(id?)
- Props: position (top-center | bottom-center), mode (attached | floating), animation (fluid | gooey | smooth | subtle | snappy)
- One toast at a time: the latest toast wins. Errors, warnings and loading are persistent by default.`

async function copyAgent() {
  try {
    await navigator.clipboard.writeText(agentMd)
    toast.success('agent.md copied', { duration: 1800 })
  } catch {
    toast.error('Could not copy')
  }
}

// ─── Docs content ─────────────────────────────────────────────────────────────

const vueInstall = `npm i notch-toast-vue motion-v @vueuse/core`
const vueMount = `import { createApp } from 'vue'
import { NotchToaster } from 'notch-toast-vue'
import 'notch-toast-vue/style.css'

// App.vue template
<NotchToaster position="top-center" mode="attached" animation="fluid" />`
const vueUse = `import { toast } from 'notch-toast-vue'

toast.success('Payment of ₦50,000 sent')
toast.error('Transaction declined', { dismissible: true })`

const nuxtConfig = `export default defineNuxtConfig({
  modules: ['motion-v/nuxt', 'notch-toast-vue/nuxt'],
})`
const nuxtMount = `// app.vue or layouts/default.vue — the component and toast are auto-imported
<ClientOnly>
  <NotchToaster position="top-center" mode="attached" animation="fluid" />
</ClientOnly>

// anywhere on the client
toast.success('Saved')`

const promiseCode = `await toast.promise(saveProfile(), {
  loading: 'Saving changes...',
  success: (data) => 'Profile updated',
  error: (err) => err instanceof Error ? err.message : 'Something went wrong',
})`
const updateCode = `const id = toast.loading('Processing KYC verification...')

// later — the same toast morphs in place
toast.update(id, { title: 'Identity verified', type: 'success', duration: 3600 })`
const actionCode = `toast.error('Payment failed — card declined', {
  dismissible: true,
  action: { label: 'Retry', onClick: () => retry() },
})`

const props = [
  ['position', "'top-center' | 'bottom-center'", "'top-center'", 'Which screen edge the toast anchors to.'],
  ['mode', "'attached' | 'floating'", "'attached'", 'Attached grows out of the edge as a notch. Floating is a standalone pill.'],
  ['animation', "'fluid' | 'gooey' | 'smooth' | 'subtle' | 'snappy'", "'fluid'", 'Motion preset for the shell and content morph.'],
]
const methods = [
  ['toast.show(title, opts?)', 'Default toast. Closes after 3.6s.'],
  ['toast.success(title, opts?)', 'Success toast. Closes after 3.6s.'],
  ['toast.info(title, opts?)', 'Info toast. Closes after 3.6s.'],
  ['toast.warning(title, opts?)', 'Warning toast. Persistent and dismissible.'],
  ['toast.error(title, opts?)', 'Error toast. Persistent, dismissible and announced assertively.'],
  ['toast.loading(title, opts?)', 'Loading toast with a spinner. Persistent until updated or dismissed.'],
  ['toast.promise(promise, msgs, opts?)', 'Shows loading, then morphs to success or error. Returns (and rethrows) the promise.'],
  ['toast.update(id, patch)', 'Patch the active toast in place. Ignored if that toast is no longer active.'],
  ['toast.dismiss(id?)', 'Dismiss the active toast, optionally only if it matches id.'],
]
const options = [
  ['id', 'string', 'Stable id, useful with toast.update and toast.dismiss.'],
  ['duration', 'number', 'Milliseconds before auto-dismiss. 0 keeps it open.'],
  ['dismissible', 'boolean', 'Shows the close button and enables Escape to dismiss.'],
  ['action', '{ label: string; onClick: () => void }', 'Inline action button.'],
]

const year = new Date().getFullYear()
</script>

<template>
  <div class="page">
    <div class="dots dots-hero" aria-hidden="true" />

    <header class="nav">
      <a class="brand" href="#top">
        <svg class="logo" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3 2.5 8 12 13l9.5-5L12 3Z" /><path d="m2.5 12.2 9.5 5 9.5-5v2.3l-9.5 5-9.5-5v-2.3Z" opacity=".55" /></svg>
        notch-toast-vue
      </a>
      <nav class="nav-actions" aria-label="Primary">
        <button type="button" class="btn btn-agent" @click="copyAgent">
          agent.md
          <svg class="ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.8" /><path d="M10.5 3.5v-.2A1.8 1.8 0 0 0 8.7 1.5H3.8a1.8 1.8 0 0 0-1.8 1.8v4.9a1.8 1.8 0 0 0 1.8 1.8h.2" /></svg>
        </button>
        <button type="button" class="btn btn-icon" :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`" @click="toggleTheme">
          <svg class="ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="8" cy="8" r="6" /><path d="M8 2a6 6 0 0 1 0 12V2Z" fill="currentColor" /></svg>
        </button>
        <a class="btn btn-ghost hide-sm" href="#docs">Documentation</a>
        <a class="btn btn-light" href="https://github.com/Kelvinblaze/notch-toast-vue" target="_blank" rel="noopener">GitHub</a>
      </nav>
    </header>

    <main id="top">
      <section class="hero">
        <span class="pill"><i class="live" /> v0.1.0</span>
        <h1>Notifications that morph beautifully</h1>
        <p class="lead">A notch-style toast system for Vue 3 and Nuxt with smooth morphing, promise states, and edge-attached or floating placement</p>

        <CodeBlock :code="installCmd" lang="sh" title="" class="hero-install">
          <template #actions>
            <div class="tabs" role="tablist" aria-label="Package manager">
              <button v-for="m in managers" :key="m.id" role="tab" :aria-selected="pm === m.id" :class="{ on: pm === m.id }" @click="pm = m.id">{{ m.id }}</button>
            </div>
          </template>
        </CodeBlock>

        <div class="cta">
          <a class="btn btn-agent btn-lg" href="#install">Get started</a>
          <a class="btn btn-light btn-lg" href="#docs">Read the docs</a>
        </div>
      </section>

      <div class="dots dots-band" aria-hidden="true" />
      <ToastBuilder />

      <section id="install" class="docs">
        <article class="doc">
          <span class="num">01</span>
          <h2>Vue 3</h2>
          <p>Install the package with its two peer dependencies, import the stylesheet once, and mount a single toaster near the root of your app.</p>
          <CodeBlock :code="vueInstall" lang="sh" />
          <CodeBlock :code="vueMount" lang="vue" title="App.vue" />
          <p>Call <code>toast</code> from anywhere on the client. There is no provider or injection to set up.</p>
          <CodeBlock :code="vueUse" lang="ts" />
        </article>

        <article class="doc">
          <span class="num">02</span>
          <h2>Nuxt</h2>
          <p>Add the module alongside <code>motion-v/nuxt</code>. <code>NotchToaster</code>, <code>toast</code> and <code>useNotchToast</code> are auto-imported. Mount the toaster inside <code>ClientOnly</code> since toasts are client-side only.</p>
          <CodeBlock :code="nuxtConfig" lang="ts" title="nuxt.config.ts" />
          <CodeBlock :code="nuxtMount" lang="vue" title="app.vue" />
        </article>

        <article id="docs" class="doc">
          <span class="num">03</span>
          <h2>Documentation</h2>
          <p>One toast is visible at a time and the latest call wins. Updates to the active toast morph in place instead of stacking.</p>

          <h3>NotchToaster props</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr v-for="r in props" :key="r[0]"><td><code>{{ r[0] }}</code></td><td><code>{{ r[1] }}</code></td><td><code>{{ r[2] }}</code></td><td>{{ r[3] }}</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Toast methods</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Method</th><th>Description</th></tr></thead>
              <tbody>
                <tr v-for="r in methods" :key="r[0]"><td><code>{{ r[0] }}</code></td><td>{{ r[1] }}</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Options</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Option</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr v-for="r in options" :key="r[0]"><td><code>{{ r[0] }}</code></td><td><code>{{ r[1] }}</code></td><td>{{ r[2] }}</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Promises</h3>
          <p>Pass a promise and three messages. The toast shows a spinner, then morphs into success or error. The promise is returned and rethrown on failure, so you can still handle it.</p>
          <CodeBlock :code="promiseCode" lang="ts" />

          <h3>Updating in place</h3>
          <p>Keep the id returned by any toast method and patch it later. The shell resizes and the text slides to the new title.</p>
          <CodeBlock :code="updateCode" lang="ts" />

          <h3>Actions</h3>
          <CodeBlock :code="actionCode" lang="ts" />

          <h3>Accessibility</h3>
          <p>Toasts use <code>role="status"</code> with polite announcements; errors use <code>role="alert"</code> and are announced assertively. Dismissible toasts close with <kbd>Esc</kbd> unless focus is in an input. With <code>prefers-reduced-motion</code>, movement is replaced by a short fade.</p>
        </article>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-top">
        <a class="brand" href="#top">
          <svg class="logo" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3 2.5 8 12 13l9.5-5L12 3Z" /><path d="m2.5 12.2 9.5 5 9.5-5v2.3l-9.5 5-9.5-5v-2.3Z" opacity=".55" /></svg>
          notch-toast-vue
        </a>
        <a class="icon-btn" href="https://github.com/Kelvinblaze/notch-toast-vue" target="_blank" rel="noopener" aria-label="GitHub">
          <svg class="ico lg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>
        </a>
      </div>
      <nav class="footer-links" aria-label="Footer">
        <a href="#playground">Playground</a>
        <a href="#docs">Docs</a>
        <a href="https://github.com/Kelvinblaze/notch-toast-vue" target="_blank" rel="noopener">Source</a>
      </nav>
      <div class="footer-bottom">
        <span>© {{ year }} notch-toast-vue</span>
        <span>A Vue port of <a href="https://github.com/Devsethi3/notch-toast" target="_blank" rel="noopener">notch-toast</a></span>
      </div>
    </footer>

    <ClientOnly>
      <NotchToaster :position="b.position" :mode="b.mode" :animation="b.animation" />
    </ClientOnly>
  </div>
</template>
