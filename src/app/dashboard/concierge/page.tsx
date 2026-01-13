import { createServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ConciergeClient from './ConciergeClient'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

export default async function ConciergePage() {
  const supabase = await createServer()

  // 1. Secure Authentication Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // 2. Initial Data Acquisition (Prevents Loading Flickers)
  const { data: threads } = await supabase
    .from('chat_threads')
    .select('*')
    .eq('client_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <Suspense fallback={
      <div className="h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-gold" size={32} />
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Opening Support Terminal...</p>
      </div>
    }>
      <ConciergeClient userId={user.id} initialThreads={threads || []} />
    </Suspense>
  )
}