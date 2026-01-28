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
  const { items, removeItem, addItem, getTotalPrice } = useSelectionStore()
  const totalPrice = getTotalPrice()
  const router = useRouter()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* I. OVERLAY */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200]"
          />

          {/* II. DRAWER PANEL */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 h-screen w-full md:w-[480px] bg-white z-[201] flex flex-col shadow-2xl font-sans"
          >
            {/* 1. HEADER */}
            <div className="flex justify-between items-center px-8 md:px-12 py-8 border-b border-gray-100">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian-900">
                Shopping Bag ({items.reduce((acc, item) => acc + (item.quantity || 1), 0)})
              </span>
              <button 
                onClick={onClose}
                className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                Close <X size={16} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* 2. CONTENT */}
            <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
                  <p className="font-serif italic text-2xl text-gray-300">Your bag is empty.</p>
                  <button onClick={onClose} className="px-8 py-3 border border-gray-200 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-gold transition-colors">
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <div className="space-y-10">
                  {items.map((item) => (
                    <motion.div 
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-6 group"
                    >
                      {/* Product Image */}
                      <div className="w-24 aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      </div>

                      {/* Info & Controls */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-gold uppercase tracking-widest leading-none">
                            {item.category}
                          </p>
                          <h4 className="text-lg font-medium font-serif italic text-obsidian-900 leading-tight">
                            {item.name}
                          </h4>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center border border-gray-100 rounded-xl px-3 py-1.5 gap-4 bg-gray-50">
                                <button 
                                  onClick={() => removeItem(item.id)}
                                  className="text-gray-400 hover:text-black transition-colors"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="text-xs font-bold text-obsidian-900 min-w-[12px] text-center">
                                  {item.quantity || 1}
                                </span>
                                <button 
                                  onClick={() => addItem(item)} 
                                  className="text-gray-400 hover:text-black transition-colors"
                                >
                                  <Plus size={12} />
                                </button>
                             </div>
                             
                             <p className="text-sm font-bold text-obsidian-900 font-sans">
                               ${(Number(item.price) * (item.quantity || 1)).toLocaleString()}
                             </p>
                          </div>

                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-[9px] font-bold uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors flex items-center gap-1.5"
                          >
                            <Trash2 size={10} /> Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. FOOTER */}
            <footer className="p-8 md:p-12 border-t border-gray-100 bg-white">
              <div className="flex justify-between items-center mb-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Subtotal</p>
                <p className="text-3xl font-medium font-serif italic text-obsidian-900">
                  ${totalPrice.toLocaleString()}
                </p>
              </div>

              <div className="space-y-6">
                <button 
                  onClick={() => { onClose(); router.push('/checkout'); }}
                  disabled={items.length === 0}
                  className="w-full py-5 bg-obsidian-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold hover:text-obsidian-900 transition-all duration-300 disabled:opacity-20 rounded-xl shadow-lg flex items-center justify-center gap-4 active:scale-95"
                >
                  Checkout <ArrowRight size={14} />
                </button>
                
                <p className="text-center text-[9px] text-gray-400 font-medium uppercase tracking-widest leading-relaxed">
                  Complimentary fully insured shipping <br/> applied at checkout.
                </p>
              </div>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}