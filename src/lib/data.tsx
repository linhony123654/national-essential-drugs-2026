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
  cat: string
  count: number
}

export interface DrugsData {
  meta: DrugsMeta
  chem: ChemDrug[]
  tcm: TcmDrug[]
  notesChem: string[]
  notesTcm: string[]
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
    fetch('/drugs.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: DrugsData) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((e: Error) => {
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
