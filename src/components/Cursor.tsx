import { memo, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Desktop-only custom cursor: 12px dot + 36px ring that follows with lag.
 * The ring enlarges to 56px and turns accent over interactive elements.
 */
function CursorInner() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 250, damping: 25 })
  const ringY = useSpring(y, { stiffness: 250, damping: 25 })
  const scale = useMotionValue(1)
  const ringScale = useSpring(scale, { stiffness: 300, damping: 22 })
  const ringColor = useMotionValue('var(--ink-2)')

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    document.body.classList.add('cursor-none-desktop')
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target as HTMLElement
      const interactive = !!t.closest('a, button, [role="button"], input, [data-cursor]')
      scale.set(interactive ? 56 / 36 : 1)
      ringColor.set(interactive ? 'var(--accent)' : 'var(--ink-2)')
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => {
      window.removeEventListener('mousemove', move)
      document.body.classList.remove('cursor-none-desktop')
    }
  }, [x, y, scale, ringColor])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-3 w-3 rounded-full bg-brand"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full border"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%', scale: ringScale, borderColor: ringColor }}
      />
    </>
  )
}

const Cursor = memo(CursorInner)
export default Cursor
