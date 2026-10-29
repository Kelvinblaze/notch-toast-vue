<script setup lang="ts">
const b = useBuilder()

const positions = [
  { value: 'top-center', label: 'Top Center' },
  { value: 'bottom-center', label: 'Bottom Center' },
] as const
const modes = [
  { value: 'attached', label: 'Attached' },
  { value: 'floating', label: 'Floating' },
] as const
const animations = ['fluid', 'gooey', 'smooth', 'subtle', 'snappy'] as const

// ─── Examples ─────────────────────────────────────────────────────────────────

const types = ['default', 'success', 'error', 'warning', 'info'] as const
const samples: Record<(typeof types)[number], string> = {
  default: 'New transaction received',
  success: 'Payment of ₦50,000 sent',
  error: 'Transaction declined',
  warning: 'Session expires in 5 minutes',
  info: 'Your report is ready',
}

function fire(type: (typeof types)[number]) {
  if (type === 'default') toast.show(samples.default)
  else toast[type](samples[type])
}

const fakeApi = (ok: boolean) =>
  new Promise<string>((res, rej) =>
    setTimeout(() => (ok ? res('Profile updated') : rej(new Error('Server error'))), 2000),
  )

async function runPromise(ok: boolean) {
  try {
    await toast.promise(fakeApi(ok), {
      loading: 'Saving changes...',
      success: (m) => m,
      error: (e) => (e instanceof Error ? e.message : 'Something went wrong'),
    })
  } catch {
    // toast.promise rethrows after showing the error toast
  }
}

function latestWins() {
  toast.show('First toast')
  setTimeout(() => toast.info('Second toast replaces it'), 500)
  setTimeout(() => toast.success('Latest toast wins'), 1100)
}

// ─── Builder ──────────────────────────────────────────────────────────────────

function preview() {
  toast.success(b.value.title || 'Toast rendered successfully', {
    duration: b.value.duration * 1000,
    dismissible: b.value.dismissible,
  })
}

let timer: ReturnType<typeof setTimeout> | undefined
watch(
  b,
  () => {
    clearTimeout(timer)
    timer = setTimeout(preview, 350)
  },
  { deep: true },
)
onBeforeUnmount(() => clearTimeout(timer))

const generated = computed(() => {
  const s = b.value
  const title = s.title.replace(/"/g, '\\"')
  return [
    '<NotchToaster',
    `  position="${s.position}"`,
    `  mode="${s.mode}"`,
    `  animation="${s.animation}"`,
    '/>',
    '',
    `toast.success("${title}", {`,
    `  duration: ${s.duration * 1000},`,
    `  dismissible: ${s.dismissible},`,
    '})',
  ].join('\n')
})
</script>

<template>
  <section id="playground" class="demo">
    <div class="demo-examples">
      <div class="demo-head">
        <h2>Examples</h2>
        <span class="muted small">Click to preview</span>
      </div>

      <h3 class="eyebrow">Toast types</h3>
      <div class="chips">
        <button v-for="t in types" :key="t" class="chip" @click="fire(t)">{{ t }}</button>
      </div>

      <h3 class="eyebrow">Promise (morph animation)</h3>
      <div class="chips">
        <button class="chip" @click="runPromise(true)">Promise + Success (pill)</button>
        <button class="chip" @click="runPromise(false)">Promise + Error (pill)</button>
      </div>

      <h3 class="eyebrow">Behavior checks</h3>
      <div class="chips">
        <button class="chip" @click="latestWins">Latest toast wins</button>
      </div>
      <div class="chips">
        <button class="chip" @click="toast.dismiss()">Reset toast</button>
      </div>

      <p class="note">
        Promise examples morph from a loader into their final state. Every toast dismisses after the selected duration.
      </p>
    </div>

    <div class="demo-builder">
      <div class="demo-head"><h2>Builder</h2></div>
      <div class="panel">
        <h3 class="eyebrow first">Position</h3>
        <div class="seg">
          <button v-for="o in positions" :key="o.value" :class="{ on: b.position === o.value }" @click="b.position = o.value">{{ o.label }}</button>
        </div>

        <h3 class="eyebrow">Display mode</h3>
        <div class="seg">
          <button v-for="o in modes" :key="o.value" :class="{ on: b.mode === o.value }" @click="b.mode = o.value">{{ o.label }}</button>
        </div>

        <h3 class="eyebrow">Animation preset</h3>
        <div class="seg">
          <button v-for="a in animations" :key="a" :class="{ on: b.animation === a }" @click="b.animation = a">{{ a[0].toUpperCase() + a.slice(1) }}</button>
        </div>
        <p class="hint">Fluid is the default. Gooey is intentionally expressive; smooth, subtle, and snappy refine the same motion system.</p>

        <h3 class="eyebrow">Title</h3>
        <input v-model="b.title" class="field" type="text" aria-label="Toast title" />

        <Slider v-model="b.duration" label="Display duration" class="gap" />

        <h3 class="eyebrow">Close button</h3>
        <div class="seg">
          <button :class="{ on: !b.dismissible }" @click="b.dismissible = false">Hidden</button>
          <button :class="{ on: b.dismissible }" @click="b.dismissible = true">Visible</button>
        </div>
        <p class="hint">Let people dismiss this toast with the cross button or the Escape key.</p>

        <CodeBlock :code="generated" lang="vue" title="Generated code" class="gap" />
        <button class="btn btn-light preview-btn" @click="preview">Preview toast</button>
      </div>
    </div>
  </section>
</template>
