import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CountUpProps {
  value: number
  duration?: number
  delay?: number
  className?: string
}

/** GSAP-driven number counter that starts when scrolled into view. */
export default function CountUp({ value, duration = 1.6, delay = 0, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      el.textContent = String(value)
      return
    }
    const obj = { v: 0 }
    const tween = gsap.to(obj, {
      v: value,
      duration,
      delay,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => {
        el.textContent = String(Math.round(obj.v))
      },
    })
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => tween.play(),
    })
    return () => {
      st.kill()
      tween.kill()
    }
  }, [value, duration, delay])

  return (
    <span ref={ref} className={className}>
      0
    </span>
  )
}
