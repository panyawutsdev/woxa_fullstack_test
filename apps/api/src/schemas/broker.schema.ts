import { z } from 'zod'

export const BROKER_TYPES = ['cfd', 'bond', 'stock', 'crypto'] as const

export const createBrokerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens only'),
  description: z.string().min(1, 'Description is required'),
  logo_url: z.string().url('Must be a valid URL').startsWith('https://', 'Must use HTTPS'),
  website: z.string().url('Must be a valid URL').startsWith('https://', 'Must use HTTPS'),
  broker_type: z.enum(BROKER_TYPES, {
    errorMap: () => ({ message: 'Must be one of: cfd, bond, stock, crypto' }),
  }),
})

export type CreateBrokerInput = z.infer<typeof createBrokerSchema>
