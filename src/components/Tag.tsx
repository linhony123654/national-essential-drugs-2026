import { cn } from '@/lib/utils'

interface TagProps {
  kind: 'triangle' | 'star' | 'chem' | 'tcm'
  label?: string
  className?: string
}

const styles: Record<TagProps['kind'], string> = {
  triangle: 'border-danger text-danger',
  star: 'border-gold text-gold',
  chem: 'border-chem text-chem',
  tcm: 'border-tcm text-tcm',
}

const defaults: Record<TagProps['kind'], string> = {
  triangle: '△',
  star: '*',
  chem: '化学药品和生物制品',
  tcm: '中成药',
}

export default function Tag({ kind, label, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border bg-transparent px-2 py-0.5 font-mono text-[11px] leading-4',
        styles[kind],
        className,
      )}
    >
      {label ?? defaults[kind]}
    </span>
  )
}
