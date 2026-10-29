<script setup lang="ts">
const props = withDefaults(
  defineProps<{ code: string; lang?: 'sh' | 'ts' | 'vue'; title?: string }>(),
  { lang: 'ts' },
)

const label = computed(() => props.title ?? (props.lang === 'sh' ? 'Terminal' : props.lang === 'vue' ? 'Vue' : 'TypeScript'))
const html = computed(() => highlight(props.code, props.lang))
const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    toast.success('Copied to clipboard', { duration: 1800 })
    setTimeout(() => (copied.value = false), 1800)
  } catch {
    toast.error('Could not copy')
  }
}
</script>

<template>
  <div class="code">
    <div class="code-head">
      <span class="code-title">
        <svg v-if="lang === 'sh'" class="ico tint" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2.5 4.5 3.5 3.5-3.5 3.5M8 12h5.5" /></svg>
        <svg v-else class="ico tint-blue" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5.5 4.5-3 3.5 3 3.5M10.5 4.5l3 3.5-3 3.5" /></svg>
        {{ label }}
      </span>
      <slot name="actions" />
      <button type="button" class="icon-btn" :aria-label="copied ? 'Copied' : 'Copy code'" @click="copy">
        <svg v-if="!copied" class="ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="5.5" y="5.5" width="8" height="8" rx="1.8" /><path d="M10.5 3.5v-.2A1.8 1.8 0 0 0 8.7 1.5H3.8a1.8 1.8 0 0 0-1.8 1.8v4.9a1.8 1.8 0 0 0 1.8 1.8h.2" /></svg>
        <svg v-else class="ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3.5 8.5 3 3 6-6.5" /></svg>
      </button>
    </div>
    <pre class="code-body"><code v-html="html" /></pre>
  </div>
</template>
