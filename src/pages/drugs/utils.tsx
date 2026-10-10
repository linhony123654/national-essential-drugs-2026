import { Fragment } from 'react'
import type { ReactNode } from 'react'
import type { ChemDrug, DrugsData, TcmDrug } from '@/lib/data'

export type DrugTab = 'chem' | 'tcm'

export interface DrugRow {
  key: string
  no: string
  star: boolean
  name: string
  en: string
  gn: string
  spec: string
  cat: string
  sub: string
  triangle: boolean
  note: string
  noteText: string
  tab: DrugTab
}

function stripCatNum(cat: string) {
  return cat.replace(/^[一二三四五六七八九十百]+、/, '')
}

export function catLabel(cat: string) {
  return stripCatNum(cat)
}

interface NoteEntry {
  id: string
  no: string
  text: string
}

export function buildRows(data: DrugsData, tab: DrugTab): DrugRow[] {
  const notes = (tab === 'chem' ? data.notesChem : data.notesTcm) as unknown as NoteEntry[]
  const noteMap = new Map(notes.map((n) => [n.id, n.text]))
  const list: Array<ChemDrug | TcmDrug> = tab === 'chem' ? data.chem : data.tcm
  return list.map((d, i) => {
    const no = d.no.replace(/^\*/, '')
    const note = 'note' in d ? d.note : ''
    return {
      key: `${tab}-${i}-${d.no}`,
      no,
      star: d.no.startsWith('*'),
      name: d.name,
      en: 'en' in d ? d.en : '',
      gn: 'gn' in d ? d.gn : '',
      spec: d.spec,
      cat: d.cat,
      sub: d.sub,
      triangle: d.triangle,
      note,
      noteText: note ? (noteMap.get(note) ?? '') : '',
      tab,
    }
  })
}

export function matchesQuery(row: DrugRow, q: string) {
  if (!q) return true
  const t = q.toLowerCase()
  return (
    row.name.toLowerCase().includes(t) ||
    row.en.toLowerCase().includes(t) ||
    row.gn.toLowerCase().includes(t) ||
    row.cat.toLowerCase().includes(t) ||
    row.sub.toLowerCase().includes(t) ||
    row.spec.toLowerCase().includes(t)
  )
}

export function Highlight({ text, query }: { text: string; query: string }) {
  if (!query || !text) return <>{text}</>
  const t = query.toLowerCase()
  const parts: ReactNode[] = []
  let rest = text
  let k = 0
  for (;;) {
    const idx = rest.toLowerCase().indexOf(t)
    if (idx === -1) {
      parts.push(rest)
      break
    }
    parts.push(rest.slice(0, idx))
    parts.push(
      <mark key={k++} className="rounded-sm bg-brand/20 px-0.5 font-bold text-inherit">
        {rest.slice(idx, idx + query.length)}
      </mark>,
    )
    rest = rest.slice(idx + query.length)
  }
  return <Fragment>{parts}</Fragment>
}
