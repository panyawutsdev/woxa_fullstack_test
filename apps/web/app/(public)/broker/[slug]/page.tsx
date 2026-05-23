import { notFound } from 'next/navigation'
import { ExternalLink, Download, Globe, MapPin, Mail, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

async function getBroker(slug: string) {
  const apiUrl = process.env.API_URL || 'http://localhost:4000'
  const res = await fetch(`${apiUrl}/api/brokers/${slug}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  const json = await res.json()
  return json.data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const broker = await getBroker(params.slug)
  if (!broker) return { title: 'Broker Not Found | Woxa' }
  return {
    title: `${broker.name} | Woxa Institutional Brokers`,
    description: broker.description.slice(0, 160),
    openGraph: {
      title: broker.name,
      description: broker.description.slice(0, 160),
      images: broker.logoUrl ? [broker.logoUrl] : [],
    },
  }
}

const TYPE_MOCK: Record<string, { forex: number; indices: number; commodities: number; equities: number; bonds: number; crypto: number }> = {
  cfd: { forex: 80, indices: 25, commodities: 18, equities: 4000, bonds: 0, crypto: 0 },
  bond: { forex: 0, indices: 0, commodities: 0, equities: 0, bonds: 12, crypto: 0 },
  stock: { forex: 0, indices: 15, commodities: 5, equities: 5000, bonds: 0, crypto: 0 },
  crypto: { forex: 0, indices: 0, commodities: 0, equities: 0, bonds: 0, crypto: 350 },
}

export default async function BrokerDetailPage({ params }: Props) {
  const broker = await getBroker(params.slug)
  if (!broker) notFound()

  const markets = TYPE_MOCK[broker.brokerType] || TYPE_MOCK.cfd

  return (
    <div>
      {/* Hero */}
      <div className="relative h-72 bg-[#0d1428] overflow-hidden">
        {broker.logoUrl && (
          <img src={broker.logoUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 border border-[#4f9cf9]/40 text-[#4f9cf9] rounded-sm uppercase tracking-widest">
              Institutional Grade
            </span>
            <span className="text-yellow-400 text-xs">★★★★★</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#f1f5f9]">{broker.name}</h1>
          <p className="text-[#94a3b8] mt-2 max-w-2xl">{broker.description.slice(0, 120)}</p>
          <div className="flex items-center gap-3 mt-6">
            <a
              href={broker.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4f9cf9] hover:bg-[#2563eb] text-white text-sm rounded-sm transition-colors"
            >
              <ExternalLink size={14} /> Visit Website
            </a>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 text-[#94a3b8] hover:text-[#f1f5f9] text-sm rounded-sm transition-colors">
              <Download size={14} /> Download Prospectus
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#f1f5f9] mb-4">The Sovereign Mandate</h2>
              <p className="text-[#94a3b8] leading-relaxed">{broker.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-[#111827] border border-white/8 rounded-sm space-y-2">
                <div className="text-[#4f9cf9]">🛡</div>
                <h3 className="font-semibold text-[#f1f5f9]">SEC & FCA Regulated</h3>
                <p className="text-sm text-[#94a3b8]">Operating under the strictest global mandates for transparency and capital reserve requirements.</p>
              </div>
              <div className="p-5 bg-[#111827] border border-white/8 rounded-sm space-y-2">
                <div className="text-[#4f9cf9]">⚡</div>
                <h3 className="font-semibold text-[#f1f5f9]">12ms Execution</h3>
                <p className="text-sm text-[#94a3b8]">Industry-leading throughput maintained by our proprietary Sterling Core engine.</p>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="p-5 bg-[#111827] border border-white/8 rounded-sm space-y-4">
              <h3 className="text-xs text-[#94a3b8] tracking-widest uppercase">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#64748b]">AUM GROWTH (YOY)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-emerald-400">+24.8%</span>
                    <div className="w-7 h-7 rounded bg-[#4f9cf9]/20 flex items-center justify-center">
                      <TrendingUp size={13} className="text-[#4f9cf9]" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-[#64748b]">LIQUIDITY ACCESS</span>
                  <span className="text-sm font-semibold text-[#f1f5f9]">$12.4B</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-[#64748b]">CLIENT RETENTION</span>
                  <span className="text-sm font-semibold text-[#f1f5f9]">98.2%</span>
                </div>
              </div>
              <button className="w-full text-xs text-center text-[#4f9cf9] hover:text-white border border-white/10 rounded-sm py-2 transition-colors">
                View Full Audit Report
              </button>
            </div>
            <div className="p-5 bg-[#111827] border border-white/8 rounded-sm space-y-3">
              <h3 className="text-xs text-[#94a3b8] tracking-widest uppercase">Contact & Details</h3>
              <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                <MapPin size={14} className="text-[#4f9cf9] shrink-0" />
                <span>One Canary Wharf, London, E14 5AB</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                <Mail size={14} className="text-[#4f9cf9] shrink-0" />
                <span>institutional@{broker.website.replace(/https?:\/\/(www\.)?/, '').split('/')[0]}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                <Globe size={14} className="text-[#4f9cf9] shrink-0" />
                <a href={broker.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#4f9cf9] transition-colors truncate">
                  {broker.website.replace('https://', '')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Available Markets */}
        <div className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-[#f1f5f9] mb-6">Available Markets</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {[
              { label: 'Forex Pairs', value: markets.forex },
              { label: 'Indices', value: markets.indices },
              { label: 'Commodities', value: markets.commodities },
              { label: 'Equities', value: markets.equities ? `${(markets.equities / 1000).toFixed(0)}K+` : '—' },
              { label: 'Bonds', value: markets.bonds || '—' },
              { label: 'Crypto', value: markets.crypto || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-4 bg-[#111827] border border-white/8 rounded-sm">
                <div className="font-display text-2xl font-bold text-[#f1f5f9]">{value}</div>
                <div className="text-xs text-[#64748b] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
