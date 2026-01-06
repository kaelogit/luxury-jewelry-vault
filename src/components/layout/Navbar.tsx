'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X, ShieldCheck, Fingerprint, User } from 'lucide-react'
import SelectionDrawer from '../ui/SelectionDrawer'
import { useUIStore } from '@/store/useUIStore'
import { useSelectionStore } from '@/store/useSelectionStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const { isSelectionDrawerOpen, openSelectionDrawer, closeSelectionDrawer } = useUIStore()
  const items = useSelectionStore((state) => state.items)
  const itemCount = items.length

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-1000 px-6 py-6 md:px-12 ${
        isScrolled 
        ? 'bg-white/80 backdrop-blur-2xl border-b border-ivory-300 py-4 shadow-sm' 
        : 'bg-transparent'
      }`}>
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          
          {/* I. BRAND IDENTITY: The Editorial Masthead */}
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="group">
            <h1 className="text-lg md:text-xl font-light tracking-tighter text-obsidian-900 italic uppercase">
              Lume <span className="text-obsidian-400">Vault<span className="text-gold">.</span></span>
            </h1>
          </Link>

          {/* II. DESKTOP REGISTRY: Institutional Links */}
          <div className="hidden lg:flex items-center gap-12">
            <NavLink href="/collection" label="Collection" />
            <NavLink href="/protocol/tracking" label="Logistics" />
            <NavLink href="/concierge" label="Concierge" />
          </div>

          {/* III. AUTH & VAULT UTILITIES */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8 border-r border-ivory-300 pr-10">
              <Link href="/auth/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-obsidian-300 hover:text-gold transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup" className="px-6 py-3 bg-obsidian-900 text-gold text-[10px] font-black uppercase tracking-[0.4em] rounded-xl hover:bg-gold hover:text-white transition-all shadow-xl active:scale-95">
                Join Vault
              </Link>
            </div>

            {/* SELECTION TRIGGER */}
            <button onClick={openSelectionDrawer} className="relative group p-2">
              <ShoppingBag size={20} className="text-obsidian-900 group-hover:text-gold transition-colors" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    exit={{ scale: 0 }}
                    className="absolute top-0 right-0 w-4 h-4 bg-gold rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                  >
                    <span className="text-[8px] font-black text-white">{itemCount}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* IV. MOBILE INTERFACE ACCESS */}
          <div className="flex items-center gap-6 lg:hidden">
            <button onClick={openSelectionDrawer} className="relative text-obsidian-900">
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full border-2 border-white" />
              )}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-obsidian-900">
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* V. MOBILE SOVEREIGN OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[95] bg-white/98 backdrop-blur-3xl flex flex-col pt-32 px-10 lg:hidden"
          >
            <div className="flex flex-col gap-10">
              <MobileNavLink href="/collection" label="The Collection" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink href="/protocol/tracking" label="Logistics Registry" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink href="/concierge" label="Concierge Desk" onClick={() => setIsMobileMenuOpen(false)} />
            </div>

            <div className="mt-16 flex flex-col gap-4">
              <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-6 border border-ivory-300 text-center text-[10px] font-black uppercase tracking-[0.4em] text-obsidian-900 rounded-[2rem]">
                Sign In
              </Link>
              <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-6 bg-obsidian-900 text-gold text-center text-[10px] font-black uppercase tracking-[0.4em] rounded-[2rem] shadow-2xl">
                Open Private Vault
              </Link>
            </div>

            <div className="mt-auto pb-12 border-t border-ivory-100 pt-8 flex items-center justify-between">
              <div className="flex items-center gap-3 text-gold">
                <Fingerprint size={16} />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] italic leading-none">Protocol Secure</span>
              </div>
              <span className="text-[8px] font-mono text-obsidian-300">NODE_V.06</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SelectionDrawer isOpen={isSelectionDrawerOpen} onClose={closeSelectionDrawer} />
    </>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-[10px] font-black uppercase tracking-[0.5em] text-obsidian-300 hover:text-gold transition-all relative group py-2 italic">
      {label}
      <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-gold transition-all duration-500 group-hover:w-full" />
    </Link>
  )
}

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="text-4xl font-light italic text-obsidian-900 tracking-tighter hover:text-gold transition-colors block border-l-2 border-gold/20 pl-6 leading-none">
      {label}
    </Link>
  )
}