'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Loader2, ChevronRight, Globe, 
  Filter, X, ShieldCheck, Star, Zap, Check, ArrowRight 
} from 'lucide-react'
import Link from 'next/link'

export default function CollectionPage() {
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeClass, setActiveClass] = useState('all')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    fetchVaultAssets()
  }, [])

  async function fetchVaultAssets() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('price', { ascending: false })

    if (!error) setProducts(data || [])
    setLoading(false)
  }

  const availableTypes = useMemo(() => {
    const relevant = activeClass === 'all' 
      ? products 
      : products.filter(p => p.asset_class?.toUpperCase() === activeClass.toUpperCase())
    
    const types = Array.from(new Set(relevant.map(p => p.specifications?.type || p.category)))
    return types.filter(Boolean).sort()
  }, [activeClass, products])

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const handleClassChange = (newClass: string) => {
    setActiveClass(newClass)
    setSelectedTypes([])
  }

  useEffect(() => {
    let result = products
    if (activeClass !== 'all') {
      result = result.filter(p => p.asset_class?.toUpperCase() === activeClass.toUpperCase())
    }
    if (selectedTypes.length > 0) {
      result = result.filter(p => selectedTypes.includes(p.specifications?.type || p.category))
    }
    if (searchQuery) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.asset_class?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    setFilteredProducts(result)
  }, [activeClass, selectedTypes, searchQuery, products])

  return (
    <main className="min-h-screen bg-ivory-100 pt-32 md:pt-48 pb-32 px-6 md:px-12 selection:bg-gold selection:text-white">
      <div className="max-w-[1800px] mx-auto">
        
        {/* I. HEADER: The Editorial Masthead */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-32">
          <div className="space-y-8">
             <div className="flex items-center gap-4">
                <ShieldCheck className="text-gold" size={20} />
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-gold italic">Sovereign Registry v4.0</p>
             </div>
            <h1 className="text-7xl md:text-[11rem] font-light text-obsidian-900 italic tracking-tighter leading-[0.75]">
              The <span className="text-obsidian-400">Vault.</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
            <div className="relative group w-full lg:w-[450px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-obsidian-300 group-focus-within:text-gold transition-colors" size={18} />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH REGISTRY..."
                className="w-full bg-white border border-ivory-300 rounded-[2rem] py-6 pl-16 pr-8 text-[11px] uppercase tracking-widest text-obsidian-900 outline-none focus:border-gold/40 transition-all shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="w-full sm:w-auto group flex items-center justify-center gap-4 px-10 py-6 bg-obsidian-900 text-gold rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-gold hover:text-white transition-all duration-700 shadow-2xl"
            >
              Filter Protocol <Filter size={14} className="group-hover:rotate-180 transition-transform duration-700" />
            </button>
          </div>
        </header>

        {/* II. MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-24">
          
          {/* SIDEBAR: Institutional Filtering */}
          <aside className="hidden lg:block w-80 shrink-0 space-y-20 sticky top-48 h-fit">
            <div className="space-y-10">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-obsidian-300 italic border-l-2 border-gold pl-6">Asset Houses</h4>
              <div className="flex flex-col gap-6 pl-6">
                {['all', 'GOLD', 'DIAMOND', 'WATCH', 'BESPOKE'].map((cls) => (
                  <button
                    key={cls}
                    onClick={() => handleClassChange(cls)}
                    className={`text-left text-2xl transition-all flex items-center justify-between group ${activeClass === cls ? 'text-obsidian-900 italic font-light' : 'text-obsidian-200 hover:text-obsidian-400'}`}
                  >
                    <span>{cls}</span>
                    {activeClass === cls && <motion.div layoutId="zap" className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_gold]" />}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {availableTypes.length > 0 && (
                <motion.div 
                  key={activeClass}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-10 pt-16 border-t border-ivory-300"
                >
                  <div className="flex justify-between items-center pl-6">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-obsidian-300 italic">Specifications</h4>
                    {selectedTypes.length > 0 && (
                      <button onClick={() => setSelectedTypes([])} className="text-[9px] text-gold uppercase font-black hover:text-white transition-colors">Clear</button>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 pl-6">
                    {availableTypes.map((type) => {
                      const isSelected = selectedTypes.includes(type)
                      return (
                        <button
                          key={type}
                          onClick={() => toggleType(type)}
                          className={`py-3 px-6 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                            isSelected 
                            ? 'bg-gold border-gold text-white shadow-xl' 
                            : 'bg-white border-ivory-300 text-obsidian-300 hover:border-gold/30'
                          }`}
                        >
                          {type}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

          {/* III. ASSET GRID */}
          <div className="flex-1 min-h-[700px]">
            {loading ? (
              <div className="h-[40vh] flex flex-col items-center justify-center gap-8">
                <Loader2 className="text-gold animate-spin" size={48} />
                <p className="text-[11px] text-obsidian-300 uppercase tracking-[0.8em] font-black italic">Auditing Vault...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="h-[40vh] flex flex-col items-center justify-center text-obsidian-200 gap-8 border border-ivory-300 rounded-[4rem] bg-white shadow-sm">
                <Globe size={60} className="opacity-10" />
                <p className="text-[11px] uppercase tracking-[0.5em] font-black italic">Zero Matching Signatures.</p>
                <button onClick={() => { setActiveClass('all'); setSelectedTypes([]); }} className="text-gold font-black uppercase text-[10px] tracking-widest border-b border-gold pb-1">Reset Registry</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-24 gap-x-12">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((p) => (
                    <AssetCard key={p.id} product={p} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileFilterDrawer 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeClass={activeClass}
        setActiveClass={handleClassChange}
        selectedTypes={selectedTypes}
        toggleType={toggleType}
        availableTypes={availableTypes}
      />
    </main>
  )
}

function AssetCard({ product }: { product: any }) {
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group">
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-[3/4] relative overflow-hidden rounded-[3.5rem] bg-white border border-ivory-300 shadow-xl group-hover:shadow-2xl group-hover:border-gold/30 transition-all duration-1000">
          <img 
            src={product.image_url || '/placeholder.jpg'} 
            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2s] ease-in-out"
            alt={product.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="absolute top-8 left-8">
             <div className="px-5 py-2 bg-white/90 backdrop-blur-xl border border-ivory-300 rounded-full flex items-center gap-3 shadow-sm">
                <ShieldCheck size={12} className="text-gold" />
                <span className="text-[9px] font-black text-obsidian-900 uppercase tracking-widest">{product.asset_class}</span>
             </div>
          </div>
        </div>

        <div className="mt-12 space-y-8 px-4">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-obsidian-300 uppercase tracking-[0.4em] italic leading-none">
              {product.specifications?.type || product.category}
            </p>
            <h3 className="text-4xl font-light text-obsidian-900 italic tracking-tighter leading-tight group-hover:text-gold transition-all duration-700">
              {product.title}
            </h3>
          </div>

          <div className="flex justify-between items-end border-t border-ivory-100 pt-10">
            <div className="space-y-2">
              <p className="text-[9px] font-black text-obsidian-200 uppercase tracking-widest italic leading-none">Acquisition Valuation</p>
              <p className="text-5xl font-light text-obsidian-900 tracking-tighter">
                ${Number(product.price).toLocaleString()}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border border-ivory-300 flex items-center justify-center text-obsidian-300 group-hover:bg-gold group-hover:text-white group-hover:border-gold transition-all duration-700 shadow-sm">
              <ArrowRight size={24} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function MobileFilterDrawer({ isOpen, onClose, activeClass, setActiveClass, selectedTypes, toggleType, availableTypes }: any) {
    return (
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-obsidian-900/40 backdrop-blur-md z-[110]" />
              <motion.div 
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[120] p-12 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-20">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-gold italic">Vault Filters</h4>
                  <button onClick={onClose} className="text-obsidian-300 hover:text-obsidian-900 transition-colors"><X size={32}/></button>
                </div>
                
                <div className="space-y-24">
                   <div className="space-y-12">
                     <p className="text-[10px] font-black text-obsidian-200 uppercase tracking-widest italic">Asset House</p>
                     <div className="flex flex-col gap-8">
                       {['all', 'GOLD', 'DIAMOND', 'WATCH', 'BESPOKE'].map(cls => (
                         <button key={cls} onClick={() => setActiveClass(cls)} className={`text-5xl font-light text-left italic tracking-tighter leading-none ${activeClass === cls ? 'text-obsidian-900' : 'text-obsidian-100'}`}>{cls}</button>
                       ))}
                     </div>
                   </div>

                   {availableTypes.length > 0 && (
                     <div className="space-y-12">
                       <p className="text-[10px] font-black text-obsidian-200 uppercase tracking-widest italic">Specifications</p>
                       <div className="flex flex-wrap gap-4">
                         {availableTypes.map(type => (
                           <button key={type} onClick={() => toggleType(type)} className={`py-4 px-8 rounded-full border text-[11px] font-black uppercase tracking-widest transition-all ${selectedTypes.includes(type) ? 'bg-gold text-white border-gold' : 'border-ivory-300 text-obsidian-300'}`}>{type}</button>
                         ))}
                       </div>
                     </div>
                   )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )
}