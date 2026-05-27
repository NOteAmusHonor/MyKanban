import { onMounted, onBeforeUnmount, ref } from 'vue'

/**
 * Reactive boolean that mirrors `prefers-reduced-motion: reduce`.
 * Updates if the user toggles the OS setting at runtime.
 */
export function useReducedMotion() {
  const reduced = ref(false)
  let media: MediaQueryList | null = null

  const onChange = (e: MediaQueryListEvent) => {
    reduced.value = e.matches
  }

  onMounted(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = media.matches
    media.addEventListener('change', onChange)
  })

  onBeforeUnmount(() => {
    media?.removeEventListener('change', onChange)
  })

  return reduced
}
