export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0f1e] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display text-sm font-bold text-[#f1f5f9]">Woxa</span>
        <div className="flex items-center gap-6">
          {['Privacy Policy', 'Terms of Service', 'Risk Disclosure', 'Contact'].map(item => (
            <span key={item} className="text-xs text-[#64748b] cursor-default hover:text-[#94a3b8] transition-colors">
              {item}
            </span>
          ))}
        </div>
        <span className="text-xs text-[#64748b]">© 2024 Sterling Midnight. All rights reserved.</span>
      </div>
    </footer>
  )
}
