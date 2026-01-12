'use client'

import React, { useState, useEffect } from 'react'
import { 
  Bitcoin, Coins, Landmark, Smartphone, 
  ShieldCheck, ArrowRight, ChevronLeft, Loader2, 
  CheckCircle2, DollarSign, Camera, Copy, Info,
  Apple, CreditCard, Lock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'

export default function PaymentStep({ data, update, onBack, onComplete, isSubmitting }: any) {
  const supabase = createClient()
  
  const [activeGroup, setActiveGroup] = useState<'crypto' | 'fintech' | 'bank' | null>(null)
  const [vaultDetails, setVaultDetails] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copyStatus, setCopyStatus] = useState('Copy')

  useEffect(() => {
    async function fetchVaultDetails() {
      setLoadingDetails(true)
      // id: 1 refers to the master boutique configuration for Lume Vault
      const { data: settings } = await supabase.from('store_settings').select('*').eq('id', 1).single()
      if (settings) setVaultDetails(settings)
      setLoadingDetails(false)
    }
    fetchVaultDetails()
  }, [supabase])

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    const file = e.target.files[0]
    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const fileName = `settlement-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
    
    try {
      const { data: uploadData, error } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file)

      if (error) throw error

      if (uploadData) {
        const { data: urlData } = supabase.storage.from('payment-proofs').getPublicUrl(fileName)
        update({ ...data, payment_proof: urlData.publicUrl })
      }
    } catch (err: any) {
      alert("Verification Error: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  const selectSubMethod = (methodName: string, walletOrTag: string) => {
    update({ 
      ...data, 
      paymentMethod: methodName, 
      wallet_address: walletOrTag
    });
  }

  const handleCopy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus('Copied')
      setTimeout(() => setCopyStatus('Copy'), 2000)
    } catch (err) {
      console.error("Clipboard access restricted")
    }
  }

  return (
    <div className="space-y-8 md:space-y-10">
      
      {/* I. HEADER & NAVIGATION */}
      <div className="space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-gold uppercase tracking-widest transition-colors group">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Return to Logistics
        </button>
        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-bold text-obsidian-900 font-serif italic tracking-tight">
            Secure <span className="text-gold not-italic">Settlement</span>
          </h2>
          <p className="text-gray-500 text-xs md:text-sm max-w-lg leading-relaxed">
            Choose your settlement channel. Sovereign digital assets verify via network consensus, while Bank and Direct Fintech transfers undergo private audit.
          </p>
        </div>
      </div>

      {/* II. PRIMARY GROUP SELECTION: Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <MethodGroupCard 
          active={activeGroup === 'crypto'} 
          onClick={() => {setActiveGroup('crypto'); update({...data, paymentMethod: '', wallet_address: ''})}}
          icon={<Bitcoin className="text-[#F7931A]" size={20} />} 
          label="Sovereign Assets" 
          sub="BTC / ETH / USDT" 
        />
        <MethodGroupCard 
          active={activeGroup === 'fintech'} 
          onClick={() => {setActiveGroup('fintech'); update({...data, paymentMethod: '', wallet_address: ''})}}
          icon={<Smartphone className="text-blue-500" size={20} />} 
          label="Direct Fintech" 
          sub="PayPal / CashApp" 
        />
        <MethodGroupCard 
          active={activeGroup === 'bank'} 
          onClick={() => {setActiveGroup('bank'); selectSubMethod('Bank Wire', vaultDetails?.account_number)}}
          icon={<Landmark className="text-gold" size={20} />} 
          label="Bank Wire" 
          sub="Institutional Transfer" 
        />
      </div>

      {/* III. SUB-METHOD INTERFACES */}
      <AnimatePresence mode="wait">
        {loadingDetails ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 flex justify-center">
            <Loader2 className="animate-spin text-gold/30" size={24} />
          </motion.div>
        ) : (
          <>
            {/* CRYPTO SUB-SELECTION */}
            {activeGroup === 'crypto' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 bg-gray-50 p-5 md:p-8 rounded-3xl border border-gray-100">
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  <SubMethodBtn active={data.paymentMethod === 'BTC'} icon={<Bitcoin size={14}/>} label="BTC" onClick={() => selectSubMethod('BTC', vaultDetails?.btc_address)} />
                  <SubMethodBtn active={data.paymentMethod === 'ETH'} icon={<Coins size={14}/>} label="ETH" onClick={() => selectSubMethod('ETH', vaultDetails?.eth_address)} />
                  <SubMethodBtn active={data.paymentMethod === 'USDT'} icon={<DollarSign size={14}/>} label="USDT" onClick={() => selectSubMethod('USDT', vaultDetails?.usdt_trc20_address)} />
                </div>

                {data.paymentMethod && (
                  <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lume Vault {data.paymentMethod} Address</p>
                      <button onClick={() => handleCopy(data.wallet_address)} className="text-[9px] font-bold text-gold uppercase flex items-center gap-1.5 active:scale-95 transition-all">
                        <Copy size={12}/> {copyStatus}
                      </button>
                    </div>
                    <p className="text-[11px] md:text-xs font-mono font-bold text-black break-all leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200">
                      {data.wallet_address || 'ADDRESS PENDING'}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* FINTECH SUB-SELECTION */}
            {activeGroup === 'fintech' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 bg-gray-50 p-5 md:p-8 rounded-3xl border border-gray-100">
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  <SubMethodBtn active={data.paymentMethod === 'CashApp'} icon={<DollarSign size={14}/>} label="CashApp" onClick={() => selectSubMethod('CashApp', vaultDetails?.cashapp_tag)} />
                  <SubMethodBtn active={data.paymentMethod === 'PayPal'} icon={<CreditCard size={14}/>} label="PayPal" onClick={() => selectSubMethod('PayPal', vaultDetails?.paypal_email)} />
                  <SubMethodBtn active={data.paymentMethod === 'Apple Pay'} icon={<Apple size={14}/>} label="Apple Pay" onClick={() => selectSubMethod('Apple Pay', vaultDetails?.apple_pay_id)} />
                </div>

                {data.paymentMethod && (
                  <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{data.paymentMethod} Receiver</p>
                      <button onClick={() => handleCopy(data.wallet_address)} className="text-[9px] font-bold text-gold uppercase flex items-center gap-1.5 active:scale-95 transition-all">
                        <Copy size={12}/> {copyStatus}
                      </button>
                    </div>
                    <p className="text-xs md:text-sm font-bold text-black uppercase tracking-tight">
                      {data.wallet_address || 'DETAILS PENDING'}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* BANK WIRE DISPLAY */}
            {activeGroup === 'bank' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 p-5 md:p-8 rounded-3xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <DetailBlock label="Institution" value={vaultDetails?.bank_name} />
                <DetailBlock label="Beneficiary" value={vaultDetails?.account_name} />
                <DetailBlock label="Account / IBAN" value={vaultDetails?.account_number} />
                <DetailBlock label="SWIFT / BIC" value={vaultDetails?.swift_code} />
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* IV. PROOF UPLOAD: Visible for Direct Methods */}
      {(activeGroup === 'fintech' || activeGroup === 'bank') && (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8 md:p-10 flex flex-col items-center text-center space-y-4 shadow-sm group hover:border-gold transition-colors">
          <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
            {data.payment_proof ? <CheckCircle2 size={24} className="text-green-500" /> : <Camera size={24} />}
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-black uppercase tracking-tight">Registry Settlement Proof</p>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">A visual capture of your {data.paymentMethod || 'transfer'} is required for audit.</p>
          </div>
          <input type="file" id="proof-upload" className="hidden" accept="image/*" onChange={handleProofUpload} />
          <label htmlFor="proof-upload" className="px-8 py-3 bg-obsidian-900 text-white rounded-full text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:bg-gold hover:text-black transition-all shadow-md active:scale-95">
            {uploading ? 'Archiving...' : data.payment_proof ? 'Replace Record' : 'Upload Record'}
          </label>
        </div>
      )}

      {/* V. FINAL ACTION */}
      <div className="pt-6 space-y-6">
        <button 
          disabled={isSubmitting || !data.paymentMethod || (activeGroup !== 'crypto' && !data.payment_proof)}
          onClick={onComplete}
          className="w-full bg-black text-white h-[75px] rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-gold hover:text-black transition-all shadow-xl disabled:opacity-20 disabled:grayscale active:scale-[0.98] group"
        >
          {isSubmitting ? (
            <>Initializing Registry <Loader2 className="animate-spin" size={20} /></>
          ) : (
            <>Finalize Acquisition <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
          )}
        </button>
        
        <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          <Lock size={10} className="text-gold" /> End-to-End Encrypted Settlement
        </div>
      </div>
    </div>
  )
}

function MethodGroupCard({ active, onClick, icon, label, sub }: any) {
  return (
    <button onClick={onClick} className={`p-5 md:p-6 rounded-2xl border transition-all text-left space-y-3 ${active ? 'border-gold bg-gold/5 ring-1 ring-gold/20' : 'border-gray-100 hover:border-gray-300 bg-white shadow-sm'}`}>
      <div className="w-10 h-10 bg-gray-50 rounded-xl shadow-sm flex items-center justify-center border border-gray-100">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-obsidian-900 uppercase tracking-tight">{label}</p>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{sub}</p>
      </div>
    </button>
  )
}

function SubMethodBtn({ active, label, icon, onClick }: any) {
  return (
    <button onClick={onClick} className={`py-4 px-2 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${active ? 'bg-black text-white border-black shadow-lg scale-105 z-10' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}>
      {icon} <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  )
}

function DetailBlock({ label, value }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-bold text-black break-all uppercase leading-relaxed">{value || '---'}</p>
    </div>
  )
}