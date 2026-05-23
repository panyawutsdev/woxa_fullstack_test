const TOKEN_KEY = 'woxa_token'
const USER_KEY = 'woxa_user'

export const authLib = {
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
  },
  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
  },
  setUser(user: object) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  getUser() {
    if (typeof window === 'undefined') return null
    const u = localStorage.getItem(USER_KEY)
    return u ? JSON.parse(u) : null
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`
  },
  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
