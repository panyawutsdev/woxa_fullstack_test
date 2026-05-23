import { Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { brokerService } from '../services/broker.service'

export const brokerController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const broker = await brokerService.create({ ...req.body, userId: req.user!.userId })
      res.status(201).json({ success: true, data: broker })
    } catch (err) {
      next(err)
    }
  },

  async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search, type, page, limit } = req.query
      const data = await brokerService.findAll(
        search as string | undefined,
        type as string | undefined,
        page ? Number(page) : 1,
        limit ? Number(limit) : 12,
      )
      res.json({ success: true, data })
    } catch (err) {
      next(err)
    }
  },

  async findBySlug(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const broker = await brokerService.findBySlug(req.params.slug)
      res.json({ success: true, data: broker })
    } catch (err) {
      next(err)
    }
  },
}
