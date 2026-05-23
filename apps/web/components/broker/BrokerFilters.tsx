'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const TYPES = ['', 'cfd', 'bond', 'stock', 'crypto'] as const
const TYPE_LABELS: Record<string, string> = {
  '': 'All Partners',
  cfd: 'CFD',
  bond: 'Bond',
  stock: 'Stock',
  crypto: 'Crypto',
}

const DEBOUNCE_MS = 600

export function BrokerFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') ?? ''

  const [inputValue, setInputValue] = useState(searchParams.get('search') ?? '')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`/?${params.toString()}`)
  }

  const handleSearchChange = (value: string) => {
    setInputValue(value)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => updateUrl('search', value), DEBOUNCE_MS)
  }

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]" size={18} />
        <input
          type="text"
          value={inputValue}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder="Find brokers by name, region, or asset class..."
          className="w-full h-12 pl-12 pr-4 bg-[#111827] border border-white/8 rounded-sm text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#4f9cf9] transition-colors"
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-[#64748b] tracking-widest uppercase mr-1">Asset Focus:</span>
        {TYPES.map(t => (
          <button
            key={t}
            onClick={() => updateUrl('type', t)}
            className={`px-4 py-1.5 rounded-sm text-xs tracking-widest uppercase transition-all ${
              type === t
                ? 'bg-[#4f9cf9] text-white'
                : 'border border-white/10 text-[#94a3b8] hover:border-white/20 hover:text-[#f1f5f9]'
            }`}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>
    </div>
  )
}
