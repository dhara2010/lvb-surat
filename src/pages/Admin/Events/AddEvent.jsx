import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import EventForm from './EventForm';

export default function AddEvent() {
  const { token } = useOutletContext();
  const navigate = useNavigate();

  const handleAdd = async (form) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/events`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || 'Failed to create event');
      }
      alert('Event created successfully');
      navigate('/admin/events');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex items-start gap-4 border-b border-border pb-6">
        <button 
          onClick={() => navigate('/admin/events')}
          className="text-muted hover:text-primary font-bold text-sm tracking-wider uppercase transition-colors mt-2"
        >
          ← Back
        </button>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-2">
            <span>Admin</span> <span>/</span> <span>Events</span> <span>/</span> <span className="text-secondary">Add New</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-1 text-body">Add New Event</h1>
          <p className="text-muted text-sm font-medium">Create a new event record in the database.</p>
        </div>
      </div>
      <EventForm token={token} onSubmit={handleAdd} onCancel={() => navigate('/admin/events')} />
    </div>
  );
}
