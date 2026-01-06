'use client'

import React from 'react'
import { X, ShoppingBag, ShieldCheck, ArrowRight, Trash2, Fingerprint } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelectionStore } from '@/store/useSelectionStore'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SelectionDrawer({ isOpen, onClose }: Props) {
  const { items, removeItem, getTotalPrice } = useSelectionStore()
  const totalPrice = getTotalPrice()

  // Responsive Drawer Variants
  const drawerVariants = {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* I. BLUR HANDSHAKE: Dimming the background */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-obsidian-900/40 backdrop-blur-md z-[200]"
          />

          {/* II. THE VAULT MANIFEST: Slide-out UI */}
          <motion.div
            variants={drawerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[550px] bg-white z-[201] shadow-2xl border-l border-ivory-300 flex flex-col"
          >
            <div className="flex flex-col h-full p-10 md:p-14">
              
              {/* Header: Registry Declaration */}
              <header className="flex justify-between items-start mb-14">
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                      <Fingerprint size={14} className="text-gold" />
                      <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-gold italic leading-none">Pending Vault</h2>
                   </div>
                  <p className="text-[10px] text-obsidian-300 uppercase tracking-widest font-bold">Sovereign Acquisition Registry</p>
                </div>
                <button 
                  onClick={onClose} 
                  className="w-12 h-12 bg-ivory-50 border border-ivory-300 rounded-full flex items-center justify-center text-obsidian-300 hover:text-gold hover:border-gold transition-all"
                >
                  <X size={20} />
                </button>
              </header>

              {/* Asset Feed: The Items List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar -mx-4 px-4 space-y-8">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-40">
                    <div className="w-24 h-24 bg-ivory-50 rounded-[2.5rem] flex items-center justify-center border border-ivory-300">
                      <ShoppingBag size={28} className="text-obsidian-200" />
                    </div>
                    <p className="text-[11px] text-obsidian-300 uppercase tracking-[0.4em] font-black italic">The registry is empty.</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={item.id}
                      className="flex gap-8 items-center p-6 bg-ivory-50 border border-ivory-200 rounded-[2rem] group hover:border-gold/30 transition-all duration-500"
                    >
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border border-ivory-300 shrink-0 shadow-sm">
                        <img src={item.image} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" alt={item.title} />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <p className="text-[9px] font-black text-gold uppercase tracking-widest italic">{item.house || 'Sovereign Asset'}</p>
                        <h4 className="text-sm font-bold text-obsidian-900 uppercase tracking-tight italic leading-tight truncate">{item.title}</h4>
                        <p className="text-lg font-light text-obsidian-400 italic tracking-tighter">${item.price.toLocaleString()}</p>
                      </div>

                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-4 text-obsidian-200 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Settlement Footer */}
              <footer className="pt-12 border-t border-ivory-200 space-y-10">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <span className="text-[10px] text-obsidian-200 uppercase font-black tracking-widest italic leading-none">Total Valuation</span>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                       <p className="text-[9px] text-gold uppercase tracking-widest font-bold">Real-time Market Sync Active</p>
                    </div>
                  </div>
                  <span className="text-5xl font-light text-obsidian-900 italic tracking-tighter leading-none">${totalPrice.toLocaleString()}</span>
                </div>
                
                <div className="bg-ivory-50 border border-ivory-300 p-8 rounded-[2.5rem] flex gap-6 items-start">
                  <ShieldCheck size={20} className="text-gold shrink-0 mt-1" />
                  <p className="text-[10px] text-obsidian-400 uppercase font-bold tracking-[0.2em] leading-relaxed italic">
                    Acquisition handshakes are secured via the LUME protocol. <br/> 
                    <span className="text-obsidian-900 font-black tracking-widest">BTC / ETH / SOL</span> Settlement enabled.
                  </p>
                </div>

                <button 
                  onClick={() => window.location.href = '/checkout'}
                  disabled={items.length === 0}
                  className="group relative w-full h-[88px] bg-obsidian-900 text-gold rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-6 hover:bg-gold hover:text-white transition-all duration-700 shadow-2xl active:scale-95 disabled:opacity-20"
                >
                  Initiate Secure Acquisition <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
                </button>
              </footer>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}