import React, { useState, useEffect } from 'react';
import { SectionHeader, InputGroup, FileInputGroup, SubmitButton, PremiumTable, DeleteBtn, EditBtn } from './AdminUI';

export default function MembersManager({ token }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: '', businessName: '', businessCategory: '', photoUrl: '', logoUrl: '' });

  const [editingId, setEditingId] = useState(null);

  const loadData = () => fetch('http://localhost:5000/api/members').then(res=>res.json()).then(setData);
  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`http://localhost:5000/api/members/${editingId}`, {
        method:'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify(form)
      });
      setEditingId(null);
    } else {
      await fetch('http://localhost:5000/api/members', {
        method:'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify(form)
      });
    }
    setForm({ name: '', businessName: '', businessCategory: '', photoUrl: '', logoUrl: '' });
    loadData();
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({ name: d.name, businessName: d.businessName, businessCategory: d.businessCategory, photoUrl: d.photoUrl, logoUrl: d.logoUrl });
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete member?')) return;
    await fetch(`http://localhost:5000/api/members/${id}`, { method:'DELETE', headers:{'Authorization': `Bearer ${token}`}});
    loadData();
  };

  return (
    <div className="flex flex-col gap-6 text-white pb-20">
      <SectionHeader title="Members Directory" desc="Manage active general members on the full grid." />
      
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-end">
            <InputGroup label="Full Name" placeholder="e.g. Amit Rajodiya" val={form.name} setVal={v => setForm({...form, name: v})} w="flex-1 min-w-[200px]" />
            <InputGroup label="Business Name" placeholder="e.g. Om Shiv Insurance" val={form.businessName} setVal={v => setForm({...form, businessName: v})} w="flex-1 min-w-[200px]" />
            <InputGroup label="Category" placeholder="e.g. Insurance Services" val={form.businessCategory} setVal={v => setForm({...form, businessCategory: v})} w="flex-1 min-w-[150px]" />
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <FileInputGroup label="Photo URL" placeholder="/members/amit.png" val={form.photoUrl} setVal={v => setForm({...form, photoUrl: v})} token={token} w="flex-1 min-w-[200px]" />
            <FileInputGroup label="Logo URL" placeholder="/members/OM-SHIV.png" val={form.logoUrl} setVal={v => setForm({...form, logoUrl: v})} token={token} w="flex-1 min-w-[200px]" />
            <SubmitButton editing={editingId !== null} />
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', businessName: '', businessCategory: '', photoUrl: '', logoUrl: '' }); }} className="h-[46px] ml-2 px-6 rounded-xl font-bold uppercase tracking-wider bg-white/10 text-white hover:bg-white/20 transition-all">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <PremiumTable 
        headers={['Assets', 'Member', 'Business / Category', 'Action']}
        rows={data.map(d => (
          <tr key={d.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="p-5 w-32">
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-xl bg-gray-800 overflow-hidden border border-white/10">
                  <img src={d.photoUrl} className="w-full h-full object-cover" onError={(e)=>e.target.style.display='none'} />
                </div>
                <div className="w-10 h-10 rounded-xl bg-white p-1 overflow-hidden border border-white/10">
                  <img src={d.logoUrl} className="w-full h-full object-contain filter grayscale" onError={(e)=>e.target.style.display='none'} />
                </div>
              </div>
            </td>
            <td className="p-5 font-bold text-white max-w-[150px] truncate">{d.name}</td>
            <td className="p-5 text-gray-400 text-sm">
              <div className="font-semibold text-white/90 truncate">{d.businessName}</div>
              <div className="text-xs mt-1 truncate">{d.businessCategory}</div>
            </td>
            <td className="p-5 w-32 text-right">
              <EditBtn onClick={()=>handleEdit(d)} />
              <DeleteBtn onClick={()=>handleDelete(d.id)} />
            </td>
          </tr>
        ))}
        emptyText="No members cataloged."
      />
    </div>
  );
}
