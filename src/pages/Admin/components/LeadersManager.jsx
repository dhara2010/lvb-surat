import React, { useState, useEffect } from 'react';
import { SectionHeader, InputGroup, FileInputGroup, SubmitButton, PremiumTable, DeleteBtn, EditBtn } from './AdminUI';

export default function LeadersManager({ token }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: '', role: '', img: '' });

  const [editingId, setEditingId] = useState(null);

  const loadData = () => fetch('http://localhost:5000/api/leaders').then(res=>res.json()).then(setData);
  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`http://localhost:5000/api/leaders/${editingId}`, {
        method:'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify(form)
      });
      setEditingId(null);
    } else {
      await fetch('http://localhost:5000/api/leaders', {
        method:'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify(form)
      });
    }
    setForm({ name: '', role: '', img: '' });
    loadData();
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({ name: d.name, role: d.role, img: d.img });
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete leadership member?')) return;
    await fetch(`http://localhost:5000/api/leaders/${id}`, { method:'DELETE', headers:{'Authorization': `Bearer ${token}`}});
    loadData();
  };

  return (
    <div className="flex flex-col gap-6 text-white pb-20">
      <SectionHeader title="Leadership Directory" desc="Manage active board members appearing in the 3D carousel." />
      
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
          <InputGroup label="Full Name" placeholder="John Doe" val={form.name} setVal={v => setForm({...form, name: v})} w="flex-1 min-w-[200px]" />
          <InputGroup label="Position" placeholder="Vice President" val={form.role} setVal={v => setForm({...form, role: v})} w="flex-1 min-w-[150px]" />
          <FileInputGroup label="Portrait Image URL" placeholder="/members/john.png" val={form.img} setVal={v => setForm({...form, img: v})} token={token} w="flex-1 min-w-[200px]" />
          <SubmitButton editing={editingId !== null} />
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', role: '', img: '' }); }} className="h-[46px] ml-2 px-6 rounded-xl font-bold uppercase tracking-wider bg-white/10 text-white hover:bg-white/20 transition-all">
              Cancel
            </button>
          )}
        </form>
      </div>

      <PremiumTable 
        headers={['Portrait', 'Officer Details', 'Position', 'Action']}
        rows={data.map(d => (
          <tr key={d.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="p-5 w-24">
              <div className="w-12 h-12 rounded-xl bg-gray-800 overflow-hidden border border-white/10 shadow-lg">
                <img src={d.img} className="w-full h-full object-cover" onError={(e)=>e.target.style.display='none'} />
              </div>
            </td>
            <td className="p-5 font-bold text-white">{d.name}</td>
            <td className="p-5 text-gray-400 font-semibold text-sm tracking-wide">{d.role}</td>
            <td className="p-5 w-32 text-right">
              <EditBtn onClick={()=>handleEdit(d)} />
              <DeleteBtn onClick={()=>handleDelete(d.id)} />
            </td>
          </tr>
        ))}
        emptyText="No leaders cataloged."
      />
    </div>
  );
}
