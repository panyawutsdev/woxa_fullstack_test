import { Router } from 'express'
import { brokerController } from '../controllers/broker.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { createBrokerSchema } from '../schemas/broker.schema'

const router = Router()

router.post('/brokers', authenticate, validate(createBrokerSchema), brokerController.create)
router.get('/brokers', brokerController.findAll)
router.get('/brokers/:slug', brokerController.findBySlug)

export default router
