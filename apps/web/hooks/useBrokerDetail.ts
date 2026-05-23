'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useBrokerDetail(slug: string) {
  return useQuery({
    queryKey: ['broker', slug],
    queryFn: async () => {
      const res = await api.get(`/api/brokers/${slug}`)
      return res.data.data
    },
    enabled: !!slug,
  })
}
