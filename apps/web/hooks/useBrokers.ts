'use client'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'

export function useBrokers() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const type = searchParams.get('type') ?? ''
  const page = Number(searchParams.get('page') ?? 1)

  return useQuery({
    queryKey: ['brokers', search, type, page],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (type) params.set('type', type)
      params.set('page', String(page))
      const res = await api.get(`/api/brokers?${params.toString()}`)
      return res.data.data
    },
  })
}
