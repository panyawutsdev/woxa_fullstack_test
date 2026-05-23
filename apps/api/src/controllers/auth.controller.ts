import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.register(req.body)
      res.status(201).json({ success: true, data: { message: 'Account created. Please log in.' } })
    } catch (err) {
      next(err)
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.login(req.body.email, req.body.password)
      res.json({ success: true, data })
    } catch (err) {
      next(err)
    }
  },
}
