'use client'

import React from 'react'
import { X, ArrowRight, Minus, Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelectionStore } from '@/store/useSelectionStore'
import { useRouter } from 'next/navigation'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SelectionDrawer({ isOpen, onClose }: Props) {
  // We assume your store has 'addItem' (to increment) and 'decrementItem' (to reduce)
  const { items, removeItem, addItem, getTotalPrice } = useSelectionStore()
  const totalPrice = getTotalPrice()
  const router = useRouter()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* I. THE OVERLAY: Pure & Minimal */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-obsidian-900/20 backdrop-blur-sm z-[200]"
          />

          {/* II. THE SELECTION: Rebuilt for Quantity Control */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 h-screen w-full md:w-[500px] bg-white z-[201] flex flex-col shadow-[-10px_0_50px_rgba(0,0,0,0.05)]"
          >
            {/* 1. NAVIGATION BAR */}
            <div className="flex justify-between items-center px-8 md:px-12 py-10 border-b border-ivory-200">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-obsidian-900">
                Your Selection ({items.reduce((acc, item) => acc + (item.quantity || 1), 0)})
              </span>
              <button 
                onClick={onClose}
                className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-obsidian-400 hover:text-obsidian-900 transition-colors"
              >
                Close <X size={14} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* 2. THE EDIT: Scrollable Content with Quantity Controls */}
            <div className="flex-1 overflow-y-auto px-8 md:px-12 py-12 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <p className="font-serif italic text-2xl text-obsidian-300">Your bag is empty.</p>
                  <button onClick={onClose} className="text-[10px] font-bold uppercase tracking-widest text-gold border-b border-gold/30 pb-1">
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <div className="space-y-12">
                  {items.map((item) => (
                    <motion.div 
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-8 group"
                    >
                      {/* ASSET IMAGE */}
                      <div className="w-24 md:w-32 aspect-[4/5] bg-ivory-100 relative overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                        />
                      </div>

                      {/* ASSET DATA */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="space-y-2">
                          <h4 className="text-xl font-medium font-serif italic text-obsidian-900 tracking-tight leading-tight">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-obsidian-400 uppercase tracking-widest font-medium">
                            {item.category}
                          </p>
                        </div>

                        <div className="space-y-4">
                          {/* QUANTITY CONTROL BAR */}
                          <div className="flex items-center gap-6">
                             <div className="flex items-center border border-ivory-300 rounded-full px-3 py-1 gap-4">
                                <button 
                                  onClick={() => removeItem(item.id)} // This would need to be your 'decrement' function
                                  className="text-obsidian-400 hover:text-obsidian-900 transition-colors"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="text-[11px] font-bold text-obsidian-900 min-w-[12px] text-center">
                                  {item.quantity || 1}
                                </span>
                                <button 
                                  onClick={() => addItem(item)} 
                                  className="text-obsidian-400 hover:text-obsidian-900 transition-colors"
                                >
                                  <Plus size={12} />
                                </button>
                             </div>
                             
                             <p className="text-sm font-medium text-obsidian-900">
                               ${(Number(item.price) * (item.quantity || 1)).toLocaleString()}
                             </p>
                          </div>

                          <button 
                            onClick={() => removeItem(item.id)} // Full removal
                            className="text-[9px] font-bold uppercase tracking-widest text-obsidian-300 hover:text-red-500 transition-all flex items-center gap-1.5"
                          >
                            <Trash2 size={10} /> Remove Asset
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. FOOTER: Checkout Logic */}
            <footer className="p-8 md:p-12 border-t border-ivory-200 bg-white">
              <div className="flex justify-between items-center mb-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-obsidian-300">Subtotal</p>
                <p className="text-3xl font-medium font-serif italic text-obsidian-900">
                  ${totalPrice.toLocaleString()}
                </p>
              </div>

              <div className="space-y-6">
                <button 
                  onClick={() => { onClose(); router.push('/checkout'); }}
                  disabled={items.length === 0}
                  className="w-full py-6 bg-obsidian-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold transition-all duration-500 disabled:opacity-20 flex items-center justify-center gap-4"
                >
                  Proceed to Checkout <ArrowRight size={14} />
                </button>
                
                <p className="text-center text-[9px] text-obsidian-400 font-medium uppercase tracking-widest leading-relaxed">
                  Complimentary insured shipping <br/> applied to all orders.
                </p>
              </div>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}