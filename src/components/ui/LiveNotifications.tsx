'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase' // FIX: Factory import
import { toast } from 'sonner'
import { MessageSquare } from 'lucide-react'

interface Props {
  userId: string;
  type: 'admin' | 'client';
}

export default function LiveNotifications({ userId, type }: Props) {
  const supabase = createClient() // FIX: Standard factory initialization

  useEffect(() => {
    if (!userId) return

    // I. GLOBAL LISTENER: Monitoring the secure message stream
    const channel = supabase.channel('global-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, async (payload) => {
        const newMsg = payload.new
        
        let shouldNotify = false

        if (type === 'admin') {
          // Admins are notified of any message sent by a client
          shouldNotify = newMsg.sender_type === 'client'
        } else {
          // Clients are only notified if the message is from an admin 
          // AND belongs to a thread they own.
          if (newMsg.sender_type === 'admin') {
            const { data: thread } = await supabase
              .from('chat_threads')
              .select('client_id')
              .eq('id', newMsg.thread_id)
              .single()

            if (thread?.client_id === userId) {
              shouldNotify = true
            }
          }
        }

        if (shouldNotify) {
          toast.custom((t) => (
            <div className="bg-obsidian-900 border border-gold/30 p-5 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] animate-in slide-in-from-right-5 selection:bg-gold">
              <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold shrink-0 border border-gold/20">
                <MessageSquare size={18} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">
                  {type === 'admin' ? 'New Client Inquiry' : 'New Message Received'}
                </p>
                <p className="text-xs text-white line-clamp-1 opacity-80 font-medium italic">
                  "{newMsg.content}"
                </p>
              </div>
              <button 
                onClick={() => toast.dismiss(t)}
                className="text-[9px] font-black text-obsidian-400 uppercase tracking-tighter hover:text-gold transition-colors ml-2"
              >
                Dismiss
              </button>
            </div>
          ), { duration: 6000, position: 'top-right' })
          
          // II. AESTHETIC CUE: Subtle audio feedback
          const audio = new Audio('/chime.mp3')
          audio.volume = 0.15
          audio.play().catch(() => {
            // Browsers block auto-play until first user interaction; ignore error
          })
        }
      })
      .subscribe()

    return () => { 
      supabase.removeChannel(channel) 
    }
  }, [userId, type, supabase])

  return null // Headless logic provider
}