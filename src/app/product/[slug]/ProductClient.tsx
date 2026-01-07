'use client'

import React, { useState } from 'react'
import { 
  ChevronRight, ShoppingBag, Truck, RotateCcw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelectionStore } from '@/store/useSelectionStore'
import { useUIStore } from '@/store/useUIStore'
import Link from 'next/link'
import ProductCard from '@/components/ui/ProductCard'

// 1. TYPE DEFINITION: Exact match for Master SQL Registry
interface Product {
  id: string
  name: string
  price: number
  image: string
  secondary_image?: string
  category: string
  description: string
  slug: string
  gold_purity?: string
  gia_report?: string
  specifications?: any
  serial_number?: string
}

interface ProductClientProps {
  product: Product
  recommendations: Product[]
}

export default function ProductClient({ product, recommendations }: ProductClientProps) {
  const addItem = useSelectionStore((state) => state.addItem)
  const openDrawer = useUIStore((state) => state.openSelectionDrawer)
  const [activeTab, setActiveTab] = useState<'details' | 'shipping'>('details')

  // 2. HANDLER: Securely adding to the selection vault
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      slug: product.slug,
      house: 'Lume Vault' // Branding synchronization
    })
    openDrawer()
  }

  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-20 px-6 md:px-12 selection:bg-gold selection:text-white">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* BREADCRUMBS: The Heritage Trail */}
        <nav className="flex items-center gap-3 mb-16 text-[10px] font-black uppercase tracking-[0.3em] text-obsidian-300 italic">
          <Link href="/collection" className="hover:text-gold transition-colors">Registry</Link>
          <ChevronRight size={10} className="text-gold" />
          <span className="text-obsidian-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* LEFT: VERTICAL ARTIFACT GALLERY */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="aspect-[4/5] bg-white border border-ivory-300 rounded-2xl overflow-hidden relative shadow-sm"
            >
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
            
            {product.secondary_image && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="aspect-[4/5] bg-white border border-ivory-300 rounded-2xl overflow-hidden relative shadow-sm"
              >
                <img src={product.secondary_image} alt={`${product.name} alternate`} className="w-full h-full object-cover" />
              </motion.div>
            )}
          </div>

          {/* RIGHT: CUSTODIAL DATA & ACTIONS */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit space-y-12">
            <header className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                <span className="label-caps text-gold">{product.gold_purity || product.category}</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-[0.9]">
                {product.name}
              </h1>
              
              <p className="text-3xl md:text-4xl font-medium text-obsidian-900">
                ${Number(product.price).toLocaleString()}
              </p>
            </header>

            <div className="space-y-8">
              <p className="text-lg text-obsidian-600 leading-relaxed font-medium italic border-l-2 border-gold/20 pl-8">
                {product.description || "A masterwork of physical autonomy, secured within our primary nodes."}
              </p>

              {/* ACTION COMMANDS */}
              <div className="space-y-6 pt-4">
                <button 
                  onClick={handleAddToCart}
                  className="w-full py-7 bg-obsidian-900 text-gold rounded-xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-gold hover:text-white transition-all duration-500 shadow-2xl active:scale-95"
                >
                  Acquire Asset <ShoppingBag size={18} />
                </button>
                
                <div className="flex items-center justify-center gap-10">
                  <div className="flex items-center gap-3 text-[9px] font-black text-obsidian-400 uppercase tracking-widest">
                    <Truck size={14} className="text-gold" /> Insured Transit
                  </div>
                  <div className="flex items-center gap-3 text-[9px] font-black text-obsidian-400 uppercase tracking-widest">
                    <RotateCcw size={14} className="text-gold" /> Final Settlement
                  </div>
                </div>
              </div>
            </div>

            {/* INSTITUTIONAL DOSSIER */}
            <div className="border-t border-ivory-300 pt-10 space-y-4">
               <Accordion 
                title="Specifications" 
                isOpen={activeTab === 'details'} 
                onClick={() => setActiveTab('details')}
               >
                 <div className="grid grid-cols-2 gap-y-5 text-[10px] font-black uppercase tracking-[0.2em] text-obsidian-600 italic">
                   <p className="text-obsidian-300">Registry Class</p>
                   <p>{product.category}</p>
                   <p className="text-obsidian-300">GIA / Serial</p>
                   <p>{product.gia_report || 'Authenticated'}</p>
                   <p className="text-obsidian-300">Asset Ref</p>
                   <p>#{product.id.slice(0, 10).toUpperCase()}</p>
                 </div>
               </Accordion>

               <Accordion 
                title="Vault Logistics" 
                isOpen={activeTab === 'shipping'} 
                onClick={() => setActiveTab('shipping')}
               >
                 <p className="text-[11px] text-obsidian-500 leading-relaxed font-medium uppercase tracking-tighter italic">
                   Assets are released from deep storage within 24 hours of blockchain confirmation. Armored transit protocol is utilized for all global destinations.
                 </p>
               </Accordion>
            </div>
          </div>
        </div>

        {/* RELATED ASSETS: Complementary Acquisitions */}
        <section className="mt-48 border-t border-ivory-300 pt-24">
          <header className="mb-16">
            <h2 className="text-4xl md:text-6xl font-medium font-serif italic text-obsidian-900">
              Complementary <span className="text-gold not-italic">Acquisitions.</span>
            </h2>
          </header>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {recommendations && recommendations.length > 0 ? (
              recommendations.slice(0, 4).map((item: Product) => (
                <ProductCard key={item.id} product={item} /> // The red line will vanish here
              ))
            ) : (
              <p className="col-span-full py-10 text-center opacity-30 italic text-sm">
                Synchronizing complementary assets...
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function Accordion({ title, children, isOpen, onClick }: any) {
  return (
    <div className="border-b border-ivory-100 pb-5">
      <button 
        onClick={onClick}
        className="w-full flex justify-between items-center py-2 text-[11px] font-black uppercase tracking-[0.3em] text-obsidian-900 italic"
      >
        {title}
        <div className={`w-1 h-1 bg-gold rounded-full transition-all duration-500 ${isOpen ? 'scale-[4] opacity-100' : 'opacity-30'}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pt-6"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}