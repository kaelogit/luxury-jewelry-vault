'use client'

import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Send, User, ShieldCheck, Gem, MoreVertical, 
  Search, MessageSquare, Loader2, Lock, 
  ArrowLeft, Clock, Fingerprint, Globe, Briefcase
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminConciergeHub() {
  const [threads, setThreads] = useState<any[]>([])
  const [selectedThread, setSelectedThread] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [adminId, setAdminId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // I. SYNC COMMAND CENTER
  useEffect(() => {
    const initHub = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setAdminId(user.id)

      // Fetch active threads with client profile data
      const { data, error } = await supabase
        .from('chat_threads')
        .select(`
          *,
          profiles:client_id (full_name, country, role)
        `)
        .order('created_at', { ascending: false })

      if (data) setThreads(data)
      setLoading(false)
    }

    initHub()

    // Real-time Listener for New Threads
    const threadChannel = supabase.channel('thread-watch').on('postgres_changes', { 
      event: '*', schema: 'public', table: 'chat_threads' 
    }, () => initHub()).subscribe()

    return () => { supabase.removeChannel(threadChannel) }
  }, [])

  // II. DIALOGUE INGRESS
  useEffect(() => {
    if (!selectedThread) return

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', selectedThread.id)
        .order('created_at', { ascending: true })
      
      if (data) setMessages(data)
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }

    fetchMessages()

    const msgChannel = supabase.channel(`msgs-${selectedThread.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `thread_id=eq.${selectedThread.id}` 
      }, (payload) => {
        setMessages(prev => [...prev, payload.new])
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      }).subscribe()

    return () => { supabase.removeChannel(msgChannel) }
  }, [selectedThread])

  // III. TRANSMIT HANDSHAKE
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !adminId || !selectedThread) return

    const content = newMessage
    setNewMessage('')

    const { error } = await supabase.from('messages').insert([
      { 
        thread_id: selectedThread.id, 
        sender_id: adminId, 
        sender_type: 'custodian', 
        content 
      }
    ])
  }

  if (loading) return (
    <div className="h-screen bg-ivory-100 flex flex-col items-center justify-center gap-6">
      <Loader2 className="text-gold animate-spin" size={40} />
      <p className="text-[10px] text-obsidian-400 uppercase tracking-[0.5em] font-black italic">Synchronizing Admin Node...</p>
    </div>
  )

  return (
    <div className="h-[calc(100vh-140px)] flex gap-8 overflow-hidden selection:bg-gold selection:text-white">
      
      {/* 1. SIDEBAR: MEMBER REGISTRY */}
      <aside className="w-96 flex flex-col bg-white border border-ivory-300 rounded-[3rem] overflow-hidden shadow-sm">
        <div className="p-10 border-b border-ivory-300 bg-ivory-50 space-y-6">
          <div className="flex items-center gap-3">
             <Fingerprint size={18} className="text-gold" />
             <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-obsidian-900 italic">Member Registry</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-obsidian-400" size={14} />
            <input 
              placeholder="SEARCH IDENTITIES..." 
              className="w-full bg-white border border-ivory-300 rounded-2xl py-4 pl-12 pr-6 text-[10px] uppercase tracking-widest outline-none focus:border-gold/50 transition-all" 
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {threads.map((thread) => (
            <motion.div 
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className={`p-10 border-b border-ivory-100 cursor-pointer transition-all ${selectedThread?.id === thread.id ? 'bg-ivory-100 border-r-4 border-gold' : 'hover:bg-ivory-50'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-[11px] font-black text-obsidian-900 uppercase tracking-widest">
                  {thread.profiles?.full_name || 'Anonymous Sovereign'}
                </h4>
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              </div>
              <p className="text-[10px] text-gold uppercase font-black tracking-tighter italic mb-1">{thread.title}</p>
              <p className="text-[12px] text-obsidian-400 truncate italic font-light">Last pulse: {new Date(thread.created_at).toLocaleDateString()}</p>
            </motion.div>
          ))}
        </div>
      </aside>

      {/* 2. MAIN: CONCIERGE TERMINAL */}
      <section className="flex-1 flex flex-col bg-white border border-ivory-300 rounded-[3.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
          <ShieldCheck size={400} />
        </div>

        {selectedThread ? (
          <>
            <div className="p-8 border-b border-ivory-300 flex justify-between items-center bg-white relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-ivory-50 rounded-2xl flex items-center justify-center border border-ivory-200 shadow-inner">
                  <User size={24} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-obsidian-900 uppercase tracking-[0.2em]">
                    {selectedThread.profiles?.full_name}
                  </h3>
                  <p className="text-[9px] text-gold font-black tracking-[0.4em] uppercase italic">Encrypted Dialogue Active</p>
                </div>
              </div>
              <div className="flex gap-4">
                 <div className="px-4 py-2 bg-ivory-50 rounded-full border border-ivory-200 text-[8px] font-black text-obsidian-300 uppercase tracking-widest">
                   TLS 1.3 SECURED
                 </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 space-y-12 relative z-10 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender_type === 'custodian' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[70%] p-8 rounded-[2.5rem] text-[13px] leading-relaxed shadow-sm ${
                    msg.sender_type === 'custodian' 
                    ? 'bg-obsidian-900 text-gold rounded-tr-none italic font-light' 
                    : 'bg-ivory-50 text-obsidian-900 rounded-tl-none border border-ivory-200'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[8px] text-obsidian-300 font-black uppercase tracking-widest mt-4 px-2">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="p-10 border-t border-ivory-300 bg-white relative z-20">
              <form onSubmit={handleSend} className="relative max-w-5xl mx-auto">
                <input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="TRANSMIT CUSTODIAN COMMAND..."
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-[2.5rem] py-8 pl-10 pr-24 text-[12px] text-obsidian-900 uppercase tracking-widest outline-none focus:border-gold/50 transition-all shadow-inner"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-obsidian-900 text-gold rounded-full flex items-center justify-center hover:bg-gold hover:text-white transition-all shadow-2xl">
                  <Send size={24} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-obsidian-200 gap-8">
            <Lock size={60} className="opacity-10" />
            <p className="text-[10px] uppercase tracking-[0.8em] font-black italic">Awaiting Member Ingress</p>
          </div>
        )}
      </section>

      {/* 3. RIGHT: MEMBER DOSSIER */}
      {selectedThread && (
        <aside className="w-96 bg-white border border-ivory-300 rounded-[3rem] p-12 space-y-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[60px]" />
          
          <div className="space-y-10 relative z-10">
            <h3 className="text-[11px] uppercase tracking-[0.5em] text-gold font-black border-b border-ivory-100 pb-6 italic">Member Dossier</h3>
            
            <div className="space-y-8">
              <DossierItem label="Identity" value={selectedThread.profiles?.full_name} icon={<User size={12}/>} />
              <DossierItem label="Location" value={selectedThread.profiles?.country || 'GLOBAL'} icon={<Globe size={12}/>} />
              <DossierItem label="Member Tier" value={selectedThread.profiles?.role || 'Sterling'} icon={<Gem size={12}/>} />
              <DossierItem label="Thread ID" value={`TRD_${selectedThread.id.slice(0, 8)}`} icon={<Briefcase size={12}/>} />
            </div>
          </div>

          <div className="p-10 bg-ivory-50 border border-ivory-200 rounded-[3rem] space-y-4">
             <ShieldCheck size={20} className="text-gold" />
             <p className="text-[10px] text-obsidian-400 leading-relaxed font-bold uppercase tracking-widest italic leading-relaxed">
               All Custodian dialogue is logged for internal auditing. End-to-end encryption is maintained for the client endpoint.
             </p>
          </div>
        </aside>
      )}
    </div>
  )
}

function DossierItem({ label, value, icon }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 text-obsidian-300">
        {icon}
        <span className="text-[9px] text-obsidian-300 uppercase font-black tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-bold text-obsidian-900 uppercase italic tracking-tight border-l border-gold/20 pl-4">
        {value}
      </p>
    </div>
  )
}