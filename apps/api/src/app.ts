import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.routes'
import brokerRoutes from './routes/broker.routes'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

if (process.env.NODE_ENV !== 'test') {
  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 })
  app.use('/api', limiter)
  app.use('/api/login', authLimiter)
  app.use('/api/register', authLimiter)
}

app.use('/api', authRoutes)
app.use('/api', brokerRoutes)

app.use(errorHandler)

export default app
