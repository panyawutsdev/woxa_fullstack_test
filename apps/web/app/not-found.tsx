import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="font-display text-7xl font-bold text-[#1a2235]">404</h1>
        <h2 className="font-display text-2xl font-semibold text-[#f1f5f9] mt-2">Page Not Found</h2>
        <p className="text-[#94a3b8] mt-2 max-w-sm text-sm">The institutional record you are looking for does not exist or has been removed.</p>
      </div>
      <Link href="/" className="px-6 py-2.5 bg-[#4f9cf9] hover:bg-[#2563eb] text-white text-sm rounded-sm transition-colors">
        Return to Broker Directory
      </Link>
    </div>
  )
}
