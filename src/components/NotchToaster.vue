<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { AnimatePresence, Motion } from 'motion-v'
import { useNotchToast, toast as toastApi } from '../composables/useNotchToast'
import type { ToastPosition, ToastMode, ToastAnimation } from '../composables/useNotchToast'
import NotchStatusIcon from './NotchStatusIcon.vue'

const props = withDefaults(
  defineProps<{
    position?: ToastPosition
    mode?: ToastMode
    animation?: ToastAnimation
  }>(),
  { position: 'top-center', mode: 'attached', animation: 'fluid' },
)

const { activeToast } = useNotchToast()

// ─── Reduced motion ───────────────────────────────────────────────────────────

const reduceMotion = ref(false)
let mql: MediaQueryList | null = null
const onMotionChange = () => { reduceMotion.value = !!mql?.matches }

// ─── Keyboard ─────────────────────────────────────────────────────────────────

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  )
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape' || !activeToast.value?.dismissible || isEditableTarget(e.target)) return
  toastApi.dismiss(activeToast.value.id)
}

onMounted(() => {
  mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  onMotionChange()
  mql.addEventListener('change', onMotionChange)
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  mql?.removeEventListener('change', onMotionChange)
  window.removeEventListener('keydown', handleKeydown)
  observer?.disconnect()
})

// ─── Motion presets (ported 1:1 from notch-toast) ─────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const

const PRESETS = {
  fluid:  { type: 'spring', stiffness: 400, damping: 32, mass: 0.62 },
  gooey:  { type: 'spring', stiffness: 280, damping: 18, mass: 0.7 },
  smooth: { duration: 0.38, ease: EASE },
  subtle: { type: 'spring', stiffness: 340, damping: 40, mass: 0.58 },
  snappy: { type: 'spring', stiffness: 520, damping: 34, mass: 0.48 },
} as const

const contentTransition = { duration: 0.42, ease: EASE }
const reducedFade = { duration: 0.18, ease: EASE }

const isBottom = computed(() => props.position === 'bottom-center')
const transition = computed(() => (reduceMotion.value ? reducedFade : PRESETS[props.animation]))
const slotOffset = computed(() => (isBottom.value ? 7 : -7))
const slotOrigin = computed(() =>
  props.mode === 'attached' ? (isBottom.value ? 'bottom center' : 'top center') : 'center',
)

const shellInitial = computed(() =>
  reduceMotion.value
    ? { opacity: 0 }
    : { opacity: 0, y: isBottom.value ? 12 : -12, scale: 0.96, filter: 'blur(8px)' },
)
const shellExit = computed(() =>
  reduceMotion.value
    ? { opacity: 0 }
    : { opacity: 0, y: isBottom.value ? 8 : -8, scale: 0.96, filter: 'blur(6px)' },
)
const shellAnimate = computed(() =>
  reduceMotion.value
    ? { opacity: 1 }
    : {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        width: size.value?.width,
        height: size.value?.height,
      },
)

const contentInitial = computed(() =>
  reduceMotion.value
    ? { opacity: 0 }
    : { opacity: 0, y: slotOffset.value, scale: 0.92, filter: 'blur(5px)' },
)
const contentAnimate = computed(() =>
  reduceMotion.value ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
)
const contentExit = computed(() =>
  reduceMotion.value
    ? { opacity: 0, transition: reducedFade }
    : {
        opacity: 0,
        y: slotOffset.value,
        scale: 0.92,
        filter: 'blur(0px)',
        transition: { duration: 0.1, ease: EASE },
      },
)

const actionInitial = computed(() =>
  reduceMotion.value ? { opacity: 0 } : { opacity: 0, x: 6, filter: 'blur(4px)' },
)
const actionAnimate = computed(() =>
  reduceMotion.value ? { opacity: 1 } : { opacity: 1, x: 0, filter: 'blur(0px)' },
)

// ─── Intrinsic content measurement (shell morphs to this size) ────────────────

const size = ref<{ width: number; height: number } | null>(null)
let contentEl: HTMLElement | null = null
let observer: ResizeObserver | null = null

function measure() {
  if (!contentEl) return
  size.value = { width: contentEl.offsetWidth, height: contentEl.offsetHeight }
}

function setContentRef(instance: unknown) {
  const el = (instance as { $el?: HTMLElement } | null)?.$el ?? null
  if (el === contentEl || !(el instanceof HTMLElement)) return
  contentEl = el
  observer?.disconnect()
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(measure)
    observer.observe(el)
  }
  measure()
}

watch(
  () => activeToast.value?.revision,
  () => nextTick(measure),
)
watch(activeToast, (t) => { if (!t) size.value = null })
</script>

<template>
  <Teleport to="body">
    <div
      class="nt-root"
      :class="[`nt-${position}`, `nt-${mode}`]"
      :data-animation="animation"
    >
      <AnimatePresence :initial="false">
        <Motion
          v-if="activeToast"
          key="shell"
          :role="activeToast.type === 'error' ? 'alert' : 'status'"
          :aria-live="activeToast.type === 'error' ? 'assertive' : 'polite'"
          aria-atomic="true"
          class="nt-shell"
          :initial="shellInitial"
          :animate="shellAnimate"
          :exit="shellExit"
          :transition="transition"
        >
          <div class="nt-viewport">
            <AnimatePresence :initial="false" mode="popLayout">
              <Motion
                :key="activeToast.revision"
                :ref="setContentRef"
                class="nt-content"
                :initial="contentInitial"
                :animate="contentAnimate"
                :exit="contentExit"
                :transition="transition"
                :style="{ transformOrigin: slotOrigin }"
              >
                <NotchStatusIcon :type="activeToast.type" :reduce-motion="reduceMotion" />

                <Motion
                  as="span"
                  :layout="reduceMotion ? false : 'size'"
                  :transition="reduceMotion ? reducedFade : PRESETS.fluid"
                  class="nt-label"
                  :aria-label="activeToast.title"
                >
                  <span aria-hidden="true" class="nt-label-sizer">{{ activeToast.title }}</span>
                  <AnimatePresence :initial="false" mode="popLayout">
                    <Motion
                      as="span"
                      :key="activeToast.title"
                      aria-hidden="true"
                      class="nt-label-slide"
                      :initial="reduceMotion ? { opacity: 0 } : { opacity: 0, y: '100%', filter: 'blur(6px)' }"
                      :animate="reduceMotion ? { opacity: 1 } : { opacity: 1, y: '0%', filter: 'blur(0px)' }"
                      :exit="reduceMotion ? { opacity: 0 } : { opacity: 0, y: '-100%', filter: 'blur(6px)' }"
                      :transition="reduceMotion ? reducedFade : contentTransition"
                    >{{ activeToast.title }}</Motion>
                  </AnimatePresence>
                </Motion>

                <AnimatePresence :initial="false" mode="popLayout">
                  <Motion
                    v-if="activeToast.action"
                    as="button"
                    key="action"
                    type="button"
                    class="nt-action"
                    :initial="actionInitial"
                    :animate="actionAnimate"
                    :exit="actionInitial"
                    :transition="reduceMotion ? reducedFade : contentTransition"
                    @click="activeToast.action!.onClick()"
                  >
                    {{ activeToast.action.label }}
                  </Motion>
                </AnimatePresence>

                <button
                  v-if="activeToast.dismissible"
                  type="button"
                  class="nt-dismiss"
                  aria-label="Dismiss notification"
                  aria-keyshortcuts="Escape"
                  @click="toastApi.dismiss(activeToast.id)"
                >
                  <svg viewBox="0 0 16 16" fill="none" class="nt-close" stroke="currentColor" stroke-width="1.75">
                    <path d="m4 4 8 8M12 4l-8 8" stroke-linecap="round" />
                  </svg>
                </button>
              </Motion>
            </AnimatePresence>
          </div>
        </Motion>
      </AnimatePresence>
    </div>
  </Teleport>
</template>

<style>
.nt-root{pointer-events:none;position:fixed;inset-inline:0;z-index:90;display:flex;justify-content:center;padding-inline:16px}
.nt-top-center{top:0}.nt-bottom-center{bottom:0}
.nt-shell{--nt-notch-radius:16px;pointer-events:auto;position:relative;isolation:isolate;display:flex;width:fit-content;max-width:100%;background:var(--foreground,#171717);color:var(--background,#fff);box-shadow:0 8px 20px color-mix(in srgb,var(--muted-foreground,#737373) 16%,transparent);will-change:width,height,filter,opacity,transform}
.nt-viewport{display:flex;overflow:hidden}
.nt-attached.nt-top-center .nt-shell{border-radius:0 0 var(--nt-notch-radius) var(--nt-notch-radius);transform-origin:top center}
.nt-attached.nt-bottom-center .nt-shell{border-radius:var(--nt-notch-radius) var(--nt-notch-radius) 0 0;transform-origin:bottom center}
.nt-floating{top:16px;bottom:auto}.nt-floating.nt-bottom-center{top:auto;bottom:16px}
.nt-floating .nt-shell{border-radius:20px;transform-origin:center}
.nt-attached .nt-shell:before,.nt-attached .nt-shell:after{content:"";position:absolute;width:var(--nt-notch-radius);height:var(--nt-notch-radius);background:inherit;pointer-events:none;transform:translateZ(0);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%}
.nt-attached.nt-top-center .nt-shell:before{top:0;left:calc(-1 * var(--nt-notch-radius) + .5px);-webkit-mask-image:radial-gradient(circle at 0 100%,transparent calc(var(--nt-notch-radius) - .5px),#000 calc(var(--nt-notch-radius) + .5px));mask-image:radial-gradient(circle at 0 100%,transparent calc(var(--nt-notch-radius) - .5px),#000 calc(var(--nt-notch-radius) + .5px))}
.nt-attached.nt-top-center .nt-shell:after{top:0;right:calc(-1 * var(--nt-notch-radius) + .5px);-webkit-mask-image:radial-gradient(circle at 100% 100%,transparent calc(var(--nt-notch-radius) - .5px),#000 calc(var(--nt-notch-radius) + .5px));mask-image:radial-gradient(circle at 100% 100%,transparent calc(var(--nt-notch-radius) - .5px),#000 calc(var(--nt-notch-radius) + .5px))}
.nt-attached.nt-bottom-center .nt-shell:before{bottom:0;left:calc(-1 * var(--nt-notch-radius) + .5px);-webkit-mask-image:radial-gradient(circle at 0 0,transparent calc(var(--nt-notch-radius) - .5px),#000 calc(var(--nt-notch-radius) + .5px));mask-image:radial-gradient(circle at 0 0,transparent calc(var(--nt-notch-radius) - .5px),#000 calc(var(--nt-notch-radius) + .5px))}
.nt-attached.nt-bottom-center .nt-shell:after{bottom:0;right:calc(-1 * var(--nt-notch-radius) + .5px);-webkit-mask-image:radial-gradient(circle at 100% 0,transparent calc(var(--nt-notch-radius) - .5px),#000 calc(var(--nt-notch-radius) + .5px));mask-image:radial-gradient(circle at 100% 0,transparent calc(var(--nt-notch-radius) - .5px),#000 calc(var(--nt-notch-radius) + .5px))}
.nt-content{display:flex;width:max-content;max-width:calc(100vw - 32px);align-items:center;gap:12px;padding:12px 20px}
.nt-icon{display:grid;width:16px;height:16px;flex:none;place-items:center;border-radius:999px;background:var(--background,#fff);color:var(--foreground,#171717)}
.nt-icon-loading,.nt-icon-warning,.nt-icon-info{background:transparent;color:var(--background,#fff)}
.nt-label{position:relative;display:inline-flex;height:1.25em;overflow:hidden;vertical-align:middle;line-height:1.25;white-space:nowrap;font-size:14px;font-weight:600}
.nt-label-sizer{visibility:hidden}
.nt-label-slide{position:absolute;inset-inline:0;top:0;white-space:nowrap}
.nt-spinner{box-sizing:border-box;display:block;width:14px;height:14px;border:2px solid color-mix(in srgb,currentColor 32%,transparent);border-top-color:currentColor;border-radius:50%;animation:nt-spin .8s linear infinite;will-change:transform}
.nt-spinner-static{animation:none}
@media (prefers-reduced-motion:reduce){.nt-spinner{animation:none}}
@keyframes nt-spin{to{transform:rotate(1turn)}}
.nt-check{width:10px;height:10px}.nt-alert-icon{width:16px;height:16px}
.nt-action,.nt-dismiss{border:0;background:transparent;color:color-mix(in srgb,var(--background,#fff) 76%,transparent);font:inherit;cursor:pointer}
.nt-action{padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600}
.nt-dismiss{display:grid;width:24px;height:24px;place-items:center;border-radius:6px}
.nt-action:hover,.nt-dismiss:hover{background:color-mix(in srgb,var(--background,#fff) 12%,transparent);color:var(--background,#fff)}
.nt-action:focus-visible,.nt-dismiss:focus-visible{outline:2px solid var(--background,#fff);outline-offset:2px}
.nt-close{width:12px;height:12px}
</style>
