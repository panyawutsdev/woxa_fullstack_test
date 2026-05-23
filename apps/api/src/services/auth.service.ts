import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

const SALT_ROUNDS = 12

export const authService = {
  async register(data: { fullName: string; email: string; password: string }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) throw { status: 409, message: 'Email already in use' }
    const hashed = await bcrypt.hash(data.password, SALT_ROUNDS)
    return prisma.user.create({
      data: { fullName: data.fullName, email: data.email, password: hashed },
      select: { id: true, email: true, fullName: true },
    })
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findFirst({ where: { email, deletedAt: null } })
    if (!user) throw { status: 401, message: 'Invalid credentials' }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw { status: 401, message: 'Invalid credentials' }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
    return { token, user: { id: user.id, email: user.email, fullName: user.fullName } }
  },
}
