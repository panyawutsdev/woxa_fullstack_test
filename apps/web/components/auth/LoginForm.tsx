'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AtSign, Lock } from 'lucide-react'
import { loginSchema, type LoginInput } from '@/lib/schemas'
import { api } from '@/lib/api'
import { authLib } from '@/lib/auth'

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/api/login', data)
      const { token, user } = res.data.data
      authLib.setToken(token)
      authLib.setUser(user)
      router.push('/create')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-xs text-[#94a3b8] tracking-widest uppercase">Institutional Email</label>
        <div className="relative">
          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" size={16} />
          <input
            {...register('email')}
            type="email"
            placeholder="user@institution.com"
            className="w-full h-10 pl-9 pr-4 bg-[#1a2235] border border-white/10 rounded-sm text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#4f9cf9] transition-colors text-sm"
          />
        </div>
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs text-[#94a3b8] tracking-widest uppercase">Security Password</label>
          <span className="text-xs text-[#64748b] cursor-default hover:text-[#94a3b8] tracking-widest uppercase">Forgot Credentials?</span>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" size={16} />
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full h-10 pl-9 pr-10 bg-[#1a2235] border border-white/10 rounded-sm text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#4f9cf9] transition-colors text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#94a3b8]"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
      </div>

      {error && (
        <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-sm">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-[#4f9cf9] hover:bg-[#2563eb] text-white text-sm tracking-widest uppercase rounded-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Authenticating...' : 'Login'}
      </button>
    </form>
  )
}
