import { createContext, useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import Cursor from '@/components/Cursor'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisContext)

export default function Layout() {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.1 })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return (
    <LenisContext.Provider value={lenis}>
      <div className="flex min-h-[100dvh] flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-brand focus:px-3 focus:py-2 focus:text-white"
        >
          跳到主要内容
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <BackToTop />
        <Cursor />
      </div>
    </LenisContext.Provider>
  )
}
