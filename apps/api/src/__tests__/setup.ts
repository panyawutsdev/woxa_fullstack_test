import { prisma } from '../lib/prisma'
import { beforeEach, afterAll } from 'vitest'

beforeEach(async () => {
  await prisma.$transaction([
    prisma.broker.deleteMany(),
    prisma.user.deleteMany(),
  ])
})

afterAll(async () => {
  await prisma.$transaction([
    prisma.broker.deleteMany(),
    prisma.user.deleteMany(),
  ])
  await prisma.$disconnect()
})
