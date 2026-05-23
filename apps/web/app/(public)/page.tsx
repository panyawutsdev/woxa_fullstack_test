import { Suspense } from 'react'
import { BrokerFilters } from '@/components/broker/BrokerFilters'
import { BrokerList } from '@/components/broker/BrokerList'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="font-display text-5xl font-bold text-[#f1f5f9] leading-tight">
          Institutional Brokers
        </h1>
        <p className="text-[#94a3b8] mt-3 max-w-xl">
          Access global liquidity through our curated network of elite financial institutions and market makers.
        </p>
      </div>
      <div className="mb-8">
        <Suspense>
          <BrokerFilters />
        </Suspense>
      </div>
      <Suspense>
        <BrokerList />
      </Suspense>
    </div>
  )
}
