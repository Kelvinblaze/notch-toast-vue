<script setup lang="ts">
import { Motion } from 'motion-v'
import type { ToastType } from '../composables/useNotchToast'

defineProps<{ type: ToastType; reduceMotion: boolean }>()

const EASE = [0.16, 1, 0.3, 1] as const
</script>

<template>
  <span v-if="type !== 'default'" aria-hidden="true" class="nt-icon" :class="`nt-icon-${type}`">
    <span v-if="type === 'loading'" class="nt-spinner" :class="{ 'nt-spinner-static': reduceMotion }" />

    <!-- success -->
    <Motion
      v-else-if="type === 'success'"
      as="svg"
      viewBox="0 0 16 16"
      fill="none"
      class="nt-check"
      stroke="currentColor"
      stroke-width="2.15"
      :style="{ y: 0.4 }"
      :initial="reduceMotion ? false : { scale: 0.86, rotate: -4 }"
      :animate="reduceMotion ? { scale: 1, rotate: 0 } : { scale: [0.86, 1.075, 0.985, 1], rotate: [-4, 1.8, -0.6, 0] }"
      :transition="reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.14, ease: EASE }"
    >
      <Motion
        as="path"
        d="m3.45 8.15 2.75 2.7 6.35-6.2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :initial="reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }"
        :animate="{ pathLength: 1, opacity: 1 }"
        :transition="reduceMotion ? { duration: 0 } : { duration: 0.46, delay: 0.16, ease: EASE }"
      />
    </Motion>

    <!-- error -->
    <Motion
      v-else-if="type === 'error'"
      as="svg"
      viewBox="0 0 16 16"
      fill="none"
      class="nt-check"
      stroke="currentColor"
      stroke-width="2.25"
      :style="{ y: 0.2 }"
      :initial="reduceMotion ? false : { scale: 0.86, rotate: -3 }"
      :animate="reduceMotion ? { scale: 1, rotate: 0 } : { scale: [0.86, 1.065, 0.985, 1], rotate: [-3, 1.8, -0.5, 0] }"
      :transition="reduceMotion ? { duration: 0 } : { duration: 0.46, delay: 0.14, ease: EASE }"
    >
      <Motion
        as="path"
        d="M3.7 3.7 12.3 12.3"
        stroke-linecap="round"
        :initial="reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }"
        :animate="{ pathLength: 1, opacity: 1 }"
        :transition="reduceMotion ? { duration: 0 } : { duration: 0.34, delay: 0.16, ease: EASE }"
      />
      <Motion
        as="path"
        d="M12.3 3.7 3.7 12.3"
        stroke-linecap="round"
        :initial="reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }"
        :animate="{ pathLength: 1, opacity: 1 }"
        :transition="reduceMotion ? { duration: 0 } : { duration: 0.34, delay: 0.26, ease: EASE }"
      />
    </Motion>

    <!-- warning -->
    <Motion
      v-else-if="type === 'warning'"
      as="svg"
      viewBox="0 0 24 24"
      fill="none"
      class="nt-alert-icon"
      :initial="reduceMotion ? false : { scale: 0.88, rotate: -2 }"
      :animate="reduceMotion ? { scale: 1, rotate: 0 } : { scale: [0.88, 1.055, 0.99, 1], rotate: [-2, 1, -0.3, 0] }"
      :transition="reduceMotion ? { duration: 0 } : { duration: 0.42, delay: 0.12, ease: EASE }"
    >
      <path
        fill="currentColor"
        d="M10.06 2.15a2.24 2.24 0 0 1 3.88 0l8.7 15.07a2.24 2.24 0 0 1-1.94 3.36H3.3a2.24 2.24 0 0 1-1.94-3.36l8.7-15.07Z"
      />
      <Motion
        as="path"
        d="M12 8.2v4.65"
        stroke="var(--foreground,#171717)"
        stroke-width="2.35"
        stroke-linecap="round"
        :initial="reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }"
        :animate="{ pathLength: 1, opacity: 1 }"
        :transition="reduceMotion ? { duration: 0 } : { duration: 0.3, delay: 0.2, ease: EASE }"
      />
      <Motion
        as="circle"
        cx="12"
        cy="16.55"
        r="1.35"
        fill="var(--foreground,#171717)"
        :initial="reduceMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }"
        :animate="{ scale: 1, opacity: 1 }"
        :transition="reduceMotion ? { duration: 0 } : { duration: 0.2, delay: 0.42, ease: EASE }"
      />
    </Motion>

    <!-- info -->
    <Motion
      v-else-if="type === 'info'"
      as="svg"
      viewBox="0 0 24 24"
      fill="none"
      class="nt-alert-icon"
      :initial="reduceMotion ? false : { scale: 0.88, rotate: -2 }"
      :animate="reduceMotion ? { scale: 1, rotate: 0 } : { scale: [0.88, 1.055, 0.99, 1], rotate: [-2, 1, -0.3, 0] }"
      :transition="reduceMotion ? { duration: 0 } : { duration: 0.42, delay: 0.12, ease: EASE }"
    >
      <circle cx="12" cy="12" r="11.25" fill="currentColor" />
      <Motion
        as="path"
        d="M12 7.55v5"
        stroke="var(--foreground,#171717)"
        stroke-width="2.45"
        stroke-linecap="round"
        :initial="reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }"
        :animate="{ pathLength: 1, opacity: 1 }"
        :transition="reduceMotion ? { duration: 0 } : { duration: 0.3, delay: 0.2, ease: EASE }"
      />
      <Motion
        as="circle"
        cx="12"
        cy="16.65"
        r="1.35"
        fill="var(--foreground,#171717)"
        :initial="reduceMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }"
        :animate="{ scale: 1, opacity: 1 }"
        :transition="reduceMotion ? { duration: 0 } : { duration: 0.2, delay: 0.42, ease: EASE }"
      />
    </Motion>
  </span>
</template>
