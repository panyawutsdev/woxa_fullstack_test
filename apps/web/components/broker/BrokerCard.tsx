import Link from 'next/link'
import { ArrowRight, Shield, Globe, Globe2, Database, BarChart2 } from 'lucide-react'

interface Broker {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string
  website: string
  brokerType: string
  createdAt: string
}

const TYPE_META: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  cfd: { icon: Shield, label: 'Tier 1 Licensed', color: 'text-blue-400' },
  bond: { icon: Globe, label: 'FCA Regulated', color: 'text-emerald-400' },
  stock: { icon: Globe2, label: 'Global Reach', color: 'text-purple-400' },
  crypto: { icon: Database, label: 'Cold Storage', color: 'text-orange-400' },
}

export function BrokerCard({ broker, featured }: { broker: Broker; featured?: boolean }) {
  const meta = TYPE_META[broker.brokerType] || { icon: BarChart2, label: broker.brokerType.toUpperCase(), color: 'text-[#94a3b8]' }
  const Icon = meta.icon

  return (
    <div className="group bg-[#111827] border border-white/8 rounded-sm overflow-hidden hover:border-white/16 transition-all duration-200 flex flex-col">
      <div className="h-44 relative overflow-hidden bg-[#1a2235]">
        {broker.logoUrl ? (
          <img
            src={broker.logoUrl}
            alt={broker.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
        {featured && (
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#0a0f1e]/80 border border-white/20 rounded-sm">
            <span className="text-xs text-[#94a3b8] tracking-widest uppercase">Premium Tier</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-[#f1f5f9] leading-tight">{broker.name}</h3>
          <p className="text-sm text-[#94a3b8] mt-1 line-clamp-2">{broker.description}</p>
        </div>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className={`flex items-center gap-1.5 ${meta.color}`}>
            <Icon size={12} />
            <span className="text-xs tracking-widest uppercase">{meta.label}</span>
          </div>
          <Link
            href={`/broker/${broker.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-[#4f9cf9] hover:text-white transition-colors group/link"
          >
            View Details
            <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
