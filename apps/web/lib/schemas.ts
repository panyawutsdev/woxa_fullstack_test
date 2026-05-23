import { z } from 'zod'

export const BROKER_TYPES = ['cfd', 'bond', 'stock', 'crypto'] as const

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Minimum 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
  agreement: z.boolean().refine(v => v === true, 'You must agree to proceed'),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const createBrokerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lowercase alphanumeric with hyphens only'),
  description: z.string().min(1, 'Description is required'),
  logo_url: z.string().url('Must be a valid URL').startsWith('https://', 'Must use HTTPS'),
  website: z.string().url('Must be a valid URL').startsWith('https://', 'Must use HTTPS'),
  broker_type: z.enum(BROKER_TYPES, { errorMap: () => ({ message: 'Select a broker type' }) }),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CreateBrokerInput = z.infer<typeof createBrokerSchema>
