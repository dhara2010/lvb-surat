import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../../components/AdminUI';

export default function ContactsManager({ token }) {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/contacts', { 
      headers: { 'Authorization': `Bearer ${token}` } 
    })
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, [token]);

  return (
    <div className="flex flex-col gap-6 pb-20 text-slate-100">
      <SectionHeader title="Visitor Inquiries" desc="View incoming leads and contact submissions captured from the website." />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {data.map((d, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.05 }}
            key={d.id} 
            className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col gap-5 hover:shadow-md hover:border-slate-700 transition-all duration-300"
          >
            <div className="flex justify-between items-start pt-1 pb-5 border-b border-slate-800">
              <div className="flex flex-col gap-2">
                <h4 className="font-extrabold text-xl text-cyan-400">{d.name}</h4>
                <div className="flex flex-wrap gap-2 text-xs font-bold tracking-wider text-slate-400">
                  <span className="bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">{d.email}</span>
                  <span className="bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">{d.phone}</span>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-1 font-bold shrink-0 text-right">
                {new Date(d.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap px-1 font-medium">{d.message}</p>
          </motion.div>
        ))}
      </div>
      {data.length === 0 && <p className="text-slate-500 p-10 text-center border border-dashed border-slate-800 bg-slate-900/10 rounded-2xl shadow-sm">Inbox is clean.</p>}
    </div>
  );
}
