'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrokerSchema, type CreateBrokerInput } from '@/lib/schemas'
import { api } from '@/lib/api'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function BrokerForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateBrokerInput>({
    resolver: zodResolver(createBrokerSchema),
  })

  const name = watch('name')
  const brokerType = watch('broker_type')

  useEffect(() => {
    if (name) {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      setValue('slug', slug, { shouldValidate: false })
    }
  }, [name, setValue])

  const onSubmit = async (data: CreateBrokerInput) => {
    setLoading(true)
    setError('')
    try {
      await api.post('/api/brokers', data)
      router.push('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit broker. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = "w-full h-10 px-3 bg-[#1a2235] border border-white/10 rounded-sm text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#4f9cf9] transition-colors text-sm"
  const labelClass = "text-xs text-[#94a3b8] tracking-widest uppercase"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className={labelClass}>Broker Name</label>
          <input {...register('name')} placeholder="e.g. Blackwood Capital Markets" className={fieldClass} />
          {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Slug</label>
          <input {...register('slug')} placeholder="blackwood-capital-markets" className={fieldClass} />
          {errors.slug && <p className="text-xs text-red-400">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Broker Type</label>
        <Select onValueChange={(val) => setValue('broker_type', val as any, { shouldValidate: true })} value={brokerType}>
          <SelectTrigger>
            <SelectValue placeholder="Select broker type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cfd">CFD</SelectItem>
            <SelectItem value="bond">Bond</SelectItem>
            <SelectItem value="stock">Stock</SelectItem>
            <SelectItem value="crypto">Crypto</SelectItem>
          </SelectContent>
        </Select>
        {errors.broker_type && <p className="text-xs text-red-400">{errors.broker_type.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className={labelClass}>Logo URL</label>
          <input {...register('logo_url')} placeholder="https://example.com/logo.png" className={fieldClass} />
          {errors.logo_url && <p className="text-xs text-red-400">{errors.logo_url.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Website</label>
          <input {...register('website')} placeholder="https://broker-site.com" className={fieldClass} />
          {errors.website && <p className="text-xs text-red-400">{errors.website.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Broker Description</label>
        <textarea
          {...register('description')}
          placeholder="Provide a comprehensive institutional overview..."
          rows={5}
          className="w-full px-3 py-2 bg-[#1a2235] border border-white/10 rounded-sm text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#4f9cf9] transition-colors text-sm resize-none"
        />
        {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
      </div>

      {error && (
        <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-sm">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="px-6 h-10 text-sm text-[#94a3b8] border border-white/10 rounded-sm hover:text-[#f1f5f9] hover:border-white/20 transition-colors tracking-wider"
        >
          Discard Draft
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 h-10 bg-[#4f9cf9] hover:bg-[#2563eb] text-white text-sm rounded-sm transition-colors disabled:opacity-60 tracking-wider"
        >
          {loading ? 'Submitting...' : 'Submit Application →'}
        </button>
      </div>
    </form>
  )
}
