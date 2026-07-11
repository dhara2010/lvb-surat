import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { SectionHeader, PremiumTable, DeleteBtn, EditBtn } from '../components/AdminUI';
import { Plus } from 'lucide-react';

export default function EventsList() {
  const { token } = useOutletContext();
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const loadData = () => fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/events').then(res=>res.json()).then(setData);
  
  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id) => {
    if(!window.confirm('Delete event from database?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/events/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to delete event');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-2">
            <span>Admin Dashboard</span> <span>/</span> <span className="text-secondary">Events Database</span>
          </div>
          <SectionHeader title="Events" desc="Manage robust event details and configurations." />
        </div>
        <button 
          onClick={() => navigate('/admin/events/add')}
          className="h-[44px] shrink-0 bg-primary text-white px-6 rounded-xl font-bold uppercase tracking-wider hover:bg-primary-light transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Plus size={16} strokeWidth={3} /> Add Event
        </button>
      </div>

      <PremiumTable 
        headers={['Date Block', 'Event Description', 'Action']}
        rows={data.map(d => (
          <tr key={d.id} className="border-b border-border hover:bg-bg-alt transition-colors">
            <td className="p-4 font-black text-lg text-body w-40">
              <span className="text-secondary">{d.date||'--'}</span> <span className="opacity-70 text-sm uppercase">{d.month||'TBD'}</span>
            </td>
            <td className="p-4 font-medium text-gray-700">
              <div className="font-extrabold">{d.title}</div>
              <div className="text-xs bg-bg-alt inline-block px-2 py-0.5 mt-1 rounded border border-border text-muted">
                {d.sessions?.length||0} Sessions | {d.tickets?.length||0} Tickets
              </div>
            </td>
            <td className="p-4 w-32 text-right">
              <EditBtn onClick={() => navigate(`/admin/events/edit/${d.id}`)} />
              <DeleteBtn onClick={() => handleDelete(d.id)} />
            </td>
          </tr>
        ))}
        emptyText="No events found."
      />
    </div>
  );
}
