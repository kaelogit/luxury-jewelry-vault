'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, SlidersHorizontal, ArrowRight, Loader2, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

/**
 * ARCHITECTURAL CONSTANTS
 */
const CATEGORIES = ['All Collections', 'Watches', 'Diamonds', 'Gold']
const INITIAL_BATCH = 30
const LOAD_MORE_BATCH = 35

export default function CollectionClient({ initialProducts }: { initialProducts: any[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  // State Management
  const [products] = useState(initialProducts) // Initialized from server
  const [loading, setLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [displayLimit, setDisplayLimit] = useState(INITIAL_BATCH)

  /**
   * 1. URL SYNCHRONIZATION
   */
  const activeCategory = useMemo(() => {
    const cat = searchParams.get('cat')
    if (!cat) return 'All Collections'
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
  }, [searchParams])

  const setActiveCategory = (cat: string) => {
    const query = cat === 'All Collections' ? '/collection' : `/collection?cat=${cat.toLowerCase()}`
    setActiveFilters([]) 
    setDisplayLimit(INITIAL_BATCH) 
    router.push(query, { scroll: false })
  }

  /**
   * 2. DYNAMIC DISCOVERY ENGINE
   * Extracts every unique brand, purity, and stone shape from the current dataset
   */
  const dynamicFilters = useMemo(() => {
    const filters = {
      brands: new Set<string>(),
      purity: new Set<string>(),
      clarity: new Set<string>(),
      movement: new Set<string>(),
      subCategories: new Set<string>(),
      shapes: new Set<string>()
    }

    products.forEach(p => {
      if (p.brand) filters.brands.add(p.brand)
      if (p.gold_purity) filters.purity.add(p.gold_purity)
      if (p.diamond_clarity) filters.clarity.add(p.diamond_clarity)
      if (p.movement) filters.movement.add(p.movement)
      if (p.sub_category) filters.subCategories.add(p.sub_category)
      if (p.shape) filters.shapes.add(p.shape)
    })

    return {
      brands: Array.from(filters.brands).sort(),
      purity: Array.from(filters.purity).sort(),
      clarity: Array.from(filters.clarity).sort(),
      movement: Array.from(filters.movement).sort(),
      subCategories: Array.from(filters.subCategories).sort(),
      shapes: Array.from(filters.shapes).sort()
    }
  }, [products])

  /**
   * 3. REFINED FILTERING LOGIC
   */
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = activeCategory === 'All Collections' || 
        product.category?.toLowerCase() === activeCategory.toLowerCase()
      
      const matchesFilters = activeFilters.length === 0 || 
        activeFilters.some(f => 
          product.brand === f ||
          product.gold_purity === f ||
          product.diamond_clarity === f ||
          product.movement === f ||
          product.sub_category === f ||
          product.shape === f
        )

      return matchesCategory && matchesFilters
    })
  }, [products, activeCategory, activeFilters])

  const visibleProducts = filteredProducts.slice(0, displayLimit)

  const toggleFilter = (tag: string) => {
    setActiveFilters(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleLoadMore = () => setDisplayLimit(prev => prev + LOAD_MORE_BATCH)

  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-20 px-6 md:px-12 selection:bg-gold selection:text-white">
      <div className="max-w-screen-2xl mx-auto">
        
        <header className="mb-12 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-ivory-300 pb-6">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">The Gallery</p>
              <h1 className="text-4xl md:text-7xl font-medium text-obsidian-900 font-serif italic tracking-tight capitalize">
                {activeCategory === 'All Collections' ? 'The Vault' : activeCategory}
              </h1>
            </div>
            
            <div className="flex gap-8 overflow-x-auto no-scrollbar -mb-[1px] relative pb-2 md:pb-0">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative py-2 whitespace-nowrap ${
                    activeCategory === cat ? 'text-obsidian-900' : 'text-obsidian-300 hover:text-gold'
                  }`}
                >
                  {cat}
                  {activeCategory === cat && (
                    <motion.div layoutId="activeCatLine" className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gold" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="flex justify-between items-center py-6 border-b border-ivory-300 mb-10">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-obsidian-900 hover:text-gold transition-colors"
          >
            <SlidersHorizontal size={16} /> 
            {isFilterOpen ? 'Close Refinements' : 'Refine Selection'}
          </button>
          
          <p className="text-[10px] text-obsidian-400 font-bold uppercase tracking-widest">
            Asset Count: {visibleProducts.length} / {filteredProducts.length}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <AnimatePresence>
            {isFilterOpen && (
              <motion.aside 
                initial={{ opacity: 0, width: 0 }} 
                animate={{ opacity: 1, width: '256px' }} 
                exit={{ opacity: 0, width: 0 }}
                className="hidden lg:block space-y-12 shrink-0 overflow-hidden"
              >
                {dynamicFilters.brands.length > 0 && <FilterGroup title="Brand" options={dynamicFilters.brands} active={activeFilters} onToggle={toggleFilter} />}
                {(activeCategory === 'Gold' || activeCategory === 'All Collections') && dynamicFilters.purity.length > 0 && <FilterGroup title="Gold Purity" options={dynamicFilters.purity} active={activeFilters} onToggle={toggleFilter} />}
                {(activeCategory === 'Diamonds' || activeCategory === 'All Collections') && (
                  <>
                    {dynamicFilters.clarity.length > 0 && <FilterGroup title="Clarity" options={dynamicFilters.clarity} active={activeFilters} onToggle={toggleFilter} />}
                    {dynamicFilters.shapes.length > 0 && <FilterGroup title="Stone Shape" options={dynamicFilters.shapes} active={activeFilters} onToggle={toggleFilter} />}
                  </>
                )}
                {(activeCategory === 'Watches' || activeCategory === 'All Collections') && dynamicFilters.movement.length > 0 && <FilterGroup title="Movement" options={dynamicFilters.movement} active={activeFilters} onToggle={toggleFilter} />}
                {dynamicFilters.subCategories.length > 0 && <FilterGroup title="Type" options={dynamicFilters.subCategories} active={activeFilters} onToggle={toggleFilter} />}
              </motion.aside>
            )}
          </AnimatePresence>

          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {displayLimit < filteredProducts.length && (
              <div className="flex justify-center pt-20 border-t border-ivory-300 mt-20">
                <button onClick={handleLoadMore} className="group flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-full border border-ivory-300 flex items-center justify-center group-hover:bg-obsidian-900 group-hover:border-obsidian-900 transition-all duration-700">
                    <Plus size={20} className="text-obsidian-900 group-hover:text-gold transition-colors" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-obsidian-400 group-hover:text-obsidian-900">Discover More</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileFilterMenu 
        isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} 
        activeCategory={activeCategory} activeFilters={activeFilters} onToggle={toggleFilter}
        dynamicFilters={dynamicFilters}
      />
    </main>
  )
}

function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/product/${product.slug}`} className="group space-y-5">
      <div className="aspect-[4/5] bg-white border border-ivory-300 rounded-sm overflow-hidden relative shadow-sm hover:shadow-2xl transition-all duration-1000">
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-gold border border-gold/10 rounded-full">
            {product.brand || product.gold_purity || 'Vault Asset'}
          </span>
        </div>
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
        ) : (
          <div className="w-full h-full bg-ivory-200 flex items-center justify-center text-[9px] font-bold tracking-widest text-obsidian-300 italic">No Visual Available</div>
        )}
      </div>
      <div className="space-y-1.5 px-1">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-obsidian-900 truncate">{product.name}</h3>
        <p className="text-[10px] text-obsidian-400 uppercase font-medium tracking-wider italic">
          {product.sub_category || product.category} • ${product.price?.toLocaleString()}
        </p>
      </div>
    </Link>
  )
}

function FilterGroup({ title, options, active, onToggle }: any) {
  return (
    <div className="space-y-5">
      <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-obsidian-900 border-b border-ivory-200 pb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt: string) => (
          <button key={opt} onClick={() => onToggle(opt)} className={`px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest rounded-full border transition-all ${active.includes(opt) ? 'bg-obsidian-900 text-white border-obsidian-900' : 'bg-white text-obsidian-400 border-ivory-300 hover:border-gold'}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function MobileFilterMenu({ isOpen, onClose, activeCategory, activeFilters, onToggle, dynamicFilters }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-0 z-[150] lg:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-obsidian-900/40 backdrop-blur-sm" onClick={onClose} />
          <div className="relative bg-white rounded-t-[3rem] p-10 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="w-12 h-1 bg-ivory-300 rounded-full mx-auto mb-8" />
            <div className="flex justify-between items-center mb-10 sticky top-0 bg-white z-10 py-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-obsidian-900">Refine Selection</h3>
              <button onClick={onClose} className="p-2 bg-ivory-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="space-y-12 pb-20">
               {dynamicFilters.brands.length > 0 && <FilterGroup title="Brand" options={dynamicFilters.brands} active={activeFilters} onToggle={onToggle} />}
               {(activeCategory === 'Gold' || activeCategory === 'All Collections') && dynamicFilters.purity.length > 0 && <FilterGroup title="Gold Purity" options={dynamicFilters.purity} active={activeFilters} onToggle={onToggle} />}
               {(activeCategory === 'Diamonds' || activeCategory === 'All Collections') && (
                 <>
                   {dynamicFilters.clarity.length > 0 && <FilterGroup title="Clarity" options={dynamicFilters.clarity} active={activeFilters} onToggle={onToggle} />}
                   {dynamicFilters.shapes.length > 0 && <FilterGroup title="Stone Shape" options={dynamicFilters.shapes} active={activeFilters} onToggle={onToggle} />}
                 </>
               )}
            </div>
            <div className="sticky bottom-0 left-0 right-0 bg-white pt-6">
              <button onClick={onClose} className="w-full py-5 bg-obsidian-900 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-xl shadow-2xl">
                Apply Refinements
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}