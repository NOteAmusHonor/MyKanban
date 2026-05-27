/**
 * In-View Reveal preset for motion-v.
 * Returns props that can be spread on a <Motion> component.
 *
 * Usage:
 *   <Motion v-bind="reveal({ delay: 0.2 })" tag="h2">…</Motion>
 */
export interface InViewRevealOptions {
  distance?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  duration?: number
  delay?: number
  amount?: number
}

export function reveal(options: InViewRevealOptions = {}) {
  const {
    distance = 28,
    direction = 'up',
    duration = 0.8,
    delay = 0,
    amount = 0.2,
  } = options

  const hidden: Record<string, number | string> = { opacity: 0 }
  const visible: Record<string, number | string> = { opacity: 1 }

  if (direction === 'up') {
    hidden.y = distance
    visible.y = 0
  } else if (direction === 'down') {
    hidden.y = -distance
    visible.y = 0
  } else if (direction === 'left') {
    hidden.x = distance
    visible.x = 0
  } else if (direction === 'right') {
    hidden.x = -distance
    visible.x = 0
  }

  return {
    initial: hidden,
    whileInView: visible,
    inViewOptions: { once: true, amount },
    transition: { duration, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }
}
