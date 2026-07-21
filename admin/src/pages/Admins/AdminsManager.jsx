import React, { useState, useEffect } from 'react';
import { SectionHeader, InputGroup, PasswordInputGroup, SubmitButton, PremiumTable, DeleteBtn, EditBtn } from '../../components/AdminUI';

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export default function AdminsManager({ token, showToast, scrollToTop }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ username: '', password: '' });
  const [editingId, setEditingId] = useState(null);
  const [currentAdminInfo, setCurrentAdminInfo] = useState({ id: '', username: '' });

  useEffect(() => {
    const payload = parseJwt(token);
    if (payload) {
      setCurrentAdminInfo({ id: payload.id, username: payload.username });
    }
  }, [token]);

  const loadData = () => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/auth/admins', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    if (editingId) {
      const res = await fetch(`${apiUrl}/api/auth/admins/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setEditingId(null);
        setForm({ username: '', password: '' });
        showToast('Admin account updated successfully', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.message || 'Failed to update admin account', 'error');
      }
    } else {
      const res = await fetch(`${apiUrl}/api/auth/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setForm({ username: '', password: '' });
        showToast('Admin account registered successfully', 'success');
      } else {
        const errData = await res.json();
        showToast(errData.message || 'Failed to create admin account', 'error');
      }
    }
    loadData();
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({ username: d.username, password: '' }); // keep password empty for edit unless they change it
    if (scrollToTop) scrollToTop();
  };

  const handleDelete = async (id) => {
    if (id === currentAdminInfo.id) {
      showToast("You cannot delete the account you are currently logged in with!", 'error');
      return;
    }
    if (!window.confirm('Delete this admin account?')) return;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/auth/admins/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      showToast('Admin account deleted successfully', 'success');
      loadData();
    } else {
      const errData = await res.json();
      showToast(errData.message || 'Failed to delete account', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20 text-heading">
      <SectionHeader title="Admin Accounts" desc="Manage administrator user accounts that have security access to this workspace." />
      
      <div className="bg-bg-alt border border-border p-6 rounded-3xl shadow-sm">
        <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-sm border-b border-border pb-2 mb-4">
          {editingId ? 'Edit Admin User' : 'Register New Admin'}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <InputGroup label="Admin Username" placeholder="e.g. system_admin" val={form.username} setVal={v => setForm({ ...form, username: v })} w="flex-1 w-full" />
          <PasswordInputGroup 
            label={editingId ? "New Password (leave empty to keep current)" : "Password"} 
            placeholder="••••••••" 
            val={form.password} 
            setVal={v => setForm({ ...form, password: v })} 
            w="flex-1 w-full" 
            req={!editingId} 
          />
          
          <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
            <SubmitButton editing={editingId !== null} />
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ username: '', password: '' }); }} 
                className="h-[44px] px-6 rounded-xl font-bold uppercase tracking-wider bg-bg hover:bg-bg-alt text-muted transition-all border border-border flex-1 md:flex-none">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <PremiumTable 
        headers={['Username', 'Role Access', 'Status', 'Action']}
        rows={data.map(d => {
          const isSelf = d.id === currentAdminInfo.id;
          return (
            <tr key={d.id} className="border-b border-border/50 hover:bg-bg-alt/25 transition-colors">
              <td className="p-4 font-extrabold text-heading">
                {d.username} {isSelf && <span className="text-[10px] ml-2 text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/25">You</span>}
              </td>
              <td className="p-4 text-body text-sm font-semibold">Administrator</td>
              <td className="p-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border 
                  ${isSelf ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
                  {isSelf ? 'Online Now' : 'Active Account'}
                </span>
              </td>
              <td className="p-4 w-32 text-right">
                <EditBtn onClick={() => handleEdit(d)} />
                <DeleteBtn onClick={() => handleDelete(d.id)} />
              </td>
            </tr>
          );
        })}
        emptyText="No administrators found."
      />
    </div>
  );
}
