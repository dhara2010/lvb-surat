import React, { useState, useEffect } from'react';
import { SectionHeader, InputGroup, FileInputGroup, SubmitButton, PremiumTable, DeleteBtn, EditBtn } from'./AdminUI';

export default function LeadersManager({ token }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name:'', role:'', img:'' });

  const [editingId, setEditingId] = useState(null);

  const loadData = () => fetch((import.meta.env.VITE_API_URL ||'http://localhost:5000') +'/api/leaders').then(res=>res.json()).then(setData);
  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`http://localhost:5000/api/leaders/${editingId}`, {
        method:'PUT', headers: {'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify(form)
      });
      setEditingId(null);
    } else {
      await fetch((import.meta.env.VITE_API_URL ||'http://localhost:5000') +'/api/leaders', {
        method:'POST', headers: {'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify(form)
      });
    }
    setForm({ name:'', role:'', img:'' });
    loadData();
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({ name: d.name, role: d.role, img: d.img });
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete leadership member?')) return;
    await fetch(`http://localhost:5000/api/leaders/${id}`, { method:'DELETE', headers:{'Authorization':`Bearer ${token}`}});
    loadData();
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <SectionHeader title="Leadership Directory" desc="Manage active board members appearing in the 3D carousel." />
      
      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
          <InputGroup label="Full Name" placeholder="John Doe" val={form.name} setVal={v => setForm({...form, name: v})} w="flex-1 w-full" />
          <InputGroup label="Position" placeholder="Vice President" val={form.role} setVal={v => setForm({...form, role: v})} w="flex-1 w-full" />
          <FileInputGroup label="Portrait Image URL" placeholder="/members/john.png" val={form.img} setVal={v => setForm({...form, img: v})} token={token} w="flex-1 w-full" />
          <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
            <SubmitButton editing={editingId !== null} />
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ name:'', role:'', img:'' }); }} className="h-[44px] px-6 rounded-xl font-bold uppercase tracking-wider bg-gray-100  hover:bg-gray-200 transition-all flex-1 md:flex-none">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <PremiumTable 
        headers={['Portrait','Officer Details','Position','Action']}
        rows={data.map(d => (
          <tr key={d.id} className="border-b border-border hover:bg-bg-alt transition-colors">
            <td className="p-4 w-24">
              <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-border shadow-sm">
                <img loading="lazy" decoding="async" src={d.img} alt="leader portrait" className="w-full h-full object-cover" onError={(e)=>e.target.style.display='none'} />
              </div>
            </td>
            <td className="p-4 font-extrabold">{d.name}</td>
            <td className="p-4  font-semibold text-sm tracking-wide">{d.role}</td>
            <td className="p-4 w-32 text-right">
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
