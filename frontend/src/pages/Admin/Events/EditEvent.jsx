import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import EventForm from './EventForm';

export default function EditEvent() {
  const { token } = useOutletContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/events/${id}`);
        if(!res.ok) throw new Error('Event not found');
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        alert(err.message);
        navigate('/admin/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleEdit = async (form) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/events/${id}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || 'Failed to update event');
      }
      alert('Event updated successfully');
      navigate('/admin/events');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-muted font-bold">Loading Event Data...</div>;
  }

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
            <span>Admin</span> <span>/</span> <span>Events</span> <span>/</span> <span className="text-secondary">Edit Event</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-1 text-body">Edit Event</h1>
          <p className="text-muted text-sm font-medium">Update the event record details.</p>
        </div>
      </div>
      <EventForm token={token} initialData={initialData} onSubmit={handleEdit} onCancel={() => navigate('/admin/events')} />
    </div>
  );
}
