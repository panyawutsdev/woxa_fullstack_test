import { prisma } from '../lib/prisma'
import { BrokerType } from '@prisma/client'
import { BROKER_TYPES } from '../schemas/broker.schema'

export const brokerService = {
  async create(data: {
    name: string; slug: string; description: string
    logo_url: string; website: string; broker_type: string; userId: string
  }) {
    const existing = await prisma.broker.findUnique({ where: { slug: data.slug } })
    if (existing) throw { status: 409, message: 'Slug already in use' }
    return prisma.broker.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        logoUrl: data.logo_url,
        website: data.website,
        brokerType: data.broker_type as BrokerType,
        userId: data.userId,
      },
    })
  },

  async findAll(search?: string, type?: string, page = 1, limit = 12) {
    const safeLimit = Math.min(limit, 50)
    const where = {
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
      ...(type && BROKER_TYPES.includes(type as any) && { brokerType: type as BrokerType }),
    }
    const [brokers, total] = await Promise.all([
      prisma.broker.findMany({
        where,
        skip: (page - 1) * safeLimit,
        take: safeLimit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.broker.count({ where }),
    ])
    return { brokers, total, page, limit: safeLimit, totalPages: Math.ceil(total / safeLimit) }
  },

  async findBySlug(slug: string) {
    const broker = await prisma.broker.findUnique({ where: { slug } })
    if (!broker) throw { status: 404, message: 'Broker not found' }
    return broker
  },
}
