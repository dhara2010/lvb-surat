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
    <div className="flex flex-col gap-6 pb-20">
      <SectionHeader title="Visitor Inquiries" desc="View leads generated from the frontend contact systems." />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {data.map((d, i) => (
          <motion.div 
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
            key={d.id} 
            className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start pt-1 pb-5 border-b border-border">
              <div className="flex flex-col gap-2">
                <h4 className="font-extrabold text-xl text-secondary">{d.name}</h4>
                <div className="flex flex-wrap gap-2 text-xs font-bold tracking-wider text-muted">
                  <span className="bg-bg-alt border border-border px-3 py-1.5 rounded-lg text-gray-700">{d.email}</span>
                  <span className="bg-bg-alt border border-border px-3 py-1.5 rounded-lg text-gray-700">{d.phone}</span>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted mt-1 font-bold shrink-0 text-right">
                {new Date(d.created_at).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap px-1 font-medium">{d.message}</p>
          </motion.div>
        ))}
      </div>
      {data.length === 0 && <p className="text-muted p-10 text-center border border-dashed border-border rounded-2xl bg-white shadow-sm mt-4 font-semibold">Inbox is clean.</p>}
    </div>
  );
}
