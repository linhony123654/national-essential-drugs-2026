interface SectionHeaderProps {
  no: string
  title: string
  sub: string
  className?: string
}

export default function SectionHeader({ no, title, sub, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-end gap-6 ${className}`}>
      <span className="font-mono text-sm text-gold tabular">{no}</span>
      <div>
        <h2 className="font-serif font-bold leading-tight" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
          {title}
        </h2>
        <p className="mt-1 font-mono text-xs uppercase tracking-[0.3em] text-ink-2">{sub}</p>
      </div>
      <div className="mb-3 hidden h-px flex-1 bg-line sm:block" />
    </div>
  )
}
