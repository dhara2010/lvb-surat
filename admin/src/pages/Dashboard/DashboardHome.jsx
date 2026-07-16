import React, { useState, useEffect } from 'react';
import { Users, Calendar, Image as ImageIcon, MessageSquare, MapPin, BookOpen, Bell } from 'lucide-react';

export default function DashboardHome({ setTab }) {
  const [stats, setStats] = useState([
    { label: 'Total Members', count: '...', icon: Users, tab: 'members', color: 'text-cyan-400 bg-cyan-500/10' },
    { label: 'Total Events', count: '...', icon: Calendar, tab: 'events', color: 'text-amber-400 bg-amber-500/10' },
    { label: 'Gallery Images', count: '...', icon: ImageIcon, tab: 'gallery', color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Visitor Inquiries', count: '...', icon: MessageSquare, tab: 'contacts', color: 'text-indigo-400 bg-indigo-500/10' },
    { label: 'Chapters', count: '...', icon: MapPin, tab: 'chapters', color: 'text-purple-400 bg-purple-500/10' },
    { label: 'Blog Posts', count: '...', icon: BookOpen, tab: 'blogs', color: 'text-rose-400 bg-rose-500/10' },
    { label: 'Notifications', count: '...', icon: Bell, tab: 'notifications', color: 'text-yellow-400 bg-yellow-500/10' },
  ]);

  useEffect(() => {
    const endpoints = [
      { url: '/api/members', index: 0 },
      { url: '/api/events', index: 1 },
      { url: '/api/gallery', index: 2 },
      { url: '/api/contacts', index: 3 },
      { url: '/api/chapters', index: 4 },
      { url: '/api/blogs', index: 5 },
      { url: '/api/notifications', index: 6 },
    ];
    
    endpoints.forEach(async (ep) => {
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + ep.url);
        const data = await res.json();
        setStats(prev => {
          const next = [...prev];
          next[ep.index].count = Array.isArray(data) ? data.length : 0;
          return next;
        });
      } catch (err) {
        console.error("Failed to load stat: " + ep.url, err);
      }
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl font-black text-slate-100 mb-2">Welcome back, Admin.</h2>
        <p className="text-slate-400 text-sm">Here is a premium real-time overview of the LVB Surat platform contents.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              onClick={() => setTab(stat.tab)}
              className="bg-slate-900/30 p-6 rounded-3xl border border-slate-800/80 shadow-sm hover:shadow-lg cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:border-slate-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${stat.color} group-hover:scale-105 duration-300`}>
                  <Icon size={24} />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-100">{stat.count}</div>
                <div className="text-sm font-semibold text-slate-400 mt-1">{stat.label}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
