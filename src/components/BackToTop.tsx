import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLenis } from '@/components/Layout'

export default function BackToTop() {
  const [show, setShow] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          onClick={() => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' }))}
          aria-label="回到顶部"
          className="fixed bottom-8 right-8 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg-elev text-ink shadow-lg transition-colors hover:border-brand hover:text-brand"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
