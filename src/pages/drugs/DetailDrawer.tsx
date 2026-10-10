import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, Asterisk, Quote, X } from 'lucide-react'
import type { DrugRow } from './utils'
import { catLabel } from './utils'
import Tag from '@/components/Tag'

interface DrawerProps {
  row: DrugRow | null
  onClose: () => void
  onViewCategory: (cat: string) => void
}

function InfoItem({ label, value, mono, index }: { label: string; value: string; mono?: boolean; index: number }) {
  if (!value) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-2">{label}</dt>
      <dd className={(mono ? 'font-mono text-[13px] ' : 'text-sm ') + 'mt-1 leading-relaxed text-ink'}>{value}</dd>
    </motion.div>
  )
}

export default function DetailDrawer({ row, onClose, onViewCategory }: DrawerProps) {
  return (
    <AnimatePresence>
      {row && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-label={`${row.name} 详情`}
            className="absolute bottom-0 right-0 top-0 flex w-full max-w-full flex-col border-l border-line bg-bg-elev shadow-2xl sm:w-[480px] sm:max-w-[480px]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 pb-5 pt-6">
              <div>
                <span className="font-mono text-2xl text-gold tabular">
                  {row.star ? `*（${row.no}）` : `No.${row.no.padStart(3, '0')}`}
                </span>
                <h2 className="mt-2 font-serif text-[28px] font-bold leading-tight text-ink">
                  {row.name}
                  {row.triangle && <sup className="ml-1 font-mono text-base text-danger">△</sup>}
                  {row.star && <sup className="ml-1 font-mono text-base text-gold">*</sup>}
                </h2>
                <div className="mt-2 flex gap-1.5">
                  <Tag kind={row.tab} />
                  {row.triangle && <Tag kind="triangle" label="△ 特殊管理" />}
                  {row.star && <Tag kind="star" label="* 重复标注" />}
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="关闭详情"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:border-brand hover:text-brand"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
                <InfoItem label={row.tab === 'chem' ? '英文名 INN' : '功能分类'} value={row.tab === 'chem' ? row.en : row.gn} mono={row.tab === 'chem'} index={0} />
                <InfoItem label="剂型规格" value={row.spec} index={1} />
                <InfoItem label="大类" value={catLabel(row.cat)} index={2} />
                <InfoItem label="亚类" value={row.sub || '—'} index={3} />
              </dl>

              <div className="mt-6 space-y-3">
                {row.triangle && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.35 }}
                    className="flex gap-3 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm leading-relaxed text-danger"
                  >
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    <span>
                      <strong>△ 特殊管理品种：</strong>需在具备相应处方资质的医师或专科医师指导下使用，并加强使用监测和评价。
                    </span>
                  </motion.div>
                )}
                {row.star && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.35 }}
                    className="flex gap-3 rounded-lg border border-gold/40 bg-gold/5 px-4 py-3 text-sm leading-relaxed text-gold"
                  >
                    <Asterisk size={16} className="mt-0.5 shrink-0" />
                    <span>
                      <strong>* 重复标注：</strong>同一成分不同剂型（或同一处方组成）的重复出现品种。
                    </span>
                  </motion.div>
                )}
                {row.noteText && (
                  <motion.blockquote
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.35 }}
                    className="border-l-[3px] border-gold bg-bg px-4 py-3"
                  >
                    <div className="mb-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-gold">
                      <Quote size={12} /> 官方注释 · {row.note}
                    </div>
                    <p className="text-sm italic leading-relaxed text-ink-2">{row.noteText}</p>
                  </motion.blockquote>
                )}
              </div>
            </div>

            <div className="border-t border-line px-6 py-4">
              <button
                onClick={() => onViewCategory(row.cat)}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-all hover:scale-[1.02] hover:bg-brand-deep"
              >
                查看同大类品种
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
