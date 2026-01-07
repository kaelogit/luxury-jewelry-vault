'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react'

// DATA STRUCTURES (Mirroring your future Database)
const CATEGORIES = ['All Collections', 'Watches', 'Diamonds', 'Gold']

const FILTERS = {
  gold: {
    purity: ['14K', '18K', '22K', '24K'],
    type: ['Rings', 'Bracelets', 'Necklaces', 'Pendants', 'Chains', 'Earrings']
  },
  diamonds: {
    clarity: ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1'],
    type: ['Engagement Rings', 'Tennis Bracelets', 'Studs', 'Necklaces']
  },
  watches: {
    movement: ['Automatic', 'Manual', 'Quartz', 'Grand Complication'],
    type: ['Chronograph', 'Dress Watch', 'Dive Watch', 'Pilot']
  }
}

export default function CollectionPage() {
  const [activeCategory, setActiveCategory] = useState('All Collections')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // UI LOGIC: Toggle a specific filter tag
  const toggleFilter = (tag: string) => {
    setActiveFilters(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  return (
    <main className="min-h-screen bg-ivory-100 pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* I. HEADER: Editorial Title */}
        <header className="mb-12 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <p className="label-caps text-gold">The Gallery</p>
              <h1 className="text-5xl md:text-7xl font-medium text-obsidian-900 font-serif italic tracking-tight">
                {activeCategory}
              </h1>
            </div>
            
            {/* CATEGORY SWITCHER (Desktop) */}
            <div className="flex gap-8 border-b border-ivory-300 pb-2">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat)
                    setActiveFilters([]) // Reset filters on category change
                  }}
                  className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative py-2 ${
                    activeCategory === cat ? 'text-obsidian-900' : 'text-obsidian-300 hover:text-gold'
                  }`}
                >
                  {cat}
                  {activeCategory === cat && (
                    <motion.div layoutId="activeCat" className="absolute bottom-0 left-0 w-full h-[2px] bg-gold" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* II. UTILITY BAR: Filters & Count */}
        <div className="flex justify-between items-center py-6 border-y border-ivory-300 mb-10">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-obsidian-900 hover:text-gold transition-colors"
          >
            <SlidersHorizontal size={16} /> 
            {isFilterOpen ? 'Hide Filters' : 'Refine Selection'}
          </button>
          
          <p className="text-[10px] text-obsidian-400 font-bold uppercase tracking-widest">
            Showing 24 Masterpieces
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* III. SIDEBAR FILTERS (Auvere Style) */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.aside 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '280px' }}
                exit={{ opacity: 0, width: 0 }}
                className="hidden lg:block space-y-10 shrink-0"
              >
                {/* DYNAMIC FILTER GROUPS */}
                {activeCategory === 'Gold' || activeCategory === 'All Collections' ? (
                  <FilterGroup title="Gold Purity" options={FILTERS.gold.purity} active={activeFilters} onToggle={toggleFilter} />
                ) : null}
                
                {activeCategory === 'Gold' || activeCategory === 'All Collections' ? (
                  <FilterGroup title="Gold Type" options={FILTERS.gold.type} active={activeFilters} onToggle={toggleFilter} />
                ) : null}

                {activeCategory === 'Diamonds' || activeCategory === 'All Collections' ? (
                  <FilterGroup title="Diamond Clarity" options={FILTERS.diamonds.clarity} active={activeFilters} onToggle={toggleFilter} />
                ) : null}

                {activeCategory === 'Watches' || activeCategory === 'All Collections' ? (
                  <FilterGroup title="Watch Movement" options={FILTERS.watches.movement} active={activeFilters} onToggle={toggleFilter} />
                ) : null}
              </motion.aside>
            )}
          </AnimatePresence>

          {/* IV. PRODUCT GRID */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {/* Placeholder for Product Cards */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="group space-y-4">
                  <div className="aspect-[4/5] bg-white border border-ivory-300 rounded-sm overflow-hidden relative">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-ivory-100/80 backdrop-blur-sm px-3 py-1 text-[8px] font-bold uppercase tracking-widest text-gold border border-gold/20 rounded-full">
                        18K Gold
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-obsidian-900/0 group-hover:bg-obsidian-900/5 transition-all duration-700" />
                  </div>
                  <div className="space-y-1 px-1">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-obsidian-900">Cuban Link Bracelet</h3>
                    <p className="text-[10px] text-obsidian-400 uppercase font-medium">Fine Gold • $3,200</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE FILTER OVERLAY */}
      <MobileFilterMenu 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        activeCategory={activeCategory} 
      />
    </main>
  )
}

/**
 * UI COMPONENT: Filter Section Group
 */
function FilterGroup({ title, options, active, onToggle }: any) {
  return (
    <div className="space-y-4">
      <h4 className="label-caps !text-[10px] text-obsidian-900">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt: string) => (
          <button 
            key={opt}
            onClick={() => onToggle(opt)}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full border transition-all ${
              active.includes(opt) 
              ? 'bg-obsidian-900 text-white border-obsidian-900' 
              : 'bg-white text-obsidian-400 border-ivory-300 hover:border-gold'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * UI COMPONENT: Mobile Filter Bottom Sheet
 */
function MobileFilterMenu({ isOpen, onClose, activeCategory }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[150] lg:hidden flex flex-col justify-end"
        >
          <div className="absolute inset-0 bg-obsidian-900/40" onClick={onClose} />
          <div className="relative bg-white rounded-t-[2.5rem] p-8 max-h-[80vh] overflow-y-auto">
            <div className="w-12 h-1 bg-ivory-300 rounded-full mx-auto mb-8" />
            <div className="flex justify-between items-center mb-10">
              <h3 className="label-caps text-obsidian-900">Filter Selection</h3>
              <button onClick={onClose}><X size={20} /></button>
            </div>
            
            <div className="space-y-10 pb-10">
               {/* Mobile-specific filter groups here */}
               <p className="text-xs text-obsidian-400">Apply filters to refine your {activeCategory} search.</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}