'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Bell, User, LogOut } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-sm border-b border-white/5 bg-[#0a0f1e]/90">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold text-[#f1f5f9] tracking-tight shrink-0">
          Woxa
        </Link>
        <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="text-sm text-[#f1f5f9] border-b border-[#4f9cf9] pb-0.5">
            Brokers
          </Link>
          <span className="text-sm text-[#64748b] cursor-default">Markets</span>
          <span className="text-sm text-[#64748b] cursor-default">Analysis</span>
          <span className="text-sm text-[#64748b] cursor-default">Education</span>
        </div>
        <div className="flex items-center gap-3">
          <button aria-label="Notifications" className="text-[#94a3b8] hover:text-[#f1f5f9] transition-colors">
            <Bell size={18} />
          </button>
          {isAuthenticated ? (
            <div className="relative">
              <button
                aria-label="Account menu"
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
              >
                <User size={18} />
              </button>
              {showDropdown && (
                <div className="absolute right-0 top-8 w-48 bg-[#111827] border border-white/10 rounded-sm shadow-xl py-1">
                  <div className="px-3 py-2 text-xs text-[#64748b] border-b border-white/5">
                    {user?.email}
                  </div>
                  <button
                    onClick={() => { setShowDropdown(false); logout() }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-white/5 transition-colors"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-sm text-[#4f9cf9] hover:text-white transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
