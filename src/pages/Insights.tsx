import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import {
  AlertTriangle,
  ArrowDownWideNarrow,
  ArrowRight,
  BarChart3,
  ChevronDown,
  ListOrdered,
  PieChart,
  Pill,
} from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import CountUp from '@/components/CountUp'
import { useDrugs } from '@/lib/data'
import type { CatStat } from '@/lib/data'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** catStats entries are keyed by `name` in drugs.json; fall back to `cat`. */
function statName(s: CatStat): string {
  return (s as unknown as { name?: string }).name ?? ''
}

/* ------------------------------------------------------------------ */
/* Section 1 — total donut                                            */
/* ------------------------------------------------------------------ */

function Donut({ chem, tcm }: { chem: number; tcm: number }) {
  const total = chem + tcm
  const chemFrac = chem / total
  const tcmFrac = tcm / total
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const [hover, setHover] = useState<'chem' | 'tcm' | null>(null)
  const navigate = useNavigate()

  const legends = [
    { key: 'chem' as const, label: '化学药品和生物制品', count: chem, frac: chemFrac, color: 'var(--chem)' },
    { key: 'tcm' as const, label: '中成药', count: tcm, frac: tcmFrac, color: 'var(--tcm)' },
  ]

  return (
    <div ref={ref} className="grid items-center gap-12 md:grid-cols-2">
      {/* donut */}
      <div className="relative mx-auto w-full max-w-[340px]">
        <svg viewBox="0 0 340 340" className="h-auto w-full -rotate-90">
          <circle cx="170" cy="170" r="140" fill="none" stroke="var(--line)" strokeWidth="28" />
          <motion.circle
            cx="170" cy="170" r="140" fill="none"
            stroke="var(--chem)"
            pathLength={1}
            strokeDasharray={`${chemFrac} ${1 - chemFrac}`}
            initial={{ strokeDashoffset: chemFrac }}
            animate={{
              strokeDashoffset: inView ? 0 : chemFrac,
              strokeWidth: hover === 'chem' ? 42 : 36,
              opacity: hover && hover !== 'chem' ? 0.4 : 1,
            }}
            transition={{
              strokeDashoffset: { duration: 1.4, ease: 'easeOut' },
              strokeWidth: { duration: 0.25 },
              opacity: { duration: 0.25 },
            }}
            strokeLinecap="butt"
          />
          <motion.circle
            cx="170" cy="170" r="140" fill="none"
            stroke="var(--tcm)"
            pathLength={1}
            strokeDasharray={`${tcmFrac} ${1 - tcmFrac}`}
            initial={{ strokeDashoffset: tcmFrac }}
            animate={{
              strokeDashoffset: inView ? 0 : tcmFrac,
              strokeWidth: hover === 'tcm' ? 42 : 36,
              opacity: hover && hover !== 'tcm' ? 0.4 : 1,
            }}
            transition={{
              strokeDashoffset: { duration: 1.4, ease: 'easeOut', delay: 0.2 },
              strokeWidth: { duration: 0.25 },
              opacity: { duration: 0.25 },
            }}
            strokeLinecap="butt"
            transform={`rotate(${chemFrac * 360} 170 170)`}
          />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-[64px] font-bold leading-none tabular">
            <CountUp value={total} duration={1.6} />
          </span>
          <span className="mt-2 text-sm text-ink-2">个品种</span>
          <span className="mt-1 px-8 text-center font-mono text-[10px] leading-relaxed text-ink-2">
            不计 * 重复标注条目
          </span>
        </div>
      </div>

      {/* legends */}
      <div className="space-y-4">
        {legends.map((l, i) => (
          <motion.button
            key={l.key}
            type="button"
            onMouseEnter={() => setHover(l.key)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(l.key)}
            onBlur={() => setHover(null)}
            onClick={() => navigate(l.key === 'chem' ? '/drugs?tab=chem' : '/drugs?tab=tcm')}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 + i * 0.15 }}
            className="flex w-full items-center gap-4 rounded-xl border border-line bg-bg-elev p-5 text-left transition-shadow hover:shadow-md"
          >
            <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: l.color }} />
            <span className="flex-1 font-medium">{l.label}</span>
            <span className="font-mono text-xl font-semibold tabular">
              <CountUp value={l.count} duration={1.4} delay={0.3 + i * 0.15} />
            </span>
            <span className="w-16 text-right font-mono text-sm text-ink-2 tabular">
              {(l.frac * 100).toFixed(1)}%
            </span>
          </motion.button>
        ))}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="pt-2 text-xs leading-relaxed text-ink-2"
        >
          另有中药饮片不列具体品种，凡符合国家标准者均属国家基本药物。
        </motion.p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Section 2 — chem 25-category bar chart                             */
/* ------------------------------------------------------------------ */

function ChemBars({ stats }: { stats: CatStat[] }) {
  const [sortByCount, setSortByCount] = useState(false)
  const navigate = useNavigate()
  const max = Math.max(...stats.map((s) => s.count), 1)
  const rows = useMemo(
    () => (sortByCount ? [...stats].sort((a, b) => b.count - a.count) : stats),
    [stats, sortByCount],
  )

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-serif text-xl font-semibold md:text-2xl">
          化学药品和生物制品 · {stats.length} 大类品种分布
        </h3>
        <button
          type="button"
          onClick={() => setSortByCount((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-elev px-4 py-1.5 text-sm text-ink-2 transition-colors hover:border-brand hover:text-brand"
        >
          {sortByCount ? <ListOrdered className="h-4 w-4" /> : <ArrowDownWideNarrow className="h-4 w-4" />}
          {sortByCount ? '按目录顺序' : '按数量排序'}
        </button>
      </div>

      <div className="space-y-1.5">
        {rows.map((s, i) => {
          const name = statName(s)
          return (
            <motion.button
              layout
              key={name}
              type="button"
              onClick={() => navigate(`/drugs?tab=chem&cat=${encodeURIComponent(name)}`)}
              transition={{ layout: { type: 'spring', stiffness: 300, damping: 30, duration: 0.5 } }}
              className="group flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-bg-elev"
            >
              <span
                className="w-[120px] shrink-0 truncate text-sm text-ink-2 transition-colors group-hover:text-ink sm:w-[180px]"
                title={name}
              >
                {name}
              </span>
              <span className="relative h-5 flex-1 overflow-hidden rounded-full bg-line/60">
                <motion.span
                  className="block h-full rounded-full bg-gradient-to-r from-chem/70 to-chem transition-colors group-hover:from-brand group-hover:to-brand"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(s.count / max) * 100}%` }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.04 }}
                />
              </span>
              <span className="w-10 shrink-0 text-right font-mono text-sm tabular">
                <CountUp value={s.count} duration={0.9} delay={i * 0.04} />
              </span>
              <span className="hidden w-16 shrink-0 text-xs text-brand opacity-0 transition-opacity group-hover:opacity-100 md:block">
                查看 →
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Section 3 — TCM accordion tree                                     */
/* ------------------------------------------------------------------ */

interface SubStat {
  sub: string
  count: number
}

function TcmTree({ stats, subMap }: { stats: CatStat[]; subMap: Map<string, SubStat[]> }) {
  const [open, setOpen] = useState<string | null>(null)
  const navigate = useNavigate()
  const max = Math.max(...stats.map((s) => s.count), 1)

  return (
    <div>
      <h3 className="mb-6 font-serif text-xl font-semibold md:text-2xl">中成药 · 按功能分类</h3>
      <div className="space-y-3">
        {stats.map((s, i) => {
          const name = statName(s)
          const expanded = open === name
          const subs = subMap.get(name) ?? []
          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
              className="overflow-hidden rounded-xl border border-line bg-bg-elev"
            >
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : name)}
                className="flex w-full items-center gap-4 p-5 text-left"
                aria-expanded={expanded}
              >
                <span className="font-serif text-lg font-semibold md:text-xl">{name}</span>
                <span className="rounded-full bg-tcm/10 px-2.5 py-0.5 font-mono text-xs font-medium text-tcm tabular">
                  {s.count} 种
                </span>
                <span className="relative mx-2 hidden h-2 flex-1 overflow-hidden rounded-full bg-line/60 sm:block">
                  <motion.span
                    className="block h-full rounded-full bg-tcm/70"
                    animate={{ width: expanded ? `${(s.count / max) * 100}%` : `${(s.count / max) * 40}%` }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                </span>
                <ChevronDown
                  className={cn('h-5 w-5 shrink-0 text-ink-2 transition-transform duration-300', expanded && 'rotate-180')}
                />
              </button>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    key="sub"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <div className="border-t border-line px-5 py-3">
                      {subs.length === 0 && (
                        <p className="py-2 text-sm text-ink-2">该大类不设亚类，共 {s.count} 个品种。</p>
                      )}
                      {subs.map((sub, j) => (
                        <motion.button
                          key={sub.sub}
                          type="button"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, ease: EASE, delay: j * 0.05 }}
                          onClick={() =>
                            navigate(`/drugs?tab=tcm&cat=${encodeURIComponent(name)}&sub=${encodeURIComponent(sub.sub)}`)
                          }
                          className="group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-bg"
                        >
                          <span className="flex-1 text-ink-2 group-hover:text-ink">{sub.sub}</span>
                          <span className="font-mono text-xs tabular text-ink-2">{sub.count} 种</span>
                          <span className="text-xs text-brand opacity-0 transition-opacity group-hover:opacity-100">
                            查看品种 →
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Section 4 — △ triangle stats                                       */
/* ------------------------------------------------------------------ */

function TriangleStats({ chemTri, tcmTri }: { chemTri: number; tcmTri: number }) {
  const navigate = useNavigate()
  return (
    <div>
      <h3 className="mb-6 flex items-center gap-2 font-serif text-xl font-semibold md:text-2xl">
        <AlertTriangle className="h-5 w-5 text-danger" />
        △ 特殊管理品种
      </h3>
      <div className="grid gap-6 md:grid-cols-2">
        {[
          { label: '化学药品和生物制品', count: chemTri },
          { label: '中成药', count: tcmTri },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.12 }}
            className="rounded-xl border border-line bg-bg-elev p-8"
          >
            <p className="text-sm text-ink-2">{c.label}</p>
            <p className="mt-3 font-serif text-6xl font-bold leading-none text-danger tabular">
              <CountUp value={c.count} duration={1.6} delay={i * 0.12} />
            </p>
            <p className="mt-2 text-sm text-ink-2">个 △ 标注品种</p>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-6 rounded-r-xl border-l-[3px] border-danger bg-danger/5 p-5"
      >
        <p className="text-sm leading-relaxed">
          标注 △ 的品种为特殊管理药品，须在专科医师指导下使用，医疗机构应加强处方审核与用药监测。
        </p>
      </motion.div>
      <motion.button
        type="button"
        onClick={() => navigate('/drugs?triangle=1')}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-danger px-6 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
      >
        查看全部 △ 品种
        <ArrowRight className="h-4 w-4" />
      </motion.button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Section 5 — dosage-form tag wall                                   */
/* ------------------------------------------------------------------ */

const DOSAGE_KEYWORDS = [
  '注射用', '注射液', '注射剂', '肠溶', '缓释', '控释', '泡腾', '含片', '咀嚼',
  '片剂', '分散片', '胶囊', '软胶囊', '颗粒', '丸剂', '滴丸', '口服液', '口服溶液',
  '合剂', '糖浆', '混悬', '散剂', '煎膏', '酊剂', '流浸膏', '软膏', '乳膏', '凝胶',
  '栓剂', '滴眼', '眼膏', '滴鼻', '鼻喷雾', '喷雾剂', '气雾剂', '吸入', '贴剂',
  '贴膏', '搽剂', '洗剂', '灌肠', '外用',
]

interface DosageTag {
  kw: string
  chem: number
  tcm: number
  total: number
}

function DosageWall({ tags }: { tags: DosageTag[] }) {
  const navigate = useNavigate()
  const sorted = useMemo(() => [...tags].sort((a, b) => b.total - a.total), [tags])
  const t1 = sorted[Math.floor(sorted.length / 3)]?.total ?? 0
  const t2 = sorted[Math.floor((sorted.length * 2) / 3)]?.total ?? 0

  // deterministic pseudo-random display order
  const shuffled = useMemo(
    () =>
      [...tags].sort((a, b) => {
        const h = (s: string) => [...s].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) % 9973, 7)
        return h(a.kw) - h(b.kw)
      }),
    [tags],
  )

  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 font-serif text-xl font-semibold md:text-2xl">
        <Pill className="h-5 w-5 text-brand" />
        剂型规格一览
      </h3>
      <p className="mb-6 text-sm text-ink-2">标签越大，包含该剂型的品种越多；蓝色源于化药，红色源于中成药。</p>
      <div className="flex flex-wrap gap-2.5">
        {shuffled.map((t, i) => {
          const tier = t.total >= t1 ? 0 : t.total >= t2 ? 1 : 2
          const dominant = t.chem >= t.tcm ? 'var(--chem)' : 'var(--tcm)'
          return (
            <motion.button
              key={t.kw}
              type="button"
              title={`${t.kw}：${t.total} 个品种（化药 ${t.chem} / 中成药 ${t.tcm}）`}
              onClick={() => navigate(`/drugs?q=${encodeURIComponent(t.kw)}`)}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22, delay: i * 0.02 }}
              className={cn(
                'rounded-full border bg-bg-elev',
                tier === 0 && 'px-4 py-1.5 text-base font-bold',
                tier === 1 && 'px-3.5 py-1 text-sm font-medium',
                tier === 2 && 'px-3 py-0.5 text-xs font-normal',
              )}
              style={{ color: dominant, borderColor: 'var(--line)' }}
            >
              {t.kw}
              <span className="ml-1.5 font-mono text-[0.75em] opacity-60 tabular">{t.total}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function Insights() {
  const { data, loading, error } = useDrugs()

  const derived = useMemo(() => {
    if (!data) return null
    const chemTri = data.chem.filter((d) => d.triangle).length
    const tcmTri = data.tcm.filter((d) => d.triangle).length

    const subMap = new Map<string, SubStat[]>()
    for (const s of data.catStatsTcm) subMap.set(statName(s), [])
    const acc = new Map<string, Map<string, number>>()
    for (const d of data.tcm) {
      if (!d.sub) continue
      if (!acc.has(d.cat)) acc.set(d.cat, new Map())
      const m = acc.get(d.cat)!
      m.set(d.sub, (m.get(d.sub) ?? 0) + 1)
    }
    for (const [cat, m] of acc) {
      const list = [...m.entries()]
        .map(([sub, count]) => ({ sub, count }))
        .sort((a, b) => a.sub.localeCompare(b.sub, 'zh'))
      const catName = data.catStatsTcm.find((s) => statName(s) === cat)
      if (catName) subMap.set(statName(catName), list)
    }

    const tags: DosageTag[] = DOSAGE_KEYWORDS.map((kw) => {
      const chem = data.chem.filter((d) => d.spec.includes(kw)).length
      const tcm = data.tcm.filter((d) => d.spec.includes(kw)).length
      return { kw, chem, tcm, total: chem + tcm }
    }).filter((t) => t.total > 0)

    return { chemTri, tcmTri, subMap, tags }
  }, [data])

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-24">
        <div className="h-10 w-48 animate-pulse rounded bg-line/60" />
        <div className="mt-6 h-4 w-96 animate-pulse rounded bg-line/60" />
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div className="mx-auto h-[340px] w-[340px] animate-pulse rounded-full bg-line/40" />
          <div className="space-y-4">
            <div className="h-20 animate-pulse rounded-xl bg-line/40" />
            <div className="h-20 animate-pulse rounded-xl bg-line/40" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data || !derived) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-24">
        <p className="text-danger">数据加载失败{error ? `：${error}` : ''}，请稍后重试。</p>
      </div>
    )
  }

  const chemCount = data.meta.chemCount
  const tcmCount = data.meta.tcmCount

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-24">
      {/* page header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <SectionHeader no="03" title="数据洞察" sub="Data Insights" />
        <p className="mt-4 max-w-2xl text-ink-2">
          {chemCount} 个化药品种、{tcmCount} 个中成药品种，分布在 {data.catStatsChem.length + data.catStatsTcm.length} 个大类之中。
        </p>
      </motion.div>
      <motion.div
        className="mt-6 h-px bg-line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        style={{ transformOrigin: 'left' }}
      />

      {/* Section 1 */}
      <section className="flex min-h-[80vh] flex-col justify-center py-16">
        <p className="mb-8 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-ink-2">
          <PieChart className="h-4 w-4 text-brand" /> 01 · 总量构成
        </p>
        <Donut chem={chemCount} tcm={tcmCount} />
      </section>

      {/* Section 2 */}
      <section className="border-t border-line py-16">
        <p className="mb-8 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-ink-2">
          <BarChart3 className="h-4 w-4 text-brand" /> 02 · 化药大类分布
        </p>
        <ChemBars stats={data.catStatsChem} />
      </section>

      {/* Section 3 */}
      <section className="min-h-[90vh] border-t border-line py-16">
        <p className="mb-8 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-ink-2">
          03 · 中成药分类树
        </p>
        <TcmTree stats={data.catStatsTcm} subMap={derived.subMap} />
      </section>

      {/* Section 4 */}
      <section className="min-h-[70vh] border-t border-line py-16">
        <p className="mb-8 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-ink-2">
          <AlertTriangle className="h-4 w-4 text-danger" /> 04 · 特殊管理
        </p>
        <TriangleStats chemTri={derived.chemTri} tcmTri={derived.tcmTri} />
      </section>

      {/* Section 5 */}
      <section className="min-h-[60vh] border-t border-line py-16">
        <p className="mb-8 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-ink-2">
          <Pill className="h-4 w-4 text-brand" /> 05 · 剂型分布
        </p>
        <DosageWall tags={derived.tags} />
      </section>
    </div>
  )
}
