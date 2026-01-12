'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, Truck, Settings, 
  Power, ShieldCheck, UserCircle, 
  Box, Menu, X, CreditCard, ShoppingBag,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import { Toaster } from 'sonner'; // Integrated for Live Notifications
import LiveNotifications from '@/components/ui/LiveNotifications'; // Headless listener

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const pathname = usePathname();
  const router = useRouter();
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        window.location.href = '/auth/login?redirect=/admin/dashboard';
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        router.replace('/dashboard');
        return;
      }

      setAdminProfile(profile);
      setLoading(false);
    };

    checkAdmin();
  }, [router, supabase]);

  // Sync mobile menu close with route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
    window.location.href = '/auth/login';
  };

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center gap-6">
      <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      <div className="text-center space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">Lume Vault</p>
        <p className="text-[8px] text-gray-500 uppercase tracking-widest px-4">Accessing Administrative Workspace</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 text-black font-sans selection:bg-gold selection:text-white overflow-hidden">
      
      {/* I. GLOBAL NOTIFICATION SYSTEM */}
      <Toaster position="top-right" expand={false} richColors closeButton />
      {adminProfile?.id && <LiveNotifications userId={adminProfile.id} type="admin" />}

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-100 flex flex-col p-8 z-[50] transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* BRANDING */}
        <div className="mb-10 px-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-black flex items-center justify-center rounded-lg shadow-lg">
                <ShieldCheck size={18} className="text-gold" />
             </div>
             <h1 className="text-xl font-bold tracking-tight text-black font-serif italic">
               Lume <span className="text-gold not-italic font-sans">Admin</span>
             </h1>
          </div>
          <button className="lg:hidden p-2 hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* ADMIN IDENTITY CARD */}
        <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
           <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gold shadow-sm shrink-0">
              <UserCircle size={24} strokeWidth={1.5} />
           </div>
           <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-black truncate uppercase">{adminProfile?.full_name || 'Boutique Admin'}</p>
              <p className="text-[8px] font-bold text-gold uppercase tracking-widest">Vault Administrator</p>
           </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
          <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest pl-4 mb-3">Boutique Operations</p>
          <NavItem href="/admin/dashboard" icon={<LayoutDashboard size={18}/>} label="Overview" active={pathname === '/admin/dashboard'} />
          <NavItem href="/admin/inventory" icon={<Box size={18}/>} label="Inventory" active={pathname === '/admin/inventory'} />
          <NavItem href="/admin/orders" icon={<ShoppingBag size={18}/>} label="Customer Orders" active={pathname === '/admin/orders'} />
          <NavItem href="/admin/payments" icon={<CreditCard size={18}/>} label="Payments" active={pathname === '/admin/payments'} />
          
          <div className="pt-8">
            <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest pl-4 mb-3">Client Relations</p>
            <NavItem href="/admin/customers" icon={<Users size={18}/>} label="Client Registry" active={pathname === '/admin/customers'} />
            <NavItem href="/admin/tracking" icon={<Truck size={18}/>} label="Shipping Status" active={pathname === '/admin/tracking'} />
            <NavItem href="/admin/concierge" icon={<MessageSquare size={18}/>} label="Support Center" active={pathname.startsWith('/admin/concierge')} />
          </div>
        </nav>

        {/* FOOTER ACTIONS */}
        <div className="mt-auto pt-6 border-t border-gray-100">
          <NavItem href="/admin/settings" icon={<Settings size={18}/>} label="Settings" active={pathname === '/admin/settings'} />
          
          <button 
            type="button"
            onClick={handleLogout}
            className="w-full mt-2 flex items-center gap-4 px-5 py-4 rounded-xl transition-all text-gray-400 hover:text-red-500 hover:bg-red-50 group"
          >
            <Power size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* MOBILE HEADER BAR */}
        <header className="lg:hidden h-20 bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0 sticky top-0 z-[30]">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold italic font-serif">Lume <span className="text-gold not-italic font-sans">Vault</span></h1>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="p-3 bg-gray-50 text-black rounded-xl active:scale-90 transition-all shadow-sm"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 lg:p-12 pb-24 md:pb-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label, active }: { href: string, icon: any, label: string, active: boolean }) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all group ${
        active 
        ? 'bg-black text-white shadow-xl shadow-black/10 scale-[1.02]' 
        : 'text-gray-400 hover:text-black hover:bg-white hover:shadow-sm'
      }`}>
        <span className={`${active ? 'text-gold' : 'text-gray-300 group-hover:text-gold'} transition-colors`}>
          {icon}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap">{label}</span>
      </div>
    </Link>
  );
}