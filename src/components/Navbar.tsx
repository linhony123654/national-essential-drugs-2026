import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import SearchDialog from '@/components/SearchDialog'
import { cn } from '@/lib/utils'

export const NAV_LINKS = [
  { to: '/', label: '首页' },
  { to: '/drugs', label: '药品检索' },
  { to: '/insights', label: '数据洞察' },
  { to: '/guide', label: '目录说明' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 h-16 transition-all duration-300',
          scrolled ? 'border-b border-line bg-bg/70 backdrop-blur-[16px]' : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2.5 text-brand">
            <img src="/logo.svg" alt="" className="h-7 w-7" />
            <span className="font-serif text-[17px] font-bold text-ink">国家基本药物目录</span>
            <span className="mt-[-6px] font-mono text-[10px] text-gold">2026年版</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className="group relative py-1 text-sm text-ink-2 transition-colors hover:text-brand">
                {({ isActive }) => (
                  <>
                    <span className={cn(isActive && 'text-ink')}>{l.label}</span>
                    {isActive && (
                      <motion.span layoutId="nav-underline" className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-brand" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="全站搜索"
              className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-ink-2 transition-colors hover:border-brand hover:text-brand sm:flex"
            >
              <Search size={14} />
              <span className="font-mono">⌘K</span>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="全站搜索"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-colors hover:text-brand sm:hidden"
            >
              <Search size={18} />
            </button>
            <button
              onClick={(e) => toggle(e)}
              aria-label="切换主题"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-colors hover:text-brand"
            >
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </motion.span>
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="打开菜单"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink md:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[90] flex flex-col bg-bg/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex h-16 items-center justify-between px-4">
              <span className="font-serif font-bold text-ink">国家基本药物目录</span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="关闭菜单"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col items-start justify-center gap-6 px-8">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to={l.to} className="font-serif text-4xl font-bold text-ink transition-colors hover:text-brand">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
