'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { registerSchema, type RegisterInput } from '@/lib/schemas'
import { api } from '@/lib/api'

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true)
    setError('')
    try {
      await api.post('/api/register', {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      router.push('/login')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs text-[#94a3b8] tracking-widest uppercase">Full Name</label>
        <input
          {...register('fullName')}
          type="text"
          placeholder="Alexander Sterling"
          className="w-full h-10 px-3 bg-[#1a2235] border border-white/10 rounded-sm text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#4f9cf9] transition-colors text-sm"
        />
        {errors.fullName && <p className="text-xs text-red-400">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-[#94a3b8] tracking-widest uppercase">Institutional Email</label>
        <input
          {...register('email')}
          type="email"
          placeholder="verification@reserve.int"
          className="w-full h-10 px-3 bg-[#1a2235] border border-white/10 rounded-sm text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#4f9cf9] transition-colors text-sm"
        />
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-[#94a3b8] tracking-widest uppercase">Security Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full h-10 pl-3 pr-9 bg-[#1a2235] border border-white/10 rounded-sm text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#4f9cf9] transition-colors text-sm"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b]">
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-[#94a3b8] tracking-widest uppercase">Confirm Password</label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full h-10 pl-3 pr-9 bg-[#1a2235] border border-white/10 rounded-sm text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#4f9cf9] transition-colors text-sm"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b]">
              {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <div className="flex items-start gap-3">
        <input
          {...register('agreement')}
          type="checkbox"
          id="agreement"
          className="mt-0.5 accent-[#4f9cf9]"
        />
        <label htmlFor="agreement" className="text-xs text-[#94a3b8] leading-relaxed cursor-pointer">
          I acknowledge that I am authorized to represent this entity and agree to the{' '}
          <span className="text-[#4f9cf9] hover:text-white transition-colors cursor-pointer">Institutional Master Service Agreement</span>
          {' '}and{' '}
          <span className="text-[#4f9cf9] hover:text-white transition-colors cursor-pointer">Privacy Protocols</span>.
        </label>
      </div>
      {errors.agreement && <p className="text-xs text-red-400">{errors.agreement.message}</p>}

      {error && (
        <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-sm">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-[#4f9cf9] hover:bg-[#2563eb] text-white text-sm tracking-widest uppercase rounded-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? 'Initializing...' : 'Initialize Registration →'}
      </button>
    </form>
  )
}
