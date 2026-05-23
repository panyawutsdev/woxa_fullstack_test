import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata = { title: 'Login | Woxa Institutional Terminal' }

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80)' }}
      />
      <div className="absolute inset-0 bg-[#0a0f1e]/85" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div className="bg-[#0d1428]/90 border border-white/10 rounded-sm p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-[#f1f5f9]">Sterling Midnight</h1>
            <p className="text-xs text-[#64748b] tracking-widest mt-1 uppercase">Institutional Terminal</p>
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-6" />
            <h2 className="text-xl font-semibold text-[#f1f5f9] mt-4">Secure Verification</h2>
            <p className="text-xs text-[#64748b] mt-1">Access the Sovereign Ledger with your verified credentials.</p>
          </div>

          <LoginForm />

          <p className="text-center text-xs text-[#64748b] mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#4f9cf9] hover:text-white transition-colors">
              Register
            </Link>
          </p>

          <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-[#64748b]">
              <span className="text-xs">🔒</span>
              <span className="text-xs tracking-widest uppercase">TLS 1.3 Encryption</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#64748b]">
              <span className="text-xs">🪪</span>
              <span className="text-xs tracking-widest uppercase">Biometric Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
