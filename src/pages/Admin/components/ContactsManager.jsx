import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './AdminUI';

export default function ContactsManager({ token }) {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/contacts', { headers: {'Authorization': `Bearer ${token}`} })
      .then(res=>res.json()).then(setData);
  }, [token]);

  return (
    <div className="flex flex-col gap-6 text-white pb-20">
      <SectionHeader title="Visitor Inquiries" desc="View leads generated from the frontend contact systems." />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {data.map((d, i) => (
          <motion.div 
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
            key={d.id} 
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col gap-5 hover:bg-white/10 transition-colors"
          >
            <div className="flex justify-between items-start pt-1 pb-5 border-b border-white/10">
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-xl text-[#14B8A6]">{d.name}</h4>
                <div className="flex gap-4 text-xs font-semibold tracking-wider text-gray-400 pt-1">
                  <span className="bg-white/5 px-3 py-1.5 rounded-md text-gray-200">{d.email}</span>
                  <span className="bg-white/5 px-3 py-1.5 rounded-md text-gray-200">{d.phone}</span>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-gray-500 mt-1 font-bold">
                {new Date(d.created_at).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap px-2">{d.message}</p>
          </motion.div>
        ))}
      </div>
      {data.length === 0 && <p className="text-gray-400 p-10 text-center border border-dashed border-white/10 rounded-2xl bg-white/5 mt-4">Inbox is clean.</p>}
    </div>
  );
}
