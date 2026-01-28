'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { Send, ShieldCheck, Loader2, MessageSquare, Clock, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  threadId: string
  currentUserId: string
}

export default function ConciergeChat({ threadId, currentUserId }: Props) {
  const supabase = createClient()
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!threadId) return
    fetchMessages()

    // REAL-TIME SYNC
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

    if (error) console.error("Message failure:", error)
  }

  return (
    <div className="flex flex-col h-[750px] bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-2xl relative font-sans">
      
      {/* WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
        <Sparkles size={400} className="text-obsidian-900" />
      </div>

      {/* HEADER */}
      <header className="px-8 py-6 border-b border-gray-50 bg-white/90 backdrop-blur-md flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gold border border-gold/10">
               <MessageSquare size={20} strokeWidth={1.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-obsidian-900 mb-1">Private Concierge</h4>
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">Live Session</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
          <ShieldCheck size={12} className="text-gold" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Encrypted</span>
        </div>
      </header>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-10 space-y-8 relative z-10 bg-gray-50/30">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-gold" size={24} />
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Loading History...</p>
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="text-center py-20 opacity-40">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Begin secure dialogue</p>
              </div>
            )}
            {messages.map((msg) => {
                const isMe = msg.sender_id === currentUserId
                return (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`max-w-[85%] md:max-w-[70%] space-y-2`}>
                    <div className={`p-6 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        isMe 
                        ? 'bg-obsidian-900 text-white rounded-br-sm' 
                        : 'bg-white text-obsidian-900 rounded-bl-sm border border-gray-100'
                    }`}>
                        {msg.content}
                    </div>
                    <div className={`flex items-center gap-2 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    </div>
                </motion.div>
                )
            })}
          </>
        )}
        <div ref={scrollRef} />
      </div>

      {/* INPUT AREA */}
      <form onSubmit={sendMessage} className="p-6 md:p-8 bg-white border-t border-gray-100 relative z-10">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-obsidian-900 text-sm outline-none focus:border-gold transition-all placeholder:text-gray-400 font-medium"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-2 p-3 bg-obsidian-900 text-white rounded-xl hover:bg-gold hover:text-black transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Send size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        <p className="text-center mt-4 text-[8px] font-bold text-gray-300 uppercase tracking-[0.2em]">
            Avg. Response Time: 5 Minutes
        </p>
      </form>
    </div>
  )
}