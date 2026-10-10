import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export interface ChemDrug {
  no: string
  name: string
  en: string
  spec: string
  cat: string
  sub: string
  triangle: boolean
  note: string
}

export interface TcmDrug {
  no: string
  name: string
  gn: string
  spec: string
  cat: string
  sub: string
  triangle: boolean
}

export interface DrugsMeta {
  title: string
  issuer: string
  chemCount: number
  tcmCount: number
  definition: string
  decoction: string
  triangleNote: string
  starNote: string
}

export interface CatStat {
  /** 大类名称（drugs.json 实际键为 name） */
  name: string
  count: number
}

export interface NoteItem {
  id: string
  no: string
  text: string
}

export interface DrugsData {
  meta: DrugsMeta
  chem: ChemDrug[]
  tcm: TcmDrug[]
  notesChem: NoteItem[]
  notesTcm: NoteItem[]
  catStatsChem: CatStat[]
  catStatsTcm: CatStat[]
}

interface DrugsState {
  data: DrugsData | null
  loading: boolean
  error: string | null
}

const DrugsContext = createContext<DrugsState>({ data: null, loading: true, error: null })

export function DrugsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DrugsState>({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    const get = async <T,>(url: string): Promise<T> => {
      const r = await fetch(url)
      if (!r.ok) throw new Error(`HTTP ${r.status} @ ${url}`)
      return r.json() as Promise<T>
    }
    ;(async () => {
      // 数据分片加载：/data/meta.json + /data/index.json 列出的各 shard 并行拉取后合并
      const [meta, idx] = await Promise.all([
        get<Omit<DrugsData, 'chem' | 'tcm'>>('/data/meta.json'),
        get<{ chemShards: string[]; tcmShards: string[] }>('/data/index.json'),
      ])
      const [chemParts, tcmParts] = await Promise.all([
        Promise.all(idx.chemShards.map((s) => get<ChemDrug[]>(`/data/${s}`))),
        Promise.all(idx.tcmShards.map((s) => get<TcmDrug[]>(`/data/${s}`))),
      ])
      const data: DrugsData = { ...meta, chem: chemParts.flat(), tcm: tcmParts.flat() }
      if (!cancelled) setState({ data, loading: false, error: null })
    })().catch((e: Error) => {
      if (!cancelled) setState({ data: null, loading: false, error: e.message })
    })
    return () => {
      cancelled = true
    }
  }, [])

  return <DrugsContext.Provider value={state}>{children}</DrugsContext.Provider>
}

export function useDrugs() {
  return useContext(DrugsContext)
}
