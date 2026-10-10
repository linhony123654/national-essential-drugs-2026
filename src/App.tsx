import { Routes, Route, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Drugs from '@/pages/Drugs'
import Insights from '@/pages/Insights'
import Guide from '@/pages/Guide'
import { DrugsProvider } from '@/lib/data'
import { ThemeProvider } from '@/lib/theme'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function PageTransition({ children }: { children: ReactNode }) {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route index element={<PageTransition><Home /></PageTransition>} />
          <Route path="drugs" element={<PageTransition><Drugs /></PageTransition>} />
          <Route path="insights" element={<PageTransition><Insights /></PageTransition>} />
          <Route path="guide" element={<PageTransition><Guide /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <DrugsProvider>
        <AnimatedRoutes />
      </DrugsProvider>
    </ThemeProvider>
  )
}
