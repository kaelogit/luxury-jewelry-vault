'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ShoppingBag, Menu, X, User, Search, ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import SelectionDrawer from '../ui/SelectionDrawer'
import { useUIStore } from '@/store/useUIStore'
import { useSelectionStore } from '@/store/useSelectionStore'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'

function NavbarContent() {
  const supabase = createClient()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [user, setUser] = useState<any>(null)

  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const { isSelectionDrawerOpen, openSelectionDrawer, closeSelectionDrawer } = useUIStore()
  const items = useSelectionStore((state) => state.items)
  const itemCount = items.length

  const closeAll = () => {
    setIsMobileMenuOpen(false)
    setIsShopOpen(false)
    setIsSearchOpen(false)
    setIsMobileShopOpen(false)
  }

  useEffect(() => {
    closeAll()
  }, [pathname, searchParams])

  // AUTH STATE SYNC
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // SEARCH LOGIC
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true)
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, category, images, slug')
          .ilike('name', `%${searchQuery}%`)
          .limit(5)
        
        if (!error) setSearchResults(data || [])
        setIsSearching(false)
      } else {
        setSearchResults([])
      }
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, supabase])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <>
      <header className="fixed top-0 w-full z-[100] bg-white border-b border-gray-100 font-sans">
        
        {/* I. ANNOUNCEMENT BAR */}
        <div className="bg-obsidian-900 py-2.5 overflow-hidden border-b border-gold/10 relative">
          <div className="flex whitespace-nowrap min-w-full">
            <div className="flex animate-marquee shrink-0">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="text-[9px] font-bold uppercase tracking-[0.4em] text-gold px-10">
                  Complimentary Global Shipping & Returns
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* II. MAIN NAVIGATION */}
        <nav className="max-w-screen-2xl mx-auto px-4 md:px-10 h-16 md:h-20 flex items-center justify-between relative lg:overflow-visible overflow-hidden">
          
          {/* LOGO */}
          <div className="flex-1 min-w-0 flex items-center z-20 pointer-events-none">
            <Link href="/" onClick={closeAll} className="inline-block group max-w-full pointer-events-auto">
              <h1 
                style={{ fontSize: 'clamp(14px, 4.5vw, 24px)', lineHeight: '0.9' }}
                className="font-medium tracking-[0.05em] sm:tracking-tighter text-obsidian-900 uppercase font-serif italic transition-all duration-500 flex flex-col items-center sm:flex-row sm:items-baseline sm:leading-none"
              >
                <span>Lume</span>
                <span className="text-gold group-hover:text-black transition-all duration-500 block text-[0.35em] tracking-[0.9em] pl-[0.9em] mt-0 not-italic font-sans font-light opacity-80 sm:inline sm:text-[1em] sm:tracking-normal sm:pl-0 sm:ml-2 sm:mt-0 sm:italic sm:font-serif sm:font-medium sm:opacity-100">
                  Vault
                </span>
              </h1>
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 h-full z-30 pointer-events-auto">
            <div 
              className="relative h-full flex items-center group cursor-pointer"
              onMouseEnter={() => setIsShopOpen(true)}
              onMouseLeave={() => setIsShopOpen(false)}
            >
              <Link 
                href="/collection"
                onClick={closeAll}
                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                  isShopOpen ? 'text-gold' : 'text-obsidian-900 hover:text-gold'
                }`}
              >
                Collection <ChevronDown size={12} className={`transition-transform duration-300 ${isShopOpen ? 'rotate-180' : ''}`} />
              </Link>

              <AnimatePresence>
                {isShopOpen && (
                  <>
                    <div className="absolute top-full left-0 w-full h-4 bg-transparent" />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute top-[100%] -left-48 w-[600px] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-b-3xl p-10 grid grid-cols-2 gap-12 pointer-events-auto"
                    >
                      <div className="space-y-6">
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gold border-b border-gray-100 pb-2">Categories</p>
                        <div className="flex flex-col gap-4">
                          <DropdownLink onClick={closeAll} href="/collection" title="View All" />
                          <DropdownLink onClick={closeAll} href="/collection?cat=watches" title="Timepieces" />
                          <DropdownLink onClick={closeAll} href="/collection?cat=diamonds" title="Diamonds" />
                          <DropdownLink onClick={closeAll} href="/collection?cat=gold" title="Gold Bullion" />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gold border-b border-gray-100 pb-2">Services</p>
                        <div className="flex flex-col gap-4">
                          <DropdownLink onClick={closeAll} href="/dashboard" title="Client Dashboard" />
                          <DropdownLink onClick={closeAll} href="/track" title="Track Order" />
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <NavLink onClick={closeAll} href="/story" label="About" />
            <NavLink onClick={closeAll} href="/contact" label="Contact" />
          </div>

          {/* RIGHT UTILITIES */}
          <div className="flex-none flex items-center justify-end gap-2 md:gap-6 shrink-0 z-20 bg-white/80 backdrop-blur-md ml-auto pointer-events-none">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-obsidian-900 hover:text-gold transition-colors pointer-events-auto">
              {isSearchOpen ? <X size={18} strokeWidth={1.5} /> : <Search size={18} strokeWidth={1.5} />}
            </button>

            <Link href="/dashboard" onClick={closeAll} className="hidden lg:block p-2 text-obsidian-900 hover:text-gold transition-colors pointer-events-auto">
              <User size={18} strokeWidth={1.5} />
            </Link>

            <button onClick={openSelectionDrawer} className="relative p-2 group pointer-events-auto">
              <ShoppingBag size={18} strokeWidth={1.5} className="text-obsidian-900 group-hover:text-gold transition-colors" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-gold rounded-full flex items-center justify-center text-[7px] font-bold text-white leading-none">
                  {itemCount}
                </span>
              )}
            </button>

            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-obsidian-900 hover:text-gold transition-colors pointer-events-auto">
              <Menu size={20} strokeWidth={1.2} />
            </button>
          </div>
        </nav>

        {/* III. SEARCH BAR */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="w-full bg-white border-t border-gray-100 overflow-hidden">
              <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="relative">
                  <input autoFocus type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search collection..." className="w-full bg-transparent text-2xl md:text-3xl font-serif italic text-obsidian-900 placeholder:text-gray-300 focus:outline-none pb-4 border-b border-gray-200" />
                  {isSearching ? <Loader2 size={24} className="absolute right-0 top-2 text-gold animate-spin" /> : <Search size={24} className="absolute right-0 top-2 text-gold opacity-50" />}
                </div>
                
                {searchResults.length > 0 && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {searchResults.map((product) => (
                      <Link key={product.id} href={`/product/${product.slug}`} onClick={closeAll} className="flex gap-4 items-center group">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                          {product.images?.[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gold uppercase">{product.category}</p>
                          <h4 className="text-xs font-bold text-black group-hover:text-gold transition-colors uppercase">{product.name}</h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* IV. MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeAll} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[120] flex flex-col shadow-2xl">
              <div className="p-6 flex justify-between items-center border-b border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Menu</p>
                <button onClick={closeAll} className="p-2 text-gray-400 hover:text-black transition-colors"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                <div className="space-y-4">
                  <button onClick={() => setIsMobileShopOpen(!isMobileShopOpen)} className="w-full flex justify-between items-center text-2xl font-serif italic text-obsidian-900">
                    Collections <ChevronRight size={20} className={`transition-transform ${isMobileShopOpen ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isMobileShopOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4 flex flex-col gap-5 border-l border-gold/20">
                        <MobileSubLink onClick={closeAll} href="/collection" label="View All" />
                        <MobileSubLink onClick={closeAll} href="/collection?cat=watches" label="Timepieces" />
                        <MobileSubLink onClick={closeAll} href="/collection?cat=diamonds" label="Diamonds" />
                        <MobileSubLink onClick={closeAll} href="/collection?cat=gold" label="Gold Bullion" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="flex flex-col gap-6">
                    <Link href="/story" onClick={closeAll} className="text-xl font-serif italic text-obsidian-900">About</Link>
                    <Link href="/contact" onClick={closeAll} className="text-xl font-serif italic text-obsidian-900">Contact</Link>
                </div>

                <div className="pt-10 border-t border-gray-100">
                    <Link href="/dashboard" onClick={closeAll} className="text-sm font-bold uppercase tracking-widest text-black flex items-center gap-3">
                        <User size={18} /> Account Access
                    </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SelectionDrawer isOpen={isSelectionDrawerOpen} onClose={closeSelectionDrawer} />
    </>
  )
}

// Suspense Wrapper for Search Params
export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-20 bg-white border-b border-gray-100" />}>
      <NavbarContent />
    </Suspense>
  )
}

/** HELPER COMPONENTS */

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="text-[10px] font-bold uppercase tracking-[0.2em] text-obsidian-900 hover:text-gold transition-colors">
      {label}
    </Link>
  )
}

function DropdownLink({ href, title, onClick }: { href: string; title: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="group block">
      <p className="text-[11px] font-bold uppercase tracking-widest text-obsidian-900 group-hover:text-gold transition-colors">{title}</p>
    </Link>
  )
}

function MobileSubLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-gold py-1">
      {label}
    </Link>
  )
}