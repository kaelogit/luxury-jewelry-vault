'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X, User, Search } from 'lucide-react'
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
      {/* I. ANNOUNCEMENT BAR (The Auvere Header) */}
      <div className="fixed top-0 w-full z-[110] bg-obsidian-900 py-2 px-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
          Complimentary Insured Shipping on all Orders
        </p>
      </div>

      <nav className={`fixed top-9 w-full z-[100] transition-all duration-500 px-6 md:px-12 ${
        isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-ivory-300 py-3 shadow-sm' 
        : 'bg-transparent py-6'
      }`}>
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between relative">
          
          {/* LEFT: NAV LINKS (Desktop) / HAMBURGER (Mobile) */}
          <div className="flex items-center gap-8 flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-obsidian-900 hover:text-gold transition-colors"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
            
            <div className="hidden lg:flex items-center gap-8">
              <NavLink href="/collection" label="Shop All" />
              <NavLink href="/collection?cat=watches" label="Watches" />
              <NavLink href="/collection?cat=jewelry" label="Jewelry" />
            </div>
          </div>

          {/* CENTER: LOGO (The Masthead) */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <h1 className="text-xl md:text-2xl font-medium tracking-tight text-obsidian-900 uppercase font-serif italic">
                Lume <span className="text-gold not-italic">Vault</span>
              </h1>
            </Link>
          </div>

          {/* RIGHT: UTILITIES */}
          <div className="flex items-center justify-end gap-6 md:gap-8 flex-1">
            <button className="hidden sm:block text-obsidian-900 hover:text-gold transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>

            <Link href="/dashboard" className="text-obsidian-900 hover:text-gold transition-colors">
              <User size={20} strokeWidth={1.5} />
            </Link>

            <button onClick={openSelectionDrawer} className="relative group p-1">
              <ShoppingBag size={20} strokeWidth={1.5} className="text-obsidian-900 group-hover:text-gold transition-colors" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full flex items-center justify-center border border-white"
                  >
                    <span className="text-[8px] font-bold text-white">{itemCount}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* II. FULL-SCREEN MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="fixed inset-0 z-[120] bg-white flex flex-col pt-24 px-10"
          >
            <div className="flex justify-between items-center mb-12">
               <h2 className="label-caps text-obsidian-400">Navigation</h2>
               <button onClick={() => setIsMobileMenuOpen(false)}>
                 <X size={32} strokeWidth={1} className="text-obsidian-900" />
               </button>
            </div>

            <div className="flex flex-col gap-8">
              <MobileNavLink href="/collection" label="New Arrivals" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink href="/collection?cat=watches" label="Timepieces" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink href="/collection?cat=jewelry" label="Fine Jewelry" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink href="/concierge" label="Bespoke Service" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink href="/track" label="Track Order" onClick={() => setIsMobileMenuOpen(false)} />
            </div>

            <div className="mt-auto pb-12 space-y-4">
              <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-5 border border-ivory-300 text-center text-xs font-bold uppercase tracking-widest text-obsidian-900 rounded-lg">
                Log In
              </Link>
              <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-5 bg-obsidian-900 text-white text-center text-xs font-bold uppercase tracking-widest rounded-lg shadow-lg">
                Create Account
              </Link>
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
    <Link href={href} className="text-[11px] font-bold uppercase tracking-[0.2em] text-obsidian-900 hover:text-gold transition-all relative group py-1">
      {label}
      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
    </Link>
  )
}

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="text-5xl font-serif italic text-obsidian-900 tracking-tight hover:text-gold transition-colors block">
      {label}
    </Link>
  )
}