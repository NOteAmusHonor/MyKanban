import { onMounted, onBeforeUnmount, ref, type Ref } from 'vue'

/**
 * Toggles `isInView` based on IntersectionObserver visibility of the given element ref.
 * Defaults: threshold 0.4, root = viewport.
 */
export function useInView(targetRef: Ref<HTMLElement | null>, threshold = 0.4) {
  const isInView = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!targetRef.value || typeof IntersectionObserver === 'undefined') return
    observer = new IntersectionObserver(
      ([entry]) => {
        isInView.value = entry.isIntersecting && entry.intersectionRatio >= threshold * 0.9
      },
      { threshold: [0, threshold, 1] },
    )
    observer.observe(targetRef.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })

  return isInView
}
