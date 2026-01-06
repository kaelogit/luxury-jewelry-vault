'use client'

import React, { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, ShieldCheck, Lock, Loader2, Fingerprint, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  threadId: string
  currentUserId: string
}

export default function ConciergeChat({ threadId, currentUserId }: Props) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!threadId) return
    fetchMessages()

    // I. REALTIME HANDSHAKE: Listening to the specific thread
    const channel = supabase
      .channel(`thread-${threadId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `thread_id=eq.${threadId}` 
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [threadId])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function fetchMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })
    
    if (data) setMessages(data)
    setLoading(false)
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !threadId) return

    const content = newMessage
    setNewMessage('')

    const { error } = await supabase.from('messages').insert([
      {
        thread_id: threadId,
        sender_id: currentUserId,
        sender_type: 'client',
        content: content
      }
    ])

    if (error) console.error("Secure Channel Failure", error)
  }

  return (
    <div className="flex flex-col h-[700px] bg-white border border-ivory-300 rounded-[3.5rem] overflow-hidden shadow-2xl relative">
      {/* Background Security Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <ShieldCheck size={400} className="text-obsidian-900" />
      </div>

      {/* HEADER: Institutional Protocol */}
      <header className="p-8 border-b border-ivory-100 bg-white/80 backdrop-blur-xl flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 bg-ivory-50 rounded-xl flex items-center justify-center text-gold border border-gold/10">
               <Fingerprint size={20} />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-obsidian-900 italic leading-none mb-1">Secure Concierge Desk</h4>
            <div className="flex items-center gap-2">
               <Globe size={10} className="text-gold" />
               <span className="text-[8px] font-black text-obsidian-300 uppercase tracking-widest">Node: Zurich_Secure_Link</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-ivory-50 rounded-full border border-ivory-200">
          <Lock size={10} className="text-gold" />
          <span className="text-[8px] font-black uppercase tracking-widest text-obsidian-400">AES-256 E2E</span>
        </div>
      </header>

      {/* DIALOGUE FEED */}
      <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar relative z-10">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-6">
            <Loader2 className="animate-spin text-gold" size={32} />
            <p className="text-[10px] text-obsidian-300 uppercase tracking-[0.5em] font-black italic">Decrypting Registry...</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId
            return (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] space-y-3`}>
                  <div className={`p-6 rounded-[2.5rem] text-[13px] italic leading-relaxed shadow-sm ${
                    isMe 
                      ? 'bg-gold text-white rounded-br-none font-medium' 
                      : 'bg-ivory-50 text-obsidian-900 rounded-bl-none border border-ivory-200'
                  }`}>
                    {msg.content}
                  </div>
                  <p className={`text-[9px] font-black uppercase tracking-widest px-4 ${
                    isMe ? 'text-right text-obsidian-200' : 'text-left text-obsidian-300'
                  }`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            )
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* INPUT COMMAND */}
      <form onSubmit={sendMessage} className="p-8 bg-white border-t border-ivory-100 relative z-10">
        <div className="relative flex items-center max-w-4xl mx-auto">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Transmit secure protocol message..."
            className="w-full bg-ivory-50 border border-ivory-300 rounded-[2rem] px-8 py-6 text-obsidian-900 text-sm italic outline-none focus:border-gold transition-all placeholder:text-ivory-300 shadow-inner"
          />
          <button 
            type="submit"
            className="absolute right-3 p-5 bg-obsidian-900 text-gold rounded-full hover:bg-gold hover:text-white transition-all shadow-xl active:scale-95 group"
          >
            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
          </button>
        </div>
      </form>
    </div>
  )
}