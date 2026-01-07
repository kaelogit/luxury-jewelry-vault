'use client'

import React, { useState } from 'react'
import { ShieldCheck, Fingerprint, ArrowRight, Download, Award, AlertCircle, Loader2, Globe, FileCheck, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import jsPDF from 'jspdf'

export default function AuthenticityVerify() {
  const [certId, setCertId] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [certData, setCertData] = useState<any>(null)
  const [error, setError] = useState('')

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!certId) return

    setIsVerifying(true)
    setError('')
    setCertData(null)

    try {
      // Searching for the asset via Serial Number (LV-XXXX) or GIA ID
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .or(`gia_report.eq.${certId.toUpperCase()},serial_number.eq.${certId.toUpperCase()}`)
        .single()

      if (fetchError || !data) {
        setError('Asset signature not found in the Lume Registry.')
      } else {
        setCertData(data)
      }
    } catch (err) {
      setError('Connection to registry timed out. Please retry.')
    } finally {
      setIsVerifying(false)
    }
  }

  const generateVaultPDF = () => {
    if (!certData) return
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    
    // Aesthetic: Pearl Canvas & Gold Details
    doc.setFillColor(252, 251, 247)
    doc.rect(0, 0, 210, 297, 'F')
    doc.setDrawColor(212, 175, 55)
    doc.setLineWidth(0.5)
    doc.rect(10, 10, 190, 277)

    doc.setTextColor(20, 20, 20)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(24)
    doc.text('LUME VAULT', 105, 40, { align: 'center', charSpace: 4 })
    
    doc.setTextColor(212, 175, 55)
    doc.setFontSize(8)
    doc.text('CERTIFICATE OF AUTHENTICITY & PROVENANCE', 105, 48, { align: 'center', charSpace: 2 })

    doc.setTextColor(20, 20, 20)
    doc.setFontSize(18)
    doc.setFont('times', 'italic')
    doc.text(certData.name.toUpperCase(), 105, 80, { align: 'center' })

    // Data Mapping
    const addRow = (label: string, value: string, y: number) => {
      doc.setTextColor(150, 150, 150)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text(label.toUpperCase(), 40, y)
      doc.setTextColor(20, 20, 20)
      doc.setFontSize(11)
      doc.text(value.toUpperCase(), 170, y, { align: 'right' })
      doc.setDrawColor(240, 240, 240)
      doc.line(40, y + 4, 170, y + 4)
    }

    addRow('Classification', certData.category, 110)
    addRow('Registry ID', certData.serial_number, 125)
    addRow('GIA / Reference', certData.gia_report || certData.specifications?.reference || 'N/A', 140)
    addRow('Purity / Grade', certData.gold_purity || certData.specifications?.clarity || 'Verified', 155)
    addRow('Status', 'Vault Authenticated', 170)

    doc.save(`LUME_CERT_${certData.serial_number}.pdf`)
  }

  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-32 px-6">
      <div className="max-w-4xl mx-auto space-y-24">
        
        {/* HEADER */}
        <header className="text-center space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="label-caps text-gold flex justify-center items-center gap-3">
             <ShieldCheck size={16} /> Registry Verification
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-none">
            Asset <span className="text-gold not-italic">Proof.</span>
          </h1>
          <p className="text-obsidian-500 text-sm uppercase font-bold tracking-[0.3em] max-w-md mx-auto">
            Physical provenance and digital registry verification.
          </p>
        </header>

        {/* SEARCH BOX */}
        <section className="max-w-2xl mx-auto">
          <form onSubmit={handleVerify} className="relative group">
            <input 
              type="text" 
              placeholder="ENTER SERIAL OR GIA ID..."
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              className="w-full bg-white border border-ivory-300 rounded-xl py-8 px-10 text-obsidian-900 font-bold uppercase placeholder:text-ivory-300 outline-none focus:border-gold transition-all shadow-xl"
            />
            <button 
              type="submit" 
              disabled={isVerifying} 
              className="absolute right-4 top-4 bottom-4 px-8 bg-obsidian-900 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-gold transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {isVerifying ? <Loader2 className="animate-spin" size={14}/> : 'Verify'} <ArrowRight size={14} />
            </button>
          </form>
          {error && <p className="text-center mt-6 text-red-500 font-bold uppercase tracking-widest text-[10px]">{error}</p>}
        </section>

        {/* RESULT REVEAL */}
        <AnimatePresence>
          {certData && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-ivory-300 rounded-2xl p-10 md:p-20 shadow-2xl relative overflow-hidden"
            >
              <Award className="absolute -right-20 -bottom-20 text-gold/5 w-96 h-96" />
              
              <div className="relative z-10 space-y-16">
                <div className="flex justify-between items-start border-b border-ivory-100 pb-10">
                  <div className="space-y-2">
                    <p className="label-caps text-gold">Registry Match Verified</p>
                    <h2 className="text-4xl md:text-6xl font-medium text-obsidian-900 font-serif italic uppercase leading-none">
                      {certData.name}
                    </h2>
                  </div>
                  <ShieldCheck size={48} className="text-gold" strokeWidth={1} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <DataPoint label="Category" value={certData.category} />
                   <DataPoint label="Serial Number" value={certData.serial_number} />
                   <DataPoint label="Purity/Grade" value={certData.gold_purity || certData.specifications?.clarity || 'Verified'} />
                   <DataPoint label="Issued" value={new Date(certData.created_at).toLocaleDateString()} />
                </div>

                <button 
                  onClick={generateVaultPDF} 
                  className="w-full py-6 bg-obsidian-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold transition-all flex items-center justify-center gap-4 shadow-lg"
                >
                  Download Official Certificate <Download size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

function DataPoint({ label, value }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-obsidian-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-medium text-obsidian-900 font-serif italic uppercase">{value}</p>
    </div>
  )
}