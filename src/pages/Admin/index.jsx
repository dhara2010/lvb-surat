import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Users, Calendar, MessageSquare, LogOut, ShieldCheck, Shield, Layers, ChevronRight } from 'lucide-react';

import EventsManager from './components/EventsManager';
import LeadersManager from './components/LeadersManager';
import MembersManager from './components/MembersManager';
import GalleryManager from './components/GalleryManager';
import ContactsManager from './components/ContactsManager';

const BACKGROUND_GRADIENT = 'linear-gradient(135deg, #020914 0%, #0B1F3A 100%)';
const GLASS_BG = 'rgba(255, 255, 255, 0.03)';
const GLASS_BORDER = 'rgba(255, 255, 255, 0.1)';
const ACCENT = '#14B8A6';

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('events');

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('adminToken', data.token);
    } else {
      alert('Invalid Credentials. Please try again.');
    }
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans" style={{ background: BACKGROUND_GRADIENT }}>
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#14B8A6]/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#0B1F3A] blur-[150px] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md p-10 rounded-[32px] shadow-2xl backdrop-blur-2xl text-white"
          style={{ backgroundColor: GLASS_BG, border: `1px solid ${GLASS_BORDER}` }}
        >
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#14B8A6] to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/30 mb-5">
              <ShieldCheck size={32} className="text-[#0B1F3A]" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Admin <span style={{ color: ACCENT }}>Portal</span></h2>
            <p className="text-sm text-gray-400 mt-2 tracking-wide font-medium">LVB SURAT PLATINUM CHAPTER</p>
          </div>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider pl-1 text-gray-400">Username</label>
              <input required type="text" value={username} onChange={e=>setUsername(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#14B8A6] focus:bg-white/10 transition-all font-medium" 
                placeholder="Enter admin username"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider pl-1 text-gray-400">Password</label>
              <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#14B8A6] focus:bg-white/10 transition-all font-medium" 
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full mt-4 bg-gradient-to-r from-[#14B8A6] to-emerald-500 text-[#0B1F3A] p-4 rounded-xl font-black tracking-widest uppercase hover:shadow-[0_0_20px_rgba(20,184,166,0.5)] hover:scale-[1.02] transition-all">
              Secure Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans overflow-hidden" style={{ background: BACKGROUND_GRADIENT }}>
      
      {/* ─── SIDEBAR ───────────────── */}
      <div className="w-[280px] h-screen shrink-0 flex flex-col border-r shadow-2xl relative z-20" style={{ backgroundColor: '#061121', borderColor: GLASS_BORDER }}>
        <div className="p-8 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#14B8A6]">
            <Layers size={20} className="text-[#0B1F3A]" />
          </div>
          <div>
            <div className="font-black text-lg tracking-widest text-[#14B8A6] leading-none">LVB ADMIN</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Workspace</div>
          </div>
        </div>
        
        <div className="flex flex-col p-5 gap-2 flex-grow overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 pl-2">Database Collections</div>
          <MenuBtn icon={<Calendar />} label="Events Schedule" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
          <MenuBtn icon={<Shield />} label="Leadership Team" active={activeTab === 'leaders'} onClick={() => setActiveTab('leaders')} />
          <MenuBtn icon={<Users />} label="Members Directory" active={activeTab === 'members'} onClick={() => setActiveTab('members')} />
          <MenuBtn icon={<ImageIcon />} label="Gallery Assets" active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} />
          <div className="text-xs font-bold uppercase tracking-wider text-gray-600 mt-6 mb-2 pl-2">External Traffic</div>
          <MenuBtn icon={<MessageSquare />} label="Visitor Inquiries" active={activeTab === 'contacts'} onClick={() => setActiveTab('contacts')} />
        </div>
        
        <div className="p-6 border-t border-white/5">
          <button onClick={logout} className="w-full p-4 flex items-center justify-center gap-2 rounded-xl text-red-400 font-bold bg-red-500/10 hover:bg-red-500/20 transition-colors">
            <LogOut size={16} /> Secure Logout
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTENT ───────────────── */}
      <div className="flex-1 h-screen overflow-y-auto relative z-10 p-10 scroll-smooth">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'events' && <EventsManager token={token} />}
              {activeTab === 'leaders' && <LeadersManager token={token} />}
              {activeTab === 'members' && <MembersManager token={token} />}
              {activeTab === 'gallery' && <GalleryManager token={token} />}
              {activeTab === 'contacts' && <ContactsManager token={token} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const MenuBtn = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 w-full text-left group ${active ? 'bg-gradient-to-r from-[#14B8A6]/20 to-transparent' : 'hover:bg-white/5'}`}
    style={{ borderLeft: active ? '4px solid #14B8A6' : '4px solid transparent' }}
  >
    <div className={`transition-colors ${active ? 'text-[#14B8A6]' : 'text-gray-400 group-hover:text-white'}`}>
      {React.cloneElement(icon, { size: 18, strokeWidth: active ? 2.5 : 2 })}
    </div>
    <span className={`font-semibold text-sm ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{label}</span>
    {active && <ChevronRight size={16} className="ml-auto text-[#14B8A6] opacity-50" />}
  </button>
);


