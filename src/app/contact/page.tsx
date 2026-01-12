'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, MessageSquare, Clock, ArrowRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase' // Ensure your Supabase client path is correct

export default function ContactPage() {
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    topic: 'General Inquiry',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .insert([formData])

      if (error) throw error
      
      setSubmitted(true)
    } catch (err: any) {
      alert("Submission Error: " + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-20 px-4 md:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* HEADER */}
        <header className="max-w-3xl space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Concierge Service</p>
          <h1 className="text-5xl md:text-8xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-none">
            Contact <span className="text-gold not-italic">Us.</span>
          </h1>
          <p className="text-obsidian-600 text-lg md:text-xl leading-relaxed font-medium">
            Our private advisors are available to provide personal guidance regarding your inquiry.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-start">
          
          {/* CONTACT INFORMATION */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <ContactMethod 
                icon={<Mail size={20} />}
                title="Email Inquiries"
                value="concierge@lumevault.com"
                desc="We respond to all inquiries within 24 hours."
              />
              <ContactMethod 
                icon={<Phone size={20} />}
                title="Direct Assistance"
                value="+1 (212) 555-0198"
                desc="Monday – Friday, 9am – 6pm EST."
              />
              <ContactMethod 
                icon={<MapPin size={20} />}
                title="Global Headquarters"
                value="New York, NY"
                desc="Available by appointment only."
              />
            </div>

            <div className="bg-white border border-ivory-300 rounded-[2rem] p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-obsidian-900">
                <Clock size={18} className="text-gold" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">Operating Hours</h4>
              </div>
              <div className="space-y-2 text-[11px] font-bold uppercase text-obsidian-500 tracking-tight">
                <div className="flex justify-between border-b border-ivory-100 pb-2">
                  <span>Monday – Friday</span>
                  <span>09:00 – 18:00</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Saturday – Sunday</span>
                  <span className="text-gold">By Appointment</span>
                </div>
              </div>
            </div>
          </div>

          {/* MESSAGE FORM */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-ivory-300 rounded-[2.5rem] p-8 md:p-12 shadow-xl">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold">
                    <MessageSquare size={32} />
                  </div>
                  <h3 className="text-3xl font-serif italic text-obsidian-900">Inquiry Received</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-obsidian-500 max-w-xs mx-auto">
                    Your message has been archived. A specialist will contact you shortly.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="text-gold text-[10px] font-black uppercase tracking-widest border-b border-gold/30 pb-1">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput 
                      label="Full Name" 
                      placeholder="e.g. Julianne Moore" 
                      value={formData.full_name}
                      onChange={(e: any) => setFormData({...formData, full_name: e.target.value})}
                      required 
                    />
                    <FormInput 
                      label="Email Address" 
                      type="email" 
                      placeholder="email@example.com" 
                      value={formData.email}
                      onChange={(e: any) => setFormData({...formData, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-obsidian-400 ml-1">Topic of Interest</label>
                    <select 
                      value={formData.topic}
                      onChange={(e) => setFormData({...formData, topic: e.target.value})}
                      className="w-full bg-ivory-50 border border-ivory-200 rounded-xl px-6 py-4 text-xs font-bold text-obsidian-900 uppercase focus:border-gold outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option>General Inquiry</option>
                      <option>Watch Sourcing</option>
                      <option>Diamond Acquisition</option>
                      <option>Press & Media</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-obsidian-400 ml-1">How can we assist you?</label>
                    <textarea 
                      rows={5} 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Details regarding your request..."
                      className="w-full bg-ivory-50 border border-ivory-200 rounded-2xl px-6 py-4 text-sm font-medium text-obsidian-900 placeholder:text-ivory-400 focus:border-gold outline-none transition-all resize-none"
                      required
                    />
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="w-full h-[75px] bg-obsidian-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-gold transition-all duration-500 shadow-xl active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <>Send Secure Message <ArrowRight size={16} /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function ContactMethod({ icon, title, value, desc }: any) {
  return (
    <div className="flex gap-6 group">
      <div className="w-12 h-12 bg-white border border-ivory-300 rounded-xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-sm flex-shrink-0">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-obsidian-400">{title}</h4>
        <p className="text-xl font-medium text-obsidian-900">{value}</p>
        <p className="text-[11px] text-obsidian-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function FormInput({ label, placeholder, value, onChange, type = "text", required = false }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-obsidian-400 ml-1">{label}</label>
      <input 
        type={type} 
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-ivory-50 border border-ivory-200 rounded-xl px-6 py-4 text-sm font-medium text-obsidian-900 placeholder:text-ivory-400 focus:border-gold outline-none transition-all"
      />
    </div>
  )
}