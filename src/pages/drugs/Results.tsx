import { useEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { DrugRow } from './utils'
import { catLabel, Highlight } from './utils'
import Tag from '@/components/Tag'
import { cn } from '@/lib/utils'

export const PAGE_SIZE = 50

interface ResultsProps {
  rows: DrugRow[]
  shown: number
  total: number
  query: string
  view: 'table' | 'card'
  sentinelRef: RefObject<HTMLDivElement | null>
  onOpen: (row: DrugRow) => void
}

function NameWithMarks({ row, query }: { row: DrugRow; query: string }) {
  return (
    <span className="font-medium text-ink">
      <Highlight text={row.name} query={query} />
      {row.triangle && <sup className="ml-0.5 font-mono text-[11px] text-danger">△</sup>}
      {row.star && <sup className="ml-0.5 font-mono text-[11px] text-gold">*</sup>}
    </span>
  )
}

function RowMotion({ children, index, k }: { children: React.ReactNode; index: number; k: string }) {
  return (
    <motion.tr
      key={k}
      layout="position"
      initial={{ opacity: 0, scale: 0.98, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
      transition={{ duration: 0.35, delay: Math.min(index, 11) * 0.02, ease: [0.22, 1, 0.36, 1] }}
      className="group relative cursor-pointer border-b border-line transition-colors last:border-b-0 hover:bg-bg"
    >
      {children}
    </motion.tr>
  )
}

function DrugTable({ rows, query, onOpen }: { rows: DrugRow[]; query: string; onOpen: (r: DrugRow) => void }) {
  const isChem = rows[0]?.tab !== 'tcm'
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-bg-elev">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-line font-mono text-[11px] uppercase tracking-wider text-ink-2">
            <th className="w-16 px-4 py-3 font-medium">序号</th>
            <th className="px-3 py-3 font-medium">药品名称</th>
            <th className="hidden px-3 py-3 font-medium md:table-cell">{isChem ? '英文名' : '功能分类'}</th>
            <th className="hidden px-3 py-3 font-medium lg:table-cell">剂型规格</th>
            <th className="hidden px-3 py-3 font-medium xl:table-cell">分类</th>
            <th className="w-16 px-3 py-3 font-medium">标记</th>
            <th className="w-20 px-4 py-3 text-right font-medium">操作</th>
          </tr>
        </thead>
        <motion.tbody layout>
          <AnimatePresence mode="popLayout" initial={false}>
            {rows.map((row, i) => (
              <RowMotion key={row.key} k={row.key} index={i}>
                <td
                  className="relative px-4 py-3 font-mono text-xs text-ink-2 tabular"
                  onClick={() => onOpen(row)}
                >
                  <span className="absolute bottom-2 left-0 top-2 w-0.5 origin-bottom scale-y-0 bg-brand transition-transform duration-200 group-hover:scale-y-100" />
                  {row.star ? `*（${row.no}）` : row.no.padStart(3, '0') + '.'}
                </td>
                <td className="px-3 py-3 text-[15px]" onClick={() => onOpen(row)}>
                  <NameWithMarks row={row} query={query} />
                </td>
                <td className="hidden px-3 py-3 font-mono text-xs text-ink-2 md:table-cell" onClick={() => onOpen(row)}>
                  {isChem ? <Highlight text={row.en} query={query} /> : <Highlight text={row.gn} query={query} />}
                </td>
                <td className="hidden max-w-[220px] truncate px-3 py-3 text-xs text-ink-2 lg:table-cell" onClick={() => onOpen(row)} title={row.spec}>
                  {row.spec || '—'}
                </td>
                <td className="hidden px-3 py-3 text-xs text-ink-2 xl:table-cell" onClick={() => onOpen(row)}>
                  {catLabel(row.cat)}
                  {row.sub && <span className="text-ink-2/60"> › {row.sub}</span>}
                </td>
                <td className="px-3 py-3" onClick={() => onOpen(row)}>
                  <span className="flex gap-1">
                    {row.triangle && <Tag kind="triangle" className="!px-1.5" />}
                    {row.star && <Tag kind="star" className="!px-1.5" />}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onOpen(row)}
                    className="inline-flex items-center gap-1 text-xs text-brand transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    详情 <ArrowRight size={12} />
                  </button>
                </td>
              </RowMotion>
            ))}
          </AnimatePresence>
        </motion.tbody>
      </table>
    </div>
  )
}

function DrugCards({ rows, query, onOpen }: { rows: DrugRow[]; query: string; onOpen: (r: DrugRow) => void }) {
  return (
    <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout" initial={false}>
        {rows.map((row, i) => (
          <motion.button
            key={row.key}
            layout="position"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, delay: Math.min(i, 11) * 0.02, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onOpen(row)}
            className={cn(
              'group relative overflow-hidden rounded-xl border border-line bg-bg-elev p-5 text-left',
              'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_rgba(20,35,30,0.25)]',
            )}
          >
            <span className="absolute left-0 right-0 top-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100" />
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-xs text-gold tabular">
                {row.star ? `*（${row.no}）` : row.no.padStart(3, '0')}
              </span>
              <span className="flex gap-1">
                {row.triangle && <Tag kind="triangle" className="!px-1.5" />}
                {row.star && <Tag kind="star" className="!px-1.5" />}
              </span>
            </div>
            <h3 className="mt-2 font-serif text-lg font-semibold leading-snug text-ink">
              <NameWithMarks row={row} query={query} />
            </h3>
            <p className="mt-1 font-mono text-xs text-ink-2">
              {row.tab === 'chem' ? <Highlight text={row.en} query={query} /> : <Highlight text={row.gn} query={query} />}
            </p>
            {row.spec && <p className="mt-2 truncate text-xs text-ink-2" title={row.spec}>{row.spec}</p>}
            <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3 text-[11px] text-ink-2">
              <Tag kind={row.tab} label={catLabel(row.cat)} className="!border-line !text-ink-2" />
              {row.sub && <span className="truncate">› {row.sub}</span>}
            </div>
          </motion.button>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Results({ rows, shown, total, query, view, sentinelRef, onOpen }: ResultsProps) {
  const visible = useMemo(() => rows.slice(0, shown), [rows, shown])
  const progress = total > 0 ? Math.min(1, visible.length / total) : 0

  if (total === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-line bg-bg-elev/60 px-6 py-20 text-center"
      >
        <img src="/deco-capsule.svg" alt="" className="h-24 w-auto opacity-50" />
        <p className="font-serif text-xl font-semibold text-ink">未找到匹配的药品</p>
        <p className="text-sm text-ink-2">试试更换关键词，或清除筛选条件后重试。</p>
      </motion.div>
    )
  }

  return (
    <div>
      {view === 'table' ? (
        <DrugTable rows={visible} query={query} onOpen={onOpen} />
      ) : (
        <DrugCards rows={visible} query={query} onOpen={onOpen} />
      )}

      <div className="mt-6 flex items-center gap-4">
        <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full bg-brand"
            animate={{ scaleX: progress }}
            style={{ originX: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <span className="shrink-0 font-mono text-xs text-ink-2 tabular">
          已加载 {visible.length} / {total} 条
        </span>
      </div>
      {visible.length < total && (
        <div ref={sentinelRef} className="mt-4 space-y-2" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg border border-line bg-bg-elev" />
          ))}
        </div>
      )}
    </div>
  )
}

export function useInfiniteScroll(
  sentinelRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  onMore: () => void,
) {
  const cb = useRef(onMore)
  cb.current = onMore
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !enabled) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) cb.current()
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [sentinelRef, enabled])
}
