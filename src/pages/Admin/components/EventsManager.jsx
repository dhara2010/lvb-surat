import React, { useState, useEffect } from 'react';
import { SectionHeader, InputGroup, SubmitButton, PremiumTable, DeleteBtn, EditBtn } from './AdminUI';

export default function EventsManager({ token }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ date: '', month: '', title: '' });

  const [editingId, setEditingId] = useState(null);

  const loadData = () => fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/events').then(res=>res.json()).then(setData);
  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`http://localhost:5000/api/events/${editingId}`, {
        method:'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify(form)
      });
      setEditingId(null);
    } else {
      await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/events', {
        method:'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify(form)
      });
    }
    setForm({ date: '', month: '', title: '' });
    loadData();
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({ date: d.date, month: d.month, title: d.title });
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete event from database?')) return;
    await fetch(`http://localhost:5000/api/events/${id}`, { method:'DELETE', headers:{'Authorization': `Bearer ${token}`}});
    loadData();
  };

  return (
    <div className="flex flex-col gap-6 text-white pb-20">
      <SectionHeader title="Event Schedule" desc="Manage upcoming dates and networking conclaves." />
      
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
          <InputGroup label="Date" placeholder="e.g. 15" val={form.date} setVal={v => setForm({...form, date: v})} w="w-[80px]" />
          <InputGroup label="Month" placeholder="e.g. Aug" val={form.month} setVal={v => setForm({...form, month: v})} w="w-[100px]" />
          <InputGroup label="Event Title" placeholder="Next big seminar..." val={form.title} setVal={v => setForm({...form, title: v})} w="flex-1 min-w-[200px]" />
          <SubmitButton editing={editingId !== null} />
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ date: '', month: '', title: '' }); }} className="h-[46px] ml-2 px-6 rounded-xl font-bold uppercase tracking-wider bg-white/10 text-white hover:bg-white/20 transition-all">
              Cancel
            </button>
          )}
        </form>
      </div>

      <PremiumTable 
        headers={['Date Block', 'Event Description', 'Action']}
        rows={data.map(d => (
          <tr key={d.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="p-5 font-black text-lg text-white w-40">
              <span className="text-[#14B8A6]">{d.date}</span> <span className="opacity-70 text-sm uppercase">{d.month}</span>
            </td>
            <td className="p-5 font-medium text-gray-200">{d.title}</td>
            <td className="p-5 w-32 text-right">
              <EditBtn onClick={()=>handleEdit(d)} />
              <DeleteBtn onClick={()=>handleDelete(d.id)} />
            </td>
          </tr>
        ))}
        emptyText="No events found."
      />
    </div>
  );
}
