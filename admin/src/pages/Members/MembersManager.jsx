import React, { useState, useEffect } from 'react';
import { SectionHeader, InputGroup, FileInputGroup, SubmitButton, PremiumTable, DeleteBtn, EditBtn, resolveImageUrl } from '../../components/AdminUI';

export default function MembersManager({ token }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: '', businessName: '', businessCategory: '', photoUrl: '', logoUrl: '', memberId: '', chapter: '' });
  const [editingId, setEditingId] = useState(null);

  const loadData = () => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/members')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    if (editingId) {
      await fetch(`${apiUrl}/api/members/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      setEditingId(null);
    } else {
      await fetch(`${apiUrl}/api/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
    }
    setForm({ name: '', businessName: '', businessCategory: '', photoUrl: '', logoUrl: '', memberId: '', chapter: '' });
    loadData();
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({ 
      name: d.name || '', 
      businessName: d.businessName || '', 
      businessCategory: d.businessCategory || '', 
      photoUrl: d.photoUrl || '', 
      logoUrl: d.logoUrl || '',
      memberId: d.memberId || '',
      chapter: d.chapter || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete member?')) return;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    await fetch(`${apiUrl}/api/members/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    loadData();
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <SectionHeader title="Members Directory" desc="Manage general registered chapter members appearing on the main directory." />
      
      <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <InputGroup label="Member ID" placeholder="e.g. MEM-001" val={form.memberId} setVal={v => setForm({ ...form, memberId: v })} w="flex-1 w-full" req={false} />
            <InputGroup label="Chapter" placeholder="e.g. Surat Platinum" val={form.chapter} setVal={v => setForm({ ...form, chapter: v })} w="flex-1 w-full" req={false} />
            <InputGroup label="Full Name" placeholder="e.g. Amit Rajodiya" val={form.name} setVal={v => setForm({ ...form, name: v })} w="flex-1 w-full" />
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <InputGroup label="Business Name" placeholder="e.g. Om Shiv Insurance" val={form.businessName} setVal={v => setForm({ ...form, businessName: v })} w="flex-1 w-full" />
            <InputGroup label="Category" placeholder="e.g. Insurance Services" val={form.businessCategory} setVal={v => setForm({ ...form, businessCategory: v })} w="flex-1 w-full" />
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <FileInputGroup label="Photo URL" placeholder="/members/amit.webp" val={form.photoUrl} setVal={v => setForm({ ...form, photoUrl: v })} token={token} w="flex-1 w-full" />
            <FileInputGroup label="Logo URL" placeholder="/members/OM-SHIV.png" val={form.logoUrl} setVal={v => setForm({ ...form, logoUrl: v })} token={token} w="flex-1 w-full" />
            
            <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
              <SubmitButton editing={editingId !== null} />
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', businessName: '', businessCategory: '', photoUrl: '', logoUrl: '', memberId: '', chapter: '' }); }} 
                  className="h-[44px] px-6 rounded-xl font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex-1 md:flex-none">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <PremiumTable 
        headers={['Assets', 'Member ID', 'Member', 'Chapter', 'Business / Category', 'Action']}
        rows={data.map(d => (
          <tr key={d.id} className="border-b border-slate-800/50 hover:bg-slate-900/20 transition-colors">
            <td className="p-4 w-32">
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden border border-slate-750">
                  <img loading="lazy" decoding="async" src={resolveImageUrl(d.photoUrl)} alt="member" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                </div>
                <div className="w-10 h-10 rounded-xl bg-white p-1 overflow-hidden border border-slate-750">
                  <img loading="lazy" decoding="async" src={resolveImageUrl(d.logoUrl)} alt="logo" className="w-full h-full object-contain filter grayscale" onError={(e) => e.target.style.display = 'none'} />
                </div>
              </div>
            </td>
            <td className="p-4 font-bold text-slate-300 text-sm">{d.memberId || `MEM-${d.id.substring(18).toUpperCase()}`}</td>
            <td className="p-4 font-extrabold text-slate-100 max-w-[150px] truncate">{d.name}</td>
            <td className="p-4 text-slate-400 text-sm font-semibold">{d.chapter || 'Surat Platinum'}</td>
            <td className="p-4 text-slate-400 text-sm">
              <div className="font-bold text-slate-300 truncate">{d.businessName}</div>
              <div className="text-xs mt-1 truncate">{d.businessCategory}</div>
            </td>
            <td className="p-4 w-32 text-right">
              <EditBtn onClick={() => handleEdit(d)} />
              <DeleteBtn onClick={() => handleDelete(d.id)} />
            </td>
          </tr>
        ))}
        emptyText="No members cataloged."
      />
    </div>
  );
}
