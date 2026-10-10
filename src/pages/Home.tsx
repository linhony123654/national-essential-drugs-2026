import { useRef, useState } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, Asterisk, FileText } from 'lucide-react'
import CountUp from '@/components/CountUp'
import SectionHeader from '@/components/SectionHeader'
import Tag from '@/components/Tag'
import HeroParticles from '@/components/HeroParticles'
import { useDrugs } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const EASE_OUT = 'power3.out'

const STATS = [
  { value: 476, unit: '品种', label: '化学药品和生物制品', color: 'var(--chem)' },
  { value: 318, unit: '品种', label: '中成药', color: 'var(--tcm)' },
  { value: 25, unit: '大类', label: '化药临床药理学分类', color: 'var(--gold)' },
  { value: 7, unit: '大类', label: '中成药功能分类', color: 'var(--accent)' },
]

const COMPOSE_STEPS = [
  {
    key: 'chem',
    title: '化学药品和生物制品',
    color: 'var(--chem)',
    text: '按临床药理学分类，涵盖抗微生物药、心血管系统用药、抗肿瘤药等 25 个大类，共 476 个品种。',
    art: (
      <svg viewBox="0 0 200 200" className="h-44 w-44" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="100" cy="100" r="10" />
        <circle cx="50" cy="60" r="8" />
        <circle cx="152" cy="56" r="8" />
        <circle cx="150" cy="146" r="8" />
        <circle cx="52" cy="144" r="8" />
        <path d="M92 94 57 66M108 93 145 62M108 107 143 140M92 107 59 138" />
        <g transform="rotate(45 100 34)">
          <rect x="82" y="26" width="36" height="16" rx="8" />
          <line x1="100" y1="26" x2="100" y2="42" />
        </g>
      </svg>
    ),
  },
  {
    key: 'tcm',
    title: '中成药',
    color: 'var(--tcm)',
    text: '按功能分类，涵盖内科、外科、妇科、眼科、耳鼻喉科、骨伤科、儿科 7 大类用药，共 318 个品种。',
    art: (
      <svg viewBox="0 0 200 200" className="h-44 w-44" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M100 176 C94 120 96 64 112 20" />
        <path d="M104 140 C64 128 46 100 42 66 C80 76 100 104 104 140 Z" />
        <path d="M108 92 C150 80 168 50 172 16 C132 26 112 54 108 92 Z" />
        <path d="M110 52 C82 38 74 12 80 -12" opacity="0" />
        <path d="M99 166 C124 158 138 138 140 114 C112 122 100 142 99 166 Z" />
      </svg>
    ),
  },
  {
    key: 'decoction',
    title: '中药饮片',
    color: 'var(--gold)',
    text: '不列具体品种，凡符合国家标准的中药饮片，均为国家基本药物。',
    art: (
      <svg viewBox="0 0 200 200" className="h-44 w-44" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M60 70 h80 v70 a40 30 0 0 1 -80 0 Z" />
        <path d="M70 70 c0-22 12-34 30-34 s30 12 30 34" />
        <path d="M92 40 h16" />
        <path d="M78 104 c8-8 16 8 24 0 s16 8 24 0" />
      </svg>
    ),
  },
]

const ENTRY_CARDS = [
  {
    no: '01',
    title: '药品检索',
    desc: '全文搜索 816 条目录记录，按大类、亚类、标记多维筛选。',
    to: '/drugs',
    glow: 'radial-gradient(600px 200px at 50% 100%, color-mix(in srgb, var(--chem) 14%, transparent), transparent)',
  },
  {
    no: '02',
    title: '数据洞察',
    desc: '大类品种分布、△ 标记统计，一图读懂目录结构。',
    to: '/insights',
    glow: 'radial-gradient(600px 200px at 50% 100%, color-mix(in srgb, var(--gold) 16%, transparent), transparent)',
  },
  {
    no: '03',
    title: '目录说明',
    desc: '定义、编排规则、注释全文与中药饮片政策。',
    to: '/guide',
    glow: 'radial-gradient(600px 200px at 50% 100%, color-mix(in srgb, var(--accent) 14%, transparent), transparent)',
  },
]

function HeroSection({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!ready) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const kicker = rootRef.current?.querySelector('.hero-kicker')
      const chars = rootRef.current?.querySelectorAll('.hero-char')
      const fade = rootRef.current?.querySelectorAll('.hero-fade')
      if (!kicker || !chars || !fade) return
      if (reduced) {
        gsap.set([kicker, chars, fade], { clearProps: 'all', opacity: 1 })
        return
      }
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } })
      tl.fromTo(kicker, { letterSpacing: '0.6em', opacity: 0 }, { letterSpacing: '0.35em', opacity: 1, duration: 1 })
      tl.fromTo(
        chars,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.05 },
        0.15,
      )
      tl.fromTo(fade, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, 0.6)
      tl.fromTo('.hero-particles-wrap', { opacity: 0 }, { opacity: 1, duration: 1.5 }, 0.3)
      // scroll parallax
      gsap.to(textRef.current, {
        yPercent: -35,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '80% top',
          scrub: true,
        },
      })
    },
    { scope: rootRef, dependencies: [ready] },
  )

  return (
    <section ref={rootRef} className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      <img
        src="/hero-texture.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="hero-particles-wrap absolute inset-0 opacity-0">
        <HeroParticles />
      </div>
      <img
        src="/deco-capsule.svg"
        alt=""
        className="pointer-events-none absolute -bottom-10 -left-10 w-[240px] rotate-45 text-brand opacity-[0.08]"
      />
      <div ref={textRef} className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center px-6">
        <p className="hero-kicker mt-[4vh] text-center font-mono text-xs text-ink-2 md:text-sm" style={{ letterSpacing: '0.35em' }}>
          NATIONAL ESSENTIAL MEDICINES LIST · 2026 EDITION
        </p>
        <h1
          className="mt-8 text-center font-serif font-black leading-[1.12] tracking-[0.02em]"
          style={{ fontSize: 'clamp(44px, 8vw, 96px)' }}
        >
          <span className="block">
            {'国家基本药物目录'.split('').map((c, i) => (
              <span key={i} className="hero-char inline-block">
                {c}
              </span>
            ))}
          </span>
          <span className="block">
            {'2026年版'.split('').map((c, i) => (
              <span key={i} className={`hero-char inline-block ${i < 4 ? 'text-gold' : ''}`}>
                {c}
              </span>
            ))}
            <img src="/logo.svg" alt="" className="hero-char ml-3 inline-block h-[0.55em] w-[0.55em] align-baseline text-brand" />
          </span>
        </h1>
        <p className="hero-fade mx-auto mt-8 max-w-[560px] text-center text-[15px] leading-8 text-ink-2">
          满足基本用药需求 · 剂型适宜 · 价格合理 · 保障供应 · 公平可及
          <br />
          —— 各级医疗卫生机构配备使用药品的依据
        </p>
        <div className="hero-fade mt-6 flex justify-center">
          <span className="rounded-full border border-line px-4 py-1.5 font-mono text-xs tracking-widest text-ink-2">
            国家卫生健康委员会 发布
          </span>
        </div>
        <div className="hero-fade mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/drugs"
            className="group flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-medium text-white transition-all hover:scale-[1.02] hover:bg-brand-deep dark:text-[#0C1210]"
          >
            进入药品检索
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/guide"
            className="rounded-full border border-ink/20 px-7 py-3 text-sm transition-all hover:scale-[1.02] hover:border-brand hover:bg-brand/5 hover:text-brand"
          >
            了解目录说明
          </Link>
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-2 pb-8">
        <span className="font-mono text-xs tracking-[0.3em] text-ink-2">SCROLL</span>
        <span className="animate-scroll-line block h-10 w-px bg-ink-2" />
      </div>
    </section>
  )
}

function StatsSection() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const cards = ref.current?.querySelectorAll('.stat-card')
      const lines = ref.current?.querySelectorAll('.stat-line')
      if (reduced) return
      gsap.fromTo(
        cards!,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: EASE_OUT,
          scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
        },
      )
      gsap.fromTo(
        lines!,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: EASE_OUT,
          transformOrigin: 'left',
          scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
        },
      )
    },
    { scope: ref },
  )
  return (
    <section ref={ref} className="mx-auto max-w-[1200px] px-6 py-24 md:py-32">
      <SectionHeader no="01" title="目录总览" sub="OVERVIEW" />
      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="stat-card group relative overflow-hidden rounded-xl border border-line bg-bg-elev p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8"
          >
            <span
              className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
              style={{ background: s.color }}
            />
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-bold tabular leading-none" style={{ fontSize: 'clamp(48px, 6vw, 84px)', color: s.color }}>
                <CountUp value={s.value} delay={i * 0.15} />
              </span>
              <span className="font-mono text-xs text-ink-2">{s.unit}</span>
            </div>
            <div className="stat-line mt-4 h-px bg-line" />
            <p className="mt-3 text-xs text-ink-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ComposeSection() {
  const ref = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)

  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useGSAP(
    () => {
      if (reduced) return
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          if (progressRef.current) progressRef.current.style.transform = `scaleY(${p})`
          const idx = Math.min(2, Math.floor(p * 3))
          setStep((prev) => (prev === idx ? prev : idx))
        },
      })
    },
    { scope: ref },
  )

  // animate panel switch
  useGSAP(
    () => {
      const panels = panelsRef.current?.querySelectorAll('.compose-panel')
      panels?.forEach((p, i) => {
        gsap.to(p, {
          y: i === step ? 0 : i < step ? -60 : 60,
          opacity: i === step ? 1 : 0,
          duration: 0.6,
          ease: EASE_OUT,
        })
      })
    },
    { dependencies: [step], scope: panelsRef },
  )

  const current = COMPOSE_STEPS[step]

  if (reduced) {
    return (
      <section className="border-y border-line">
        <div className="mx-auto max-w-[1200px] space-y-16 px-6 py-20">
          <h2 className="font-serif font-bold" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
            目录的构成
          </h2>
          {COMPOSE_STEPS.map((s) => (
            <div key={s.key} className="flex flex-col items-start gap-6">
              <div style={{ color: s.color }}>{s.art}</div>
              <h3 className="font-serif text-2xl font-semibold">{s.title}</h3>
              <p className="max-w-md text-[15px] leading-8 text-ink-2">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-line">
      <div className="mx-auto grid min-h-[100dvh] max-w-[1200px] grid-cols-1 gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        <div className="relative flex gap-8">
          <div className="hidden w-px self-stretch bg-line md:block">
            <div ref={progressRef} className="h-full w-[2px] origin-top scale-y-0 bg-gold" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-2">COMPOSITION</p>
            <h2 className="mt-4 font-serif font-bold" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
              目录的构成
            </h2>
            <p className="mt-10 font-serif text-7xl font-bold tabular text-gold md:text-8xl">
              {String(step + 1).padStart(2, '0')}
              <span className="text-2xl text-ink-2"> / 03</span>
            </p>
            <p className="mt-4 font-mono text-sm" style={{ color: current.color }}>
              {current.title}
            </p>
          </div>
        </div>
        <div ref={panelsRef} className="relative min-h-[320px]">
          {COMPOSE_STEPS.map((s, i) => (
            <div
              key={s.key}
              className="compose-panel absolute inset-0 flex flex-col items-start justify-center gap-8"
              style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === step ? 'auto' : 'none' }}
            >
              <div style={{ color: s.color }}>{s.art}</div>
              <h3 className="font-serif text-2xl font-semibold md:text-3xl">{s.title}</h3>
              <p className="max-w-md text-[15px] leading-8 text-ink-2">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PreviewSection() {
  const { data, loading } = useDrugs()
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (loading) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      const rows = ref.current?.querySelectorAll('.drug-row')
      gsap.fromTo(
        rows!,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.04,
          ease: EASE_OUT,
          scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
        },
      )
      const divider = ref.current?.querySelector('.col-divider')
      if (divider) {
        gsap.fromTo(
          divider,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1,
            ease: EASE_OUT,
            transformOrigin: 'top',
            scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
          },
        )
      }
    },
    { scope: ref, dependencies: [loading] },
  )

  const chem = data?.chem.slice(0, 8) ?? []
  const tcm = data?.tcm.slice(0, 8) ?? []

  return (
    <section ref={ref} className="mx-auto max-w-[1200px] px-6 py-24 md:py-32">
      <SectionHeader no="02" title="品种速览" sub="INDEX PREVIEW" />
      <div className="relative mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="col-divider absolute left-1/2 top-0 hidden h-full w-px bg-line md:block" />
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold">化学药品和生物制品</h3>
            <Tag kind="chem" label="共 476 品种" />
          </div>
          <ul>
            {chem.map((d, i) => (
              <li key={`${d.no}-${i}`} className="drug-row group flex items-baseline justify-between gap-3 border-b border-line py-3 transition-colors hover:bg-bg-elev/60">
                <span className="min-w-0">
                  <span className="mr-3 font-mono text-xs text-ink-2 transition-colors group-hover:text-brand tabular">
                    {String(i + 1).padStart(3, '0')}.
                  </span>
                  <span className="text-[15px]">{d.name}</span>
                  {d.triangle && <span className="ml-1.5 text-danger">△</span>}
                  {d.no.includes('*') && <span className="ml-1 text-gold">*</span>}
                </span>
                <span className="truncate font-mono text-xs text-ink-2">{d.en}</span>
              </li>
            ))}
          </ul>
          <Link to="/drugs?tab=chem" className="group mt-6 inline-flex items-center gap-2 text-sm text-brand">
            查看完整目录
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold">中成药</h3>
            <Tag kind="tcm" label="共 318 品种" />
          </div>
          <ul>
            {tcm.map((d, i) => (
              <li key={`${d.no}-${i}`} className="drug-row group flex items-baseline justify-between gap-3 border-b border-line py-3 transition-colors hover:bg-bg-elev/60">
                <span className="min-w-0">
                  <span className="mr-3 font-mono text-xs text-ink-2 transition-colors group-hover:text-brand tabular">
                    {String(i + 1).padStart(3, '0')}.
                  </span>
                  <span className="text-[15px]">{d.name}</span>
                  {d.triangle && <span className="ml-1.5 text-danger">△</span>}
                  {d.no.includes('*') && <span className="ml-1 text-gold">*</span>}
                </span>
                <span className="truncate font-mono text-xs text-ink-2">{d.gn}</span>
              </li>
            ))}
          </ul>
          <Link to="/drugs?tab=tcm" className="group mt-6 inline-flex items-center gap-2 text-sm text-brand">
            查看完整目录
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

const MARKS = [
  { icon: AlertTriangle, symbol: '△', title: '特殊管理品种', text: '需在专科医师指导下使用', color: 'text-danger' },
  { icon: Asterisk, symbol: '*', title: '重复标注', text: '同一成分的不同剂型', color: 'text-gold' },
  { icon: FileText, symbol: '注', title: '官方注释', text: '对品种规格、限定范围的补充说明', color: 'text-brand' },
]

function MarksSection() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      const cells = ref.current?.querySelectorAll('.mark-cell')
      gsap.fromTo(
        cells!,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: EASE_OUT,
          scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
        },
      )
      const icons = ref.current?.querySelectorAll('.mark-icon')
      icons?.forEach((icon, i) => {
        const len = 120
        gsap.fromTo(
          icon,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 0.8,
            delay: 0.15 * i,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
          },
        )
      })
    },
    { scope: ref },
  )
  return (
    <section ref={ref} className="border-y border-line bg-bg-elev/50">
      <div className="mx-auto grid max-w-[1200px] gap-px overflow-hidden px-6 py-12 md:grid-cols-3">
        {MARKS.map((m) => (
          <div key={m.symbol} className="mark-cell flex items-start gap-4 px-4 py-6">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line ${m.color}`}>
              <m.icon size={20} className="mark-icon" strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-serif font-semibold">
                <span className={`mr-2 font-mono ${m.color}`}>{m.symbol}</span>
                {m.title}
              </p>
              <p className="mt-1 text-sm text-ink-2">{m.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function EntrySection() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      const cards = ref.current?.querySelectorAll('.entry-card')
      gsap.fromTo(
        cards!,
        { y: 60, opacity: 0, rotateX: 8, transformPerspective: 800 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: EASE_OUT,
          scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
        },
      )
    },
    { scope: ref },
  )
  return (
    <section ref={ref} className="mx-auto max-w-[1200px] px-6 py-24 md:py-32">
      <SectionHeader no="03" title="开始探索" sub="EXPLORE" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {ENTRY_CARDS.map((c) => (
          <Link
            key={c.no}
            to={c.to}
            className="entry-card group relative flex h-[320px] flex-col justify-between overflow-hidden rounded-xl border border-line bg-bg-elev p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
          >
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: c.glow }}
            />
            <img
              src="/deco-capsule.svg"
              alt=""
              className="pointer-events-none absolute -right-8 -top-8 w-36 text-brand opacity-[0.07] transition-transform duration-500 group-hover:scale-110"
            />
            <span className="font-mono text-sm text-gold tabular">
              <CountUp value={Number(c.no)} duration={1} />
            </span>
            <div className="relative">
              <h3 className="font-serif text-2xl font-bold">{c.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink-2">{c.desc}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm text-brand">
                进入
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function ManifestoSection() {
  const ref = useRef<HTMLElement>(null)
  const text = '基本药物，是亿万家庭用药安全的底线，也是公平可及的承诺。'
  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      const words = ref.current?.querySelectorAll('.manifesto-word')
      gsap.fromTo(
        words!,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.03,
          ease: EASE_OUT,
          scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
        },
      )
      gsap.fromTo(
        ref.current?.querySelector('.manifesto-line')!,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          delay: 0.5,
          ease: EASE_OUT,
          scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
        },
      )
    },
    { scope: ref },
  )
  return (
    <section ref={ref} className="mx-auto max-w-[720px] px-6 pb-28 pt-8 text-center">
      <p className="font-serif leading-relaxed" style={{ fontSize: 'clamp(24px, 3.2vw, 32px)' }}>
        {text.split('').map((c, i) => (
          <span key={i} className="manifesto-word inline-block">
            {c}
          </span>
        ))}
      </p>
      <div className="manifesto-line mx-auto mt-8 h-px w-24 origin-center bg-gold" />
      <p className="mt-6 font-mono text-xs text-ink-2">依据《中华人民共和国药典》（2025年版）编排</p>
    </section>
  )
}

function LoadingOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-6 bg-bg"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <svg viewBox="0 0 64 64" className="h-14 w-14 text-brand" fill="none">
        <g transform="rotate(45 32 32)">
          <motion.rect
            x="14"
            y="22"
            width="36"
            height="20"
            rx="10"
            stroke="currentColor"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <line x1="32" y1="22" x2="32" y2="42" stroke="currentColor" strokeWidth="2.5" />
        </g>
      </svg>
      <p className="font-mono text-xs tracking-[0.3em] text-ink-2">正在载入目录…</p>
    </motion.div>
  )
}

export default function Home() {
  const { loading } = useDrugs()
  const [showContent, setShowContent] = useState(false)

  return (
    <>
      <AnimatePresence onExitComplete={() => setShowContent(true)}>
        {loading && <LoadingOverlay key="loading" />}
      </AnimatePresence>
      <HeroSection ready={!loading && showContent} />
      <StatsSection />
      <ComposeSection />
      <PreviewSection />
      <MarksSection />
      <EntrySection />
      <ManifestoSection />
    </>
  )
}
