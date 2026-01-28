'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const FAQ_DATA = [
  {
    category: "Authenticity",
    questions: [
      {
        q: "Are all items authentic?",
        a: "Yes. Every item in the Lume Vault collection is 100% authentic. Diamonds are accompanied by GIA certification, and timepieces include original manufacturer documentation."
      },
      {
        q: "Can I view items in person?",
        a: "Private viewings are available by appointment only at our partner locations in New York, London, and Dubai. Please contact us to arrange a session."
      },
      {
        q: "What documentation is included?",
        a: "Every purchase includes a Certificate of Authenticity, official appraisal documents for insurance, and a Lume Vault Registry Card."
      }
    ]
  },
  {
    category: "Shipping",
    questions: [
      {
        q: "How is my order delivered?",
        a: "We utilize a private logistics network. All deliveries are fully insured and handled by specialized security couriers to ensure a safe handover."
      },
      {
        q: "Do you ship internationally?",
        a: "Yes. We facilitate secure global delivery to over 50 countries. All customs documentation and international insurance are managed by our team."
      },
      {
        q: "How long does delivery take?",
        a: "Upon payment confirmation, items typically undergo a final 48-hour inspection before release. International delivery usually takes 3–7 business days."
      }
    ]
  },
  {
    category: "Payments",
    questions: [
      {
        q: "Which payment methods do you accept?",
        a: "We accept Bank Wires, major Digital Apps (CashApp, PayPal, Apple Pay), and Cryptocurrency (BTC, ETH, USDT)."
      },
      {
        q: "Is my personal data secure?",
        a: "Absolutely. Lume Vault uses end-to-end encryption for all communications. We do not store payment details on our servers, and your data is never shared."
      }
    ]
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id)
  }

  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-20 px-6 md:px-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* I. HEADER */}
        <header className="space-y-6 text-center md:text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">Support</p>
          <h1 className="text-5xl md:text-7xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-none">
            Common <span className="text-gold not-italic">Questions.</span>
          </h1>
          <p className="text-obsidian-600 text-lg md:text-xl leading-relaxed font-medium max-w-2xl">
            Everything you need to know about the Lume Vault process and our global standards.
          </p>
        </header>

        {/* II. FAQ ACCORDION SECTION */}
        <div className="space-y-16">
          {FAQ_DATA.map((group, groupIdx) => (
            <section key={groupIdx} className="space-y-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold border-b border-ivory-300 pb-4">
                {group.category}
              </h3>
              
              <div className="space-y-4">
                {group.questions.map((faq, faqIdx) => {
                  const id = `${groupIdx}-${faqIdx}`
                  const isOpen = openIndex === id

                  return (
                    <div 
                      key={id} 
                      className={`bg-white border rounded-3xl transition-all duration-300 overflow-hidden ${
                        isOpen ? 'border-gold shadow-lg' : 'border-ivory-300 hover:border-ivory-400'
                      }`}
                    >
                      <button 
                        onClick={() => toggleFAQ(id)}
                        className="w-full px-8 py-6 flex justify-between items-center text-left gap-4"
                      >
                        <span className="text-lg font-serif italic text-obsidian-900">{faq.q}</span>
                        <div className={`shrink-0 w-8 h-8 rounded-full border border-ivory-200 flex items-center justify-center transition-colors ${isOpen ? 'bg-gold border-gold text-white' : 'text-obsidian-400'}`}>
                          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <div className="px-8 pb-8 pt-2">
                              <p className="text-sm md:text-base text-obsidian-500 font-medium leading-relaxed max-w-2xl">
                                {faq.a}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        {/* III. CTA FOOTER */}
        <section className="bg-obsidian-900 rounded-[2.5rem] p-10 md:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
          {/* Decorative Glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-gold/5 pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <h4 className="text-2xl md:text-4xl font-serif italic text-white">Still have questions?</h4>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Our advisors are available 24/7</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center relative z-10">
            <Link 
              href="/contact"
              className="px-10 py-4 bg-gold text-obsidian-900 text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-lg active:scale-95"
            >
              Contact Us
            </Link>
            <Link 
              href="/track"
              className="px-10 py-4 bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/20 transition-all border border-white/20 active:scale-95"
            >
              Track Order
            </Link>
          </div>
        </section>

      </div>
    </main>
  )
}