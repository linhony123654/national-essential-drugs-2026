import { memo, useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  r: number
  color: string
  capsule: boolean
  vx: number
  vy: number
  rot: number
  vr: number
  phase: number
}

const COLORS = ['#0E6B4F', '#C8A24B', '#2D6CDF', '#C0563B']

/** ~60 tiny "medicine dots" (circles & capsules) drifting slowly with mouse parallax. */
function HeroParticlesInner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let raf = 0
    let mx = 0
    let my = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const particles: Particle[] = []

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      w = parent.clientWidth
      h = parent.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 2 + Math.random() * 2,
        color: COLORS[i % COLORS.length],
        capsule: Math.random() < 0.35,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.12,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.004,
        phase: Math.random() * Math.PI * 2,
      })
    }

    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2
      my = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('resize', resize)

    let t = 0
    let smx = 0
    let smy = 0
    const draw = () => {
      t += 0.008
      smx += (mx - smx) * 0.04
      smy += (my - smy) * 0.04
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20
        const px = p.x + smx * 20 + Math.sin(t + p.phase) * 4
        const py = p.y + smy * 20 + Math.cos(t * 0.8 + p.phase) * 4
        ctx.globalAlpha = 0.35 + Math.sin(t * 1.4 + p.phase) * 0.15
        ctx.strokeStyle = p.color
        ctx.fillStyle = p.color
        ctx.lineWidth = 1.2
        if (p.capsule) {
          ctx.save()
          ctx.translate(px, py)
          ctx.rotate(p.rot)
          const L = p.r * 4
          ctx.beginPath()
          ctx.roundRect(-L / 2, -p.r, L, p.r * 2, p.r)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(0, -p.r)
          ctx.lineTo(0, p.r)
          ctx.stroke()
          ctx.restore()
        } else {
          ctx.beginPath()
          ctx.arc(px, py, p.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    // pause when out of viewport
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(raf)
      }
    })
    io.observe(canvas)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}

const HeroParticles = memo(HeroParticlesInner)
export default HeroParticles
