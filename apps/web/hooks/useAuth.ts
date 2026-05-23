'use client'

import { useState, useEffect } from 'react'
import { authLib } from '@/lib/auth'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ id: string; email: string; fullName: string } | null>(null)

  useEffect(() => {
    setIsAuthenticated(authLib.isAuthenticated())
    setUser(authLib.getUser())
  }, [])

  const logout = () => {
    authLib.clear()
    setIsAuthenticated(false)
    setUser(null)
    window.location.href = '/'
  }

  return { isAuthenticated, user, logout }
}
