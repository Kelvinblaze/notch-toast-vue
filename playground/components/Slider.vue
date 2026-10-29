<script setup lang="ts">
const model = defineModel<number>({ required: true })
const props = withDefaults(defineProps<{ label: string; min?: number; max?: number; step?: number }>(), {
  min: 0,
  max: 10,
  step: 0.5,
})

const el = ref<HTMLElement | null>(null)
const pct = computed(() => ((model.value - props.min) / (props.max - props.min)) * 100)

function setFromEvent(e: PointerEvent) {
  const rect = el.value!.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
  const raw = props.min + ratio * (props.max - props.min)
  model.value = Math.round(raw / props.step) * props.step
}

function onDown(e: PointerEvent) {
  el.value!.setPointerCapture(e.pointerId)
  setFromEvent(e)
}
function onMove(e: PointerEvent) {
  if (el.value?.hasPointerCapture(e.pointerId)) setFromEvent(e)
}
function onKey(e: KeyboardEvent) {
  const dir = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0
  if (!dir) return
  e.preventDefault()
  model.value = Math.min(props.max, Math.max(props.min, model.value + dir * props.step))
}
</script>

<template>
  <div
    ref="el"
    class="slider"
    role="slider"
    tabindex="0"
    :aria-label="label"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="model"
    @pointerdown="onDown"
    @pointermove="onMove"
    @keydown="onKey"
  >
    <div class="slider-fill" :style="{ width: `${pct}%` }" />
    <div class="slider-ticks" aria-hidden="true"><i v-for="n in 6" :key="n" /></div>
    <span class="slider-label">{{ label }}</span>
    <span class="slider-value">{{ model.toFixed(1) }}</span>
  </div>
</template>
