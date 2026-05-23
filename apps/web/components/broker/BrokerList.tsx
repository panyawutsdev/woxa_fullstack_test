'use client'

import { useBrokers } from '@/hooks/useBrokers'
import { BrokerCard } from './BrokerCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter, useSearchParams } from 'next/navigation'
import { Handshake } from 'lucide-react'

function BrokerCardSkeleton() {
  return (
    <div className="bg-[#111827] border border-white/8 rounded-sm overflow-hidden">
      <Skeleton className="h-40 w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}

export function BrokerList() {
  const { data, isLoading, error } = useBrokers()
  const router = useRouter()
  const searchParams = useSearchParams()

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/?${params.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => <BrokerCardSkeleton key={i} />)}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20 text-[#94a3b8]">
        Failed to load brokers. Please try again.
      </div>
    )
  }

  if (!data?.brokers?.length) {
    return (
      <div className="text-center py-20">
        <p className="text-[#94a3b8] text-lg">No brokers found matching your criteria</p>
        <p className="text-[#64748b] text-sm mt-2">Try adjusting your search or filter</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.brokers.map((broker: any, i: number) => (
          <BrokerCard key={broker.id} broker={broker} featured={i === 0} />
        ))}
        {/* CTA Card */}
        <div className="bg-[#111827] border border-dashed border-white/20 rounded-sm p-8 flex flex-col items-center justify-center gap-4 text-center">
          <Handshake size={40} className="text-[#4f9cf9]" />
          <div>
            <h3 className="font-display text-lg font-semibold text-[#f1f5f9]">Partner with Us</h3>
            <p className="text-sm text-[#94a3b8] mt-2">Are you an institutional broker? Join our exclusive network of providers.</p>
          </div>
          <button className="px-6 py-2 bg-[#4f9cf9] text-white text-sm rounded-sm hover:bg-[#2563eb] transition-colors">
            Inquire Now
          </button>
        </div>
      </div>

      {data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 text-sm rounded-sm transition-all ${
                p === data.page
                  ? 'bg-[#4f9cf9] text-white'
                  : 'border border-white/10 text-[#94a3b8] hover:border-white/20'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
