import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata = { title: 'Register | Woxa Institutional Onboarding' }

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80)' }}
        />
        <div className="absolute inset-0 bg-[#0a0f1e]/80" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#94a3b8] mb-16">
            <span className="text-lg">⊕</span>
            <span className="text-sm tracking-widest uppercase">Sovereign Ledger</span>
          </div>
          <div>
            <h2 className="font-display text-4xl font-bold text-[#f1f5f9] leading-tight">
              Secure Your Entry into the Sovereign Ledger
            </h2>
            <p className="text-[#94a3b8] mt-4 text-sm leading-relaxed">
              Access the definitive institutional terminal for global capital management and verified digital asset custody of sovereign entities and elite financial brokers.
            </p>
          </div>
          <div className="flex gap-8 mt-12">
            <div>
              <div className="font-display text-2xl font-bold text-[#f1f5f9]">12.4T</div>
              <div className="text-xs text-[#64748b] mt-1 tracking-wider uppercase">Managed Capital</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-[#f1f5f9]">99.9%</div>
              <div className="text-xs text-[#64748b] mt-1 tracking-wider uppercase">Uptime SLA</div>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex gap-6">
          {['AES-256 Encrypted', 'GDPR Compliant', 'SEC Framework'].map(t => (
            <span key={t} className="text-xs text-[#64748b] tracking-widest uppercase">{t}</span>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0d1428]">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-[#f1f5f9]">Institutional Onboarding</h2>
            <p className="text-sm text-[#94a3b8] mt-2">Complete your verification credentials to access the terminal.</p>
          </div>

          <RegisterForm />

          <p className="text-center text-xs text-[#64748b] mt-6">
            Already verified?{' '}
            <Link href="/login" className="text-[#4f9cf9] hover:text-white transition-colors">
              Institutional Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
