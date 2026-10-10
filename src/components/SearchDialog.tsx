import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useDrugs } from '@/lib/data'

interface Hit {
  kind: 'chem' | 'tcm'
  no: string
  name: string
  sub: string
  cat: string
}

export default function SearchDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { data } = useDrugs()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
      window.setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const hits = useMemo<Hit[]>(() => {
    if (!data || !q.trim()) return []
    const needle = q.trim().toLowerCase()
    const match = (s: string | undefined) => s?.toLowerCase().includes(needle)
    const chem = data.chem
      .filter((d) => match(d.name) || match(d.en) || match(d.cat) || match(d.sub))
      .slice(0, 8)
      .map((d) => ({ kind: 'chem' as const, no: d.no, name: d.name, sub: d.en, cat: d.cat }))
    const tcm = data.tcm
      .filter((d) => match(d.name) || match(d.gn) || match(d.cat) || match(d.sub))
      .slice(0, 8)
      .map((d) => ({ kind: 'tcm' as const, no: d.no, name: d.name, sub: d.gn, cat: d.cat }))
    return [...chem, ...tcm]
  }, [data, q])

  const go = (hit: Hit) => {
    navigate(`/drugs?tab=${hit.kind}&q=${encodeURIComponent(hit.name)}`)
    onClose()
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, hits.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && hits[active]) {
      go(hits[active])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const chemHits = hits.filter((h) => h.kind === 'chem')
  const tcmHits = hits.filter((h) => h.kind === 'tcm')

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/30 px-4 pt-[15vh] backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-bg-elev shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={18} className="text-ink-2" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setActive(0)
                }}
                onKeyDown={onKey}
                placeholder="搜索药品名称 / 英文名 / 分类…"
                className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-ink-2"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-2">ESC</kbd>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {q.trim() === '' && (
                <p className="px-3 py-6 text-center text-sm text-ink-2">输入关键词，在 816 条目录记录中即时检索</p>
              )}
              {q.trim() !== '' && hits.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-ink-2">未找到匹配品种</p>
              )}
              {[
                { label: '化学药品和生物制品', list: chemHits, color: 'text-chem' },
                { label: '中成药', list: tcmHits, color: 'text-tcm' },
              ].map(
                (g) =>
                  g.list.length > 0 && (
                    <div key={g.label}>
                      <p className={`px-3 pb-1 pt-3 font-mono text-[11px] uppercase tracking-widest ${g.color}`}>
                        {g.label}
                      </p>
                      {g.list.map((h) => {
                        const idx = hits.indexOf(h)
                        return (
                          <button
                            key={`${h.kind}-${h.no}-${h.name}`}
                            onMouseEnter={() => setActive(idx)}
                            onClick={() => go(h)}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                              idx === active ? 'bg-bg text-brand' : 'text-ink'
                            }`}
                          >
                            <span>
                              <span className="mr-2 font-mono text-xs text-ink-2">{h.no}</span>
                              {h.name}
                            </span>
                            <span className="ml-4 max-w-[45%] truncate font-mono text-xs text-ink-2">{h.sub}</span>
                          </button>
                        )
                      })}
                    </div>
                  ),
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
