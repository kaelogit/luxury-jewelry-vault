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

  // 2. Initial Data Acquisition
  const { data: threads } = await supabase
    .from('chat_threads')
    .select('*')
    .eq('client_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <Suspense fallback={<LoadingState />}>
      <ConciergeClient userId={user.id} initialThreads={threads || []} />
    </Suspense>
  )
}

function LoadingState() {
  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-gold" size={32} strokeWidth={1.5} />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Connecting to Concierge</p>
    </div>
  )
}