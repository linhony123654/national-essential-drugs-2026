import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{ theme: Theme; toggle: (e?: MouseEvent) => void }>({
  theme: 'light',
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = useCallback(
    (e?: MouseEvent) => {
      const next: Theme = theme === 'light' ? 'dark' : 'light'
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced || !e) {
        setTheme(next)
        return
      }
      // circular ripple transition from click point
      const ripple = document.createElement('div')
      ripple.className = 'theme-ripple'
      const size = Math.hypot(window.innerWidth, window.innerHeight) * 2
      ripple.style.left = `${e.clientX}px`
      ripple.style.top = `${e.clientY}px`
      ripple.style.width = `${size}px`
      ripple.style.height = `${size}px`
      ripple.style.background = next === 'dark' ? '#0C1210' : '#F7F5F0'
      ripple.style.transform = 'translate(-50%, -50%) scale(0)'
      ripple.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
      document.body.appendChild(ripple)
      requestAnimationFrame(() => {
        ripple.style.transform = 'translate(-50%, -50%) scale(1)'
      })
      window.setTimeout(() => {
        setTheme(next)
        window.setTimeout(() => {
          ripple.style.transition = 'opacity 0.4s ease'
          ripple.style.opacity = '0'
          window.setTimeout(() => ripple.remove(), 450)
        }, 60)
      }, 350)
    },
    [theme],
  )

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
