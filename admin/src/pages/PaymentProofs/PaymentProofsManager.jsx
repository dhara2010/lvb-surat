import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../../components/AdminUI';
import { 
  CreditCard, Search, Calendar, Download, Eye, X, 
  CheckCircle2, XCircle, Clock, Trash2, Edit3, Loader2, Image as ImageIcon 
} from 'lucide-react';

export default function PaymentProofsManager({ token, showToast }) {
  const [proofs, setProofs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Lightbox modal state for viewing full proof screenshot
  const [activeImage, setActiveImage] = useState(null);

  // Edit status modal state
  const [editingProof, setEditingProof] = useState(null);
  const [statusVal, setStatusVal] = useState('Pending');
  const [notesVal, setNotesVal] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/events`);
      const data = await res.json();
      if (Array.isArray(data)) setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const fetchProofs = async () => {
    setLoading(true);
    try {
      let url = `${apiUrl}/api/payment-proofs?eventId=${selectedEventId}&status=${selectedStatus}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        setProofs(data.data);
      } else {
        setProofs([]);
      }
    } catch (err) {
      console.error('Failed to fetch payment proofs:', err);
      showToast && showToast('Failed to load submitted payment proofs.', 'error');
      setProofs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchProofs();
  }, [selectedEventId, selectedStatus, searchQuery]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!editingProof) return;

    setSavingStatus(true);
    try {
      const res = await fetch(`${apiUrl}/api/payment-proofs/${editingProof._id || editingProof.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: statusVal,
          adminNotes: notesVal
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast && showToast(data.message || 'Status updated successfully.', 'success');
        setEditingProof(null);
        fetchProofs();
      } else {
        showToast && showToast(data.message || 'Failed to update status.', 'error');
      }
    } catch (err) {
      console.error('Update status error:', err);
      showToast && showToast('Error updating status.', 'error');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment proof record?')) return;

    try {
      const res = await fetch(`${apiUrl}/api/payment-proofs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast && showToast('Payment proof record deleted.', 'success');
        fetchProofs();
      } else {
        showToast && showToast(data.message || 'Failed to delete record.', 'error');
      }
    } catch (err) {
      console.error('Delete proof error:', err);
      showToast && showToast('Error deleting record.', 'error');
    }
  };

  const exportCSV = () => {
    if (proofs.length === 0) return alert('No payment proof data to export.');
    const headers = ['User Name', 'Email', 'Phone', 'Member ID', 'Event Title', 'Ticket Category', 'Quantity', 'Total Amount', 'Status', 'Submission Date', 'Admin Notes'];
    const rows = proofs.map(item => [
      `"${item.userName || ''}"`,
      `"${item.userEmail || ''}"`,
      `"${item.userPhone || ''}"`,
      `"${item.memberId || ''}"`,
      `"${item.eventTitle || ''}"`,
      `"${item.ticketCategory || ''}"`,
      `"${item.quantity || 1}"`,
      `"${item.totalAmount || 0}"`,
      `"${item.status || 'Pending'}"`,
      `"${item.submissionDate ? new Date(item.submissionDate).toLocaleString() : ''}"`,
      `"${item.adminNotes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ticket-Payments-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified/Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={12} /> Verified / Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock size={12} /> Pending Verification
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20 relative">
      <SectionHeader 
        title="Ticket Payment Proofs" 
        desc="Review, verify, and manage user ticket payment screenshot proofs submitted via manual QR payments." 
      />

      {/* FILTER CONTROLS */}
      <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar size={13} className="text-cyan-400" /> Filter Event
            </label>
            <select 
              value={selectedEventId}
              onChange={e => setSelectedEventId(e.target.value)}
              className="w-full bg-bg border border-border p-3.5 rounded-xl text-heading outline-none focus:border-cyan-500 transition-all font-medium text-sm"
            >
              <option value="all">All Events</option>
              {events.map(ev => (
                <option key={ev._id || ev.id} value={ev._id || ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock size={13} className="text-cyan-400" /> Filter Status
            </label>
            <select 
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full bg-bg border border-border p-3.5 rounded-xl text-heading outline-none focus:border-cyan-500 transition-all font-medium text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified/Approved">Verified / Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Search size={13} className="text-cyan-400" /> Search Submissions
            </label>
            <input 
              type="text" 
              placeholder="Search Name, Phone, Email..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-bg border border-border p-3.5 rounded-xl text-heading outline-none focus:border-cyan-500 transition-all font-medium text-sm"
            />
          </div>

          <button 
            onClick={exportCSV}
            disabled={proofs.length === 0}
            className="h-[48px] bg-cyan-600 hover:bg-cyan-500 text-white px-6 rounded-xl font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs"
          >
            <Download size={16} /> Export CSV
          </button>

        </div>
      </div>

      {/* PAYMENT PROOFS TABLE */}
      <div className="bg-bg-alt border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-bg border-b border-border">
              <tr>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">User / Member</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">Event & Ticket</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">Amount</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">Screenshot Proof</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">Submission Date</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-sm font-semibold text-muted">
                    Loading submitted payment proofs...
                  </td>
                </tr>
              ) : proofs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-sm font-semibold text-muted">
                    No payment proof submissions found matching criteria.
                  </td>
                </tr>
              ) : (
                proofs.map((item) => {
                  const proofImg = item.proofImageUrl ? (item.proofImageUrl.startsWith('http') ? item.proofImageUrl : `${apiUrl}${item.proofImageUrl}`) : null;
                  return (
                    <tr key={item._id || item.id} className="hover:bg-bg/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-heading text-sm">{item.userName}</div>
                        {item.memberId && <div className="text-[11px] text-cyan-400 font-semibold">ID: {item.memberId}</div>}
                        {item.userPhone && <div className="text-xs text-muted mt-0.5">📞 {item.userPhone}</div>}
                        {item.userEmail && <div className="text-xs text-muted">✉️ {item.userEmail}</div>}
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-heading text-sm line-clamp-1">{item.eventTitle}</div>
                        <div className="text-xs text-cyan-300 font-medium mt-0.5">{item.ticketCategory} (x{item.quantity || 1})</div>
                      </td>

                      <td className="p-4">
                        <span className="font-extrabold text-emerald-400 text-sm">
                          ₹ {item.totalAmount ? item.totalAmount.toFixed(2) : '0.00'}
                        </span>
                      </td>

                      <td className="p-4">
                        {proofImg ? (
                          <div 
                            onClick={() => setActiveImage(proofImg)}
                            className="relative w-16 h-16 rounded-xl border border-slate-700 bg-black overflow-hidden group cursor-pointer hover:border-cyan-500 transition-all shadow-sm"
                          >
                            <img src={proofImg} alt="Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye size={16} />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted italic">No Image</span>
                        )}
                      </td>

                      <td className="p-4 text-xs text-muted">
                        {item.submissionDate ? new Date(item.submissionDate).toLocaleString() : 'N/A'}
                      </td>

                      <td className="p-4">
                        {getStatusBadge(item.status)}
                        {item.adminNotes && (
                          <div className="text-[11px] text-slate-400 italic mt-1 max-w-xs line-clamp-2">
                            Note: {item.adminNotes}
                          </div>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {
                              setEditingProof(item);
                              setStatusVal(item.status || 'Pending');
                              setNotesVal(item.adminNotes || '');
                            }}
                            className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-colors"
                            title="Edit Status & Notes"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item._id || item.id)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SCREENSHOT PROOF LIGHTBOX MODAL */}
      {activeImage && (
        <div 
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl p-3 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <img src={activeImage} alt="Payment Proof Full" className="max-w-full max-h-[85vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}

      {/* EDIT STATUS & NOTES MODAL */}
      {editingProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-bg-alt border border-border rounded-3xl shadow-2xl overflow-hidden p-6 flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-extrabold text-heading text-base">Update Verification Status</h3>
              <button onClick={() => setEditingProof(null)} className="text-muted hover:text-heading p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">User Name</label>
                <input type="text" disabled value={editingProof.userName} className="w-full bg-bg border border-border p-3 rounded-xl text-heading opacity-70 text-sm font-semibold" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Verification Status</label>
                <select 
                  value={statusVal}
                  onChange={e => setStatusVal(e.target.value)}
                  className="w-full bg-bg border border-border p-3.5 rounded-xl text-heading outline-none focus:border-cyan-500 font-bold text-sm"
                >
                  <option value="Pending">Pending Verification</option>
                  <option value="Verified/Approved">Verified / Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Admin Verification Notes</label>
                <textarea 
                  rows="3"
                  placeholder="Add optional notes (e.g. Contacted via WhatsApp, Pass sent)..."
                  value={notesVal}
                  onChange={e => setNotesVal(e.target.value)}
                  className="w-full bg-bg border border-border p-3 rounded-xl text-heading outline-none focus:border-cyan-500 text-sm font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button 
                  type="button" 
                  onClick={() => setEditingProof(null)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs text-muted hover:text-heading hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={savingStatus}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  {savingStatus ? <Loader2 size={14} className="animate-spin" /> : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
