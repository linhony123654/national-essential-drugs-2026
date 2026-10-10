import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import { useDrugs } from '@/lib/data'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface NoteItem {
  id: string
  no: string
  text: string
}

/* ---------- Hero ---------- */

const QUOTE_LINES = [
  '基本药物，是指满足疾病防治基本用药需求，',
  '适应现阶段基本国情和保障能力，剂型适宜，',
  '价格合理，能够保障供应，可公平获得的药品。',
]

function Hero() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[1200px] flex-col-reverse items-center gap-10 px-4 py-16 md:flex-row md:gap-16 md:px-6 md:py-20">
      <div className="flex-1">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-gold"
        >
          About the List
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          className="mt-4 font-serif text-[56px] font-black leading-tight text-ink"
        >
          目录说明
        </motion.h1>

        <blockquote className="mt-10 border-l-[3px] border-brand pl-6">
          {QUOTE_LINES.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.12, ease: EASE }}
                className="block font-serif text-xl leading-[1.9] text-brand-deep dark:text-ink"
              >
                {line}
              </motion.span>
            </span>
          ))}
        </blockquote>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
          className="mt-8 max-w-[520px] text-base leading-8 text-ink-2"
        >
          国家基本药物目录是各级医疗卫生机构配备使用药品的依据。
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        className="w-full max-w-[420px] md:w-[40%] md:max-w-none"
      >
        <motion.img
          src="/guide-illustration.svg"
          alt="目录册与药品插画"
          className="w-full"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}

/* ---------- Section 1: 目录构成 ---------- */

const STRUCTURE_CARDS = [
  {
    title: '化学药品和生物制品',
    color: 'bg-chem',
    text: '按临床药理学分类编排，共 25 大类 476 品种。每一品种标注序号、中英文名称与剂型规格。',
  },
  {
    title: '中成药',
    color: 'bg-tcm',
    text: '按功能分类编排，涵盖 7 大类 318 品种，标注功能分类与剂型规格。',
  },
  {
    title: '中药饮片',
    color: 'bg-gold',
    text: '不列具体品种。凡符合《中华人民共和国药典》等国家药品标准的中药饮片，均为国家基本药物。',
  },
]

function Structure() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-24 md:px-6">
      <SectionHeader no="01" title="目录构成" sub="Structure" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {STRUCTURE_CARDS.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.15, ease: EASE }}
            className="relative overflow-hidden rounded-xl border border-line bg-bg-elev p-8 shadow-sm"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: EASE }}
              className={cn('absolute inset-x-0 top-0 h-[3px] origin-left', c.color)}
            />
            <h3 className="font-serif text-xl font-semibold text-ink">{c.title}</h3>
            <p className="mt-4 text-[15px] leading-8 text-ink-2">{c.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ---------- Section 2: 标记说明 ---------- */

const RULES = [
  {
    dot: 'bg-danger',
    title: '△ 特殊管理',
    text: '品种名称右上角标注 △ 者，为特殊管理药品，须在专科医师指导下使用。',
  },
  {
    dot: 'bg-gold',
    title: '* 重复标注',
    text: '同一成分的不同剂型重复标注 *，化药共 21 条、中成药 1 条。',
  },
  {
    dot: 'bg-brand',
    title: '注（官方注释）',
    text: '序号带"注"者，在目录后有对应注释，对品种的规格、限定范围作出补充说明。',
  },
  {
    dot: 'bg-ink',
    title: '编号体系',
    text: '化药与中成药分别独立编号；大类以中文数字冠名（如"一、抗微生物药"），下设亚类（如"（一）青霉素类"）。',
  },
]

function Notation() {
  const lineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start 80%', 'end 60%'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 24 })

  return (
    <section className="border-y border-line bg-bg-elev/40">
      <div className="mx-auto max-w-[1200px] px-4 py-24 md:px-6">
        <SectionHeader no="02" title="标记说明" sub="Notation" />
        <div ref={lineRef} className="relative mt-14 ml-3 md:ml-6">
          <span className="absolute bottom-1 left-0 top-1 w-px bg-line" />
          <motion.span
            style={{ scaleY }}
            className="absolute bottom-1 left-0 top-1 w-px origin-top bg-brand"
          />
          <ul className="space-y-12">
            {RULES.map((r) => (
              <li key={r.title} className="relative pl-10">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-40% 0px -40% 0px' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                  className={cn(
                    'absolute -left-[5px] top-2 h-[11px] w-[11px] rounded-full ring-4 ring-bg',
                    r.dot,
                  )}
                />
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40% 0px -40% 0px' }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <h3 className="font-serif text-lg font-semibold text-ink">{r.title}</h3>
                  <p className="mt-2 max-w-[680px] text-[15px] leading-8 text-ink-2">{r.text}</p>
                </motion.div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ---------- Section 3: 注释全文 ---------- */

function NoteText({ text }: { text: string }) {
  const navigate = useNavigate()
  const parts = text.split(/(第?\d+(?:\/\d+)?号?)/g)
  return (
    <p className="text-[15px] leading-8 text-ink-2">
      {parts.map((p, i) => {
        const m = p.match(/第?(\d+(?:\/\d+)?)号?/)
        if (!m) return <span key={i}>{p}</span>
        const firstNo = m[1].split('/')[0]
        return (
          <button
            key={i}
            onClick={() => navigate(`/drugs?q=${encodeURIComponent(firstNo)}`)}
            className="group relative mx-0.5 font-mono text-[14px] text-brand underline decoration-brand/40 underline-offset-4 transition-colors hover:decoration-brand"
          >
            {p}
            <span className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-line bg-bg-elev px-2 py-1 font-sans text-xs text-ink opacity-0 shadow-md transition-opacity group-hover:opacity-100">
              在检索页查看该品种
            </span>
          </button>
        )
      })}
    </p>
  )
}

function NoteAccordion({
  title,
  count,
  notes,
  defaultOpen = false,
  indexBase = 0,
}: {
  title: string
  count: number
  notes: NoteItem[]
  defaultOpen?: boolean
  indexBase?: number
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-bg-elev">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="font-serif text-lg font-semibold text-ink">
          {title}
          <span className="ml-3 font-mono text-sm font-normal text-ink-2">（{count} 条）</span>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={18} className="text-ink-2" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <ul className="space-y-4 border-t border-line px-6 py-6">
              {notes.map((n, i) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                  className="rounded-lg border border-line bg-bg p-5"
                >
                  <p className="font-mono text-xs text-gold">
                    {n.id}
                    <span className="ml-2 text-ink-2">（对应序号 {n.no}）</span>
                  </p>
                  <div className="mt-2">
                    <NoteText text={n.text} />
                  </div>
                  <span className="sr-only">{indexBase + i}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Footnotes() {
  const { data, loading } = useDrugs()
  const notesChem = ((data?.notesChem ?? []) as unknown as NoteItem[]) || []
  const notesTcm = ((data?.notesTcm ?? []) as unknown as NoteItem[]) || []

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-24 md:px-6">
      <SectionHeader no="03" title="注释全文" sub="Footnotes" />
      <p className="mt-6 text-[15px] leading-8 text-ink-2">以下为目录所附注释原文。</p>
      {loading ? (
        <div className="mt-10 space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl border border-line bg-bg-elev" />
          ))}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-10 space-y-4"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
          >
            <NoteAccordion
              title="化学药品和生物制品注释"
              count={notesChem.length}
              notes={notesChem}
              defaultOpen
            />
          </motion.div>
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.06, ease: EASE } } }}
          >
            <NoteAccordion
              title="中成药注释"
              count={notesTcm.length}
              notes={notesTcm}
              indexBase={notesChem.length}
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

/* ---------- Section 4: 中药饮片政策 ---------- */

const DECOCTION_QUOTE = '中药饮片不列具体品种——凡符合国家药品标准的中药饮片，均为国家基本药物。'

function DecoctionPolicy() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const decoY = useTransform(scrollYProgress, [0, 1], [40, -40])

  const words = DECOCTION_QUOTE.split('')

  return (
    <section ref={ref} className="relative overflow-hidden bg-brand-deep dark:bg-bg-elev">
      <motion.img
        src="/deco-capsule.svg"
        alt=""
        aria-hidden
        style={{ y: decoY }}
        className="pointer-events-none absolute -right-24 top-1/2 w-[520px] -translate-y-1/2 opacity-10 invert"
      />
      <div className="relative mx-auto max-w-[900px] px-6 py-24 text-center">
        <SectionHeader no="04" title="中药饮片" sub="Decoction Pieces" className="justify-center [&_h2]:!text-[#E8EDE9] [&_p]:!text-white/60 [&_.bg-line]:!bg-white/20" />
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.04 }}
          className="mt-10 font-serif text-[32px] font-semibold leading-[1.7] text-[#E8EDE9] dark:text-ink"
        >
          {words.map((w, i) => (
            <motion.span
              key={i}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } } }}
              className="inline-block"
            >
              {w === '—' ? '—' : w}
            </motion.span>
          ))}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
          className="mx-auto mt-8 max-w-[640px] text-sm leading-7 text-white/70 dark:text-ink-2"
        >
          国家基本药物目录中的药品包括化学药品和生物制品、中成药以及中药饮片。目录依据《中华人民共和国药典》（2025年版）等现行国家药品标准编排。
        </motion.p>
      </div>
    </section>
  )
}

/* ---------- Section 5: 页尾 CTA ---------- */

function MagneticButton({
  to,
  label,
  primary,
  delay,
}: {
  to: string
  label: string
  primary?: boolean
  delay: number
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 16 })
  const sy = useSpring(y, { stiffness: 200, damping: 16 })

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
    x.set(Math.max(-6, Math.min(6, dx * 6)))
    y.set(Math.max(-6, Math.min(6, dy * 6)))
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      <motion.div style={{ x: sx, y: sy }}>
        <Link
          to={to}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className={cn(
            'group inline-flex items-center gap-3 rounded-full px-8 py-4 font-serif text-lg font-semibold transition-all duration-300 hover:scale-[1.02]',
            primary
              ? 'bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-deep'
              : 'border border-line bg-bg-elev text-ink hover:border-brand hover:text-brand',
          )}
        >
          {label}
          <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </motion.div>
  )
}

function GuideCta() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-24 md:px-6">
      <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
        <MagneticButton to="/drugs" label="开始检索药品" primary delay={0} />
        <MagneticButton to="/insights" label="查看数据洞察" delay={0.1} />
      </div>
    </section>
  )
}

/* ---------- Page ---------- */

export default function Guide() {
  return (
    <div>
      <Hero />
      <Structure />
      <Notation />
      <Footnotes />
      <DecoctionPolicy />
      <GuideCta />
    </div>
  )
}
