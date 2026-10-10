import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { LayoutGrid, RotateCcw, Search, Table2, X } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import CountUp from '@/components/CountUp'
import { useDrugs } from '@/lib/data'
import { cn } from '@/lib/utils'
import type { DrugRow, DrugTab } from './drugs/utils'
import { buildRows, catLabel, matchesQuery } from './drugs/utils'
import Results, { PAGE_SIZE, useInfiniteScroll } from './drugs/Results'
import DetailDrawer from './drugs/DetailDrawer'

function useDebounced<T>(value: T, delay: number): T {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return v
}

function useMediaQuery(q: string) {
  const [m, setM] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(q).matches : false))
  useEffect(() => {
    const mm = window.matchMedia(q)
    const on = () => setM(mm.matches)
    on()
    mm.addEventListener('change', on)
    return () => mm.removeEventListener('change', on)
  }, [q])
  return m
}

function DoseRuler() {
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  const top = useTransform(smooth, [0, 1], ['4%', '96%'])
  return (
    <div aria-hidden className="pointer-events-none fixed bottom-8 right-3 top-24 z-10 hidden w-5 xl:block">
      <div className="relative h-full w-full">
        {Array.from({ length: 41 }).map((_, i) => (
          <span
            key={i}
            className={cn('absolute right-0 h-px bg-line', i % 5 === 0 ? 'w-4' : 'w-2')}
            style={{ top: `${(i / 40) * 100}%` }}
          />
        ))}
        <motion.span
          className="absolute right-0 h-4 w-[3px] -translate-y-1/2 rounded-full bg-brand"
          style={{ top }}
        />
      </div>
    </div>
  )
}

const selectCls =
  'h-9 max-w-[170px] cursor-pointer rounded-lg border border-line bg-bg-elev px-2.5 text-xs text-ink outline-none transition-colors hover:border-brand focus:border-brand'

export default function Drugs() {
  const { data, loading } = useDrugs()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialTab: DrugTab = searchParams.get('tab') === 'tcm' ? 'tcm' : 'chem'
  const [tab, setTab] = useState<DrugTab>(initialTab)
  const [q, setQ] = useState(searchParams.get('q') ?? '')
  const query = useDebounced(q, 200)
  const [cat, setCat] = useState('')
  const [sub, setSub] = useState('')
  const [triOnly, setTriOnly] = useState(false)
  const [shown, setShown] = useState(PAGE_SIZE)
  const [selected, setSelected] = useState<DrugRow | null>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [viewOverride, setViewOverride] = useState<'table' | 'card' | null>(null)
  const view = viewOverride ?? (isDesktop ? 'table' : 'card')
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // sync tab + query to URL (⌘K 搜索带参数跳入)
  useEffect(() => {
    const next = new URLSearchParams()
    if (tab === 'tcm') next.set('tab', 'tcm')
    if (query) next.set('q', query)
    setSearchParams(next, { replace: true })
  }, [tab, query, setSearchParams])

  const rows = useMemo(() => (data ? buildRows(data, tab) : []), [data, tab])

  const cats = useMemo(() => {
    const m = new Map<string, number>()
    rows.forEach((r) => m.set(r.cat, (m.get(r.cat) ?? 0) + 1))
    return [...m.entries()].map(([name, count]) => ({ name, count }))
  }, [rows])

  const subs = useMemo(() => {
    const m = new Map<string, number>()
    rows.filter((r) => !cat || r.cat === cat).forEach((r) => {
      if (r.sub) m.set(r.sub, (m.get(r.sub) ?? 0) + 1)
    })
    return [...m.entries()].map(([name, count]) => ({ name, count }))
  }, [rows, cat])

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          matchesQuery(r, query) &&
          (!cat || r.cat === cat) &&
          (!sub || r.sub === sub) &&
          (!triOnly || r.triangle),
      ),
    [rows, query, cat, sub, triOnly],
  )

  useEffect(() => setShown(PAGE_SIZE), [tab, query, cat, sub, triOnly])
  useInfiniteScroll(sentinelRef, shown < filtered.length, () =>
    setShown((s) => Math.min(s + PAGE_SIZE, filtered.length)),
  )

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [selected])

  const hasFilters = !!(query || cat || sub || triOnly)
  const reset = () => {
    setQ('')
    setCat('')
    setSub('')
    setTriOnly(false)
  }

  const chips: Array<{ key: string; label: string; onClear: () => void }> = []
  if (query) chips.push({ key: 'q', label: `搜索：${query}`, onClear: () => setQ('') })
  if (cat) chips.push({ key: 'cat', label: `大类：${catLabel(cat)}`, onClear: () => { setCat(''); setSub('') } })
  if (sub) chips.push({ key: 'sub', label: `亚类：${sub}`, onClear: () => setSub('') })
  if (triOnly) chips.push({ key: 'tri', label: '△ 特殊管理', onClear: () => setTriOnly(false) })

  const tabStats = data
    ? { chem: data.chem.length, tcm: data.tcm.length }
    : { chem: 0, tcm: 0 }

  return (
    <div className="mx-auto max-w-[1360px] px-4 pb-24 md:px-6">
      <DoseRuler />

      {/* 页面头 */}
      <div className="flex flex-wrap items-end justify-between gap-6 pb-8 pt-12 md:pt-16">
        <div className="overflow-hidden">
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)', y: 24 }}
            animate={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeader no="02" title="药品检索" sub="DRUG INDEX" />
          </motion.div>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-2">
            收录化学药品和生物制品 {data?.meta.chemCount ?? 497} 条目录记录、中成药 {data?.meta.tcmCount ?? 318} 条，
            支持全文检索与多维筛选。
          </p>
        </div>
        <div className="font-mono text-xs text-ink-2 tabular">
          当前显示{' '}
          <span className="text-base font-semibold text-brand">
            <CountUp value={filtered.length} />
          </span>{' '}
          / {rows.length} 条
        </div>
      </div>

      {/* 检索控制台 */}
      <div className="sticky top-16 z-40 -mx-4 border-b border-line bg-bg/80 px-4 py-3 backdrop-blur-[16px] md:-mx-6 md:px-6">
        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="relative min-w-[220px] flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-2" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索药品名称 / 英文名 / 类别…"
              className="h-11 w-full rounded-full border border-line bg-bg-elev pl-10 pr-9 text-sm text-ink outline-none transition-colors placeholder:text-ink-2/60 focus:border-brand"
            />
            {q && (
              <button
                onClick={() => setQ('')}
                aria-label="清空搜索"
                className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-line hover:text-ink"
              >
                <X size={14} />
              </button>
            )}
          </motion.div>

          {/* Tab 切换 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="flex rounded-full border border-line bg-bg-elev p-1">
            {(['chem', 'tcm'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t)
                  setCat('')
                  setSub('')
                }}
                className={cn(
                  'relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors sm:px-4',
                  tab === t ? 'text-white' : 'text-ink-2 hover:text-ink',
                )}
              >
                {tab === t && (
                  <motion.span
                    layoutId="drug-tab-slider"
                    className={cn('absolute inset-0 rounded-full', t === 'chem' ? 'bg-chem' : 'bg-tcm')}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {t === 'chem' ? `化学药品和生物制品 ${tabStats.chem}` : `中成药 ${tabStats.tcm}`}
                </span>
              </button>
            ))}
          </motion.div>

          {/* 筛选 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="flex flex-wrap items-center gap-2">
            <select value={cat} onChange={(e) => { setCat(e.target.value); setSub('') }} className={selectCls} aria-label="大类筛选">
              <option value="">全部大类</option>
              {cats.map((c) => (
                <option key={c.name} value={c.name}>
                  {catLabel(c.name)}（{c.count}）
                </option>
              ))}
            </select>
            <select value={sub} onChange={(e) => setSub(e.target.value)} className={selectCls} aria-label="亚类筛选" disabled={!cat && subs.length === 0}>
              <option value="">全部亚类</option>
              {subs.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}（{s.count}）
                </option>
              ))}
            </select>
            <button
              onClick={() => setTriOnly((v) => !v)}
              aria-pressed={triOnly}
              className={cn(
                'flex h-9 items-center gap-2 rounded-lg border px-3 text-xs transition-colors',
                triOnly ? 'border-danger bg-danger/10 text-danger' : 'border-line bg-bg-elev text-ink-2 hover:border-danger/50 hover:text-danger',
              )}
            >
              <span className={cn('relative h-4 w-7 rounded-full transition-colors', triOnly ? 'bg-danger' : 'bg-line')}>
                <span
                  className={cn(
                    'absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all',
                    triOnly ? 'left-3.5' : 'left-0.5',
                  )}
                />
              </span>
              △ 特殊管理
            </button>
            {hasFilters && (
              <button
                onClick={reset}
                className="flex h-9 items-center gap-1 px-2 text-xs text-ink-2 transition-colors hover:text-brand"
              >
                <RotateCcw size={12} /> 重置
              </button>
            )}
          </motion.div>

          {/* 视图切换 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="ml-auto flex rounded-lg border border-line bg-bg-elev p-1">
            {(
              [
                { v: 'table', icon: Table2, label: '表格视图' },
                { v: 'card', icon: LayoutGrid, label: '卡片视图' },
              ] as const
            ).map(({ v, icon: Icon, label }) => (
              <button
                key={v}
                onClick={() => setViewOverride(v)}
                aria-label={label}
                className={cn(
                  'flex h-7 w-8 items-center justify-center rounded-md transition-colors',
                  view === v ? 'bg-brand text-white' : 'text-ink-2 hover:text-ink',
                )}
              >
                <Icon size={15} />
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* 激活筛选 chips */}
        <AnimatePresence initial={false}>
          {chips.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-2 overflow-hidden pt-2"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {chips.map((c) => (
                  <motion.button
                    layout
                    key={c.key}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={c.onClear}
                    className="flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs text-brand transition-colors hover:bg-brand/20"
                  >
                    {c.label} <X size={11} />
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 结果区 */}
      <div className="pt-6">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg border border-line bg-bg-elev" />
            ))}
          </div>
        ) : (
          <>
            <Results
              rows={filtered}
              shown={shown}
              total={filtered.length}
              query={query}
              view={view}
              sentinelRef={sentinelRef}
              onOpen={setSelected}
            />
            {filtered.length === 0 && hasFilters && (
              <div className="mt-4 text-center">
                <button
                  onClick={reset}
                  className="rounded-full border border-brand px-5 py-2 text-sm text-brand transition-all hover:scale-[1.02] hover:bg-brand hover:text-white"
                >
                  清除筛选条件
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <DetailDrawer
        row={selected}
        onClose={() => setSelected(null)}
        onViewCategory={(c) => {
          setCat(c)
          setSub('')
          setSelected(null)
        }}
      />
    </div>
  )
}
