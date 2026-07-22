import React, { useState, useEffect } from 'react';
import { usePrimaryTextClass } from '../../hooks/useTheme';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Mic, Briefcase, Users, ChevronDown, AlertCircle,
  UserCheck, CheckCircle2, Search, X, Ticket, ExternalLink, ShieldCheck, Navigation,
  Upload, QrCode, Image as ImageIcon, Loader2, CheckCircle
} from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { getEvent, checkAttendance, markEventAttendance } from '../../api/eventsApi';
import { getMembers } from '../../api/membersApi';
import { getPaymentQR, submitPaymentProof, checkUserSubmission } from '../../api/paymentApi';
import PageHeader from '../../components/ui/PageHeader';

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function EventDetail() {
  const primaryTextClass = usePrimaryTextClass();
  const { eventId } = useParams();

  // State
  const [ticketQuantities, setTicketQuantities] = useState({});
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  // Member Selection State
  const [selectedMember, setSelectedMember] = useState(() => {
    try {
      const saved = localStorage.getItem('lvb_current_member');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const { data: membersList } = useFetch(getMembers);

  // One-time Attendance States (persisted via localStorage and backend)
  const [attMarked, setAttMarked] = useState(() => {
    try {
      const saved = localStorage.getItem(`lvb_marked_attendance_${eventId}`);
      return !!saved;
    } catch {
      return false;
    }
  });

  const [attRecord, setAttRecord] = useState(() => {
    try {
      const saved = localStorage.getItem(`lvb_marked_attendance_${eventId}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [attSubmitting, setAttSubmitting] = useState(false);
  const [attMessage, setAttMessage] = useState('');
  const [attMessageType, setAttMessageType] = useState('info'); // 'info' | 'success' | 'error'

  // Payment QR & Proof States
  const [paymentQrUrl, setPaymentQrUrl] = useState(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofSuccess, setProofSuccess] = useState(false);
  const [proofError, setProofError] = useState('');
  const [userName, setUserName] = useState(selectedMember?.name || '');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [existingSubmission, setExistingSubmission] = useState(null);

  useEffect(() => {
    if (selectedMember && selectedMember.name && !userName) {
      setUserName(selectedMember.name);
    }
  }, [selectedMember]);

  // Lock background body & html scroll when payment modal is open
  useEffect(() => {
    if (ticketModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [ticketModalOpen]);

  // Load QR code & check submission when ticket modal opens
  useEffect(() => {
    if (ticketModalOpen && eventId) {
      setLoadingQr(true);
      getPaymentQR()
        .then(res => {
          if (res && res.qrCodeUrl) {
            const fullUrl = res.qrCodeUrl.startsWith('http') 
              ? res.qrCodeUrl 
              : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${res.qrCodeUrl}`;
            setPaymentQrUrl(fullUrl);
          } else {
            setPaymentQrUrl(null);
          }
        })
        .catch(err => {
          console.error('Failed to fetch payment QR:', err);
          setPaymentQrUrl(null);
        })
        .finally(() => setLoadingQr(false));

      // Check existing submission locally or backend
      try {
        const localSaved = localStorage.getItem(`lvb_payment_proof_${eventId}`);
        if (localSaved) {
          setExistingSubmission(JSON.parse(localSaved));
        }
      } catch (e) {}

      if (selectedMember) {
        checkUserSubmission(eventId, selectedMember.id || selectedMember._id, selectedMember.name)
          .then(res => {
            if (res && res.submission) {
              setExistingSubmission(res.submission);
            }
          })
          .catch(() => {});
      }
    }
  }, [ticketModalOpen, eventId, selectedMember]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setProofError('Please upload a valid image file (JPG, JPEG, PNG, or WEBP).');
      setProofFile(null);
      setProofPreviewUrl(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setProofError('File size exceeds 10 MB. Please upload a smaller image.');
      setProofFile(null);
      setProofPreviewUrl(null);
      return;
    }

    setProofError('');
    setProofFile(file);
    setProofPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmitPaymentProof = async () => {
    if (!proofFile) {
      setProofError('Please upload your payment screenshot proof before submitting.');
      return;
    }

    if (!userName.trim()) {
      setProofError('Please enter your name.');
      return;
    }

    setUploadingProof(true);
    setProofError('');

    try {
      const selectedTickets = tickets
        .map((t, idx) => ({ ...t, qty: ticketQuantities[idx] || 0 }))
        .filter(t => t.qty > 0);

      const categoryText = selectedTickets.map(t => `${t.category} (x${t.qty})`).join(', ') || 'General Ticket';
      const singlePrice = selectedTickets.length === 1 ? parseFloat(selectedTickets[0].price) || 0 : 0;

      const formData = new FormData();
      formData.append('proofImage', proofFile);
      formData.append('eventId', eventId);
      formData.append('eventTitle', event?.title || 'Event Ticket');
      formData.append('ticketCategory', categoryText);
      formData.append('ticketPrice', singlePrice);
      formData.append('quantity', selectedTicketCount);
      formData.append('totalAmount', totalTicketCost);
      formData.append('memberId', selectedMember?.id || selectedMember?._id || '');
      formData.append('userName', userName.trim());
      formData.append('userEmail', userEmail.trim());
      formData.append('userPhone', userPhone.trim());

      const res = await submitPaymentProof(formData);
      setProofSuccess(true);
      const submissionData = res.data || { status: 'Pending', submissionDate: new Date() };
      setExistingSubmission(submissionData);
      try {
        localStorage.setItem(`lvb_payment_proof_${eventId}`, JSON.stringify(submissionData));
      } catch (e) {}
    } catch (err) {
      console.error('Payment proof submission error:', err);
      setProofError(err.message || 'Failed to submit payment proof. Please try again.');
    } finally {
      setUploadingProof(false);
    }
  };

  // Fetch event data
  const { data: event, loading, error } = useFetch(getEvent, eventId);

  // Check if current member has already marked attendance from API & localStorage
  useEffect(() => {
    if (eventId && eventId !== 'undefined') {
      try {
        const localSaved = localStorage.getItem(`lvb_marked_attendance_${eventId}`);
        if (localSaved) {
          setAttMarked(true);
          setAttRecord(JSON.parse(localSaved));
        }
      } catch (e) {}

      if (selectedMember) {
        const mId = selectedMember.id || selectedMember._id;
        checkAttendance(eventId, mId)
          .then(res => {
            if (res && res.marked) {
              setAttMarked(true);
              setAttRecord(res.record);
              try {
                localStorage.setItem(`lvb_marked_attendance_${eventId}`, JSON.stringify(res.record));
              } catch (e) {}
            }
          })
          .catch(() => {});
      }
    }
  }, [eventId, selectedMember]);

  const handleSelectMember = (mem) => {
    const formatted = {
      id: mem.id || mem._id,
      name: mem.name,
      businessName: mem.businessName,
      memberId: mem.memberId || `MEM-${(mem.id || mem._id || '').substring(18).toUpperCase()}`,
      chapter: mem.chapter || 'Surat Platinum'
    };
    setSelectedMember(formatted);
    localStorage.setItem('lvb_current_member', JSON.stringify(formatted));
    setShowMemberModal(false);
    setAttMessage('');
  };

  // Mark Attendance Handler with HTML5 Geolocation API and One-Time Submission
  const handleMarkAttendance = () => {
    if (attSubmitting || attMarked) return;

    if (!selectedMember) {
      setShowMemberModal(true);
      return;
    }

    if (!navigator.geolocation) {
      setAttMessageType('error');
      setAttMessage('Geolocation is not supported by your browser.');
      return;
    }

    setAttSubmitting(true);
    setAttMessageType('info');
    setAttMessage('Fetching location permission and coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        try {
          const payload = {
            eventId,
            memberId: selectedMember.id || selectedMember._id,
            latitude,
            longitude,
            accuracy
          };
          const res = await markEventAttendance(payload);
          const rec = res.record || { checkInTime: 'Recorded' };
          
          setAttMarked(true);
          setAttRecord(rec);
          setAttMessageType('success');

          // Persist one-time attendance completion locally
          try {
            localStorage.setItem(`lvb_marked_attendance_${eventId}`, JSON.stringify(rec));
          } catch (e) {}
        } catch (err) {
          if (err.message && err.message.toLowerCase().includes('already')) {
            // Already marked on backend
            setAttMarked(true);
            try {
              localStorage.setItem(`lvb_marked_attendance_${eventId}`, JSON.stringify({ checkInTime: 'Recorded' }));
            } catch (e) {}
          } else {
            setAttMessageType('error');
            setAttMessage(err.message || 'Failed to mark attendance.');
          }
        } finally {
          setAttSubmitting(false);
        }
      },
      (err) => {
        setAttSubmitting(false);
        setAttMessageType('error');
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setAttMessage('Location permission denied. Please allow location access in your browser settings to mark attendance.');
            break;
          case err.POSITION_UNAVAILABLE:
            setAttMessage('Location information is unavailable. Please try again.');
            break;
          case err.TIMEOUT:
            setAttMessage('Location request timed out. Please try again.');
            break;
          default:
            setAttMessage('An unknown error occurred while retrieving location.');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleQtyChange = (idx, val) => {
    setTicketQuantities(prev => ({ ...prev, [idx]: Number(val) }));
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'mic': return <Mic className="w-7 h-7" />;
      case 'briefcase': return <Briefcase className="w-7 h-7" />;
      default: return <Users className="w-7 h-7" />;
    }
  };

  if (!eventId || eventId === 'undefined') {
    return <Navigate to="/events" replace />;
  }

  if (loading) {
    return (
      <div className="section-white min-h-screen pt-32 pb-20 flex justify-center items-center">
        <span className="font-bold tracking-widest text-slate-700">LOADING EVENT DETAILS...</span>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="section-white min-h-screen pt-32 pb-20 flex flex-col justify-center items-center gap-4">
        <AlertCircle className="w-10 h-10 text-rose-500" />
        <span className="font-bold tracking-widest text-slate-800">FAILED TO LOAD EVENT OR NOT FOUND</span>
        <Link to="/events" className="btn-secondary mt-4">Go Back to Events</Link>
      </div>
    );
  }

  const sessions = event.sessions || [];
  const tickets = event.tickets || [];
  const attendanceInfo = event.attendanceInfo || { status: 'OPEN', message: 'Attendance Open' };
  const attStatus = attendanceInfo.status; // 'UPCOMING' | 'OPEN' | 'CLOSED' | 'DISABLED'

  const calendarLinks = {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title || 'LVB Surat Event')}&details=${encodeURIComponent(event.desc || 'Join us for this premium event.')}&location=${encodeURIComponent(event.venue || 'Surat, Gujarat')}`,
    outlookLive: `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(event.title || 'LVB Surat Event')}&body=${encodeURIComponent(event.desc || 'Join us for this premium event.')}&location=${encodeURIComponent(event.venue || 'Surat, Gujarat')}`,
    outlook365: `https://outlook.office.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(event.title || 'LVB Surat Event')}&body=${encodeURIComponent(event.desc || 'Join us for this premium event.')}&location=${encodeURIComponent(event.venue || 'Surat, Gujarat')}`,
    ics: `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:${encodeURIComponent(event.title || 'LVB Surat Event')}%0ADESCRIPTION:${encodeURIComponent(event.desc || 'Join us for this premium event.')}%0ALOCATION:${encodeURIComponent(event.venue || 'Surat, Gujarat')}%0AEND:VEVENT%0AEND:VCALENDAR`
  };

  const filteredMembers = (membersList || []).filter(m => {
    if (!memberSearch) return true;
    const q = memberSearch.toLowerCase();
    return (m.name && m.name.toLowerCase().includes(q)) ||
           (m.memberId && m.memberId.toLowerCase().includes(q)) ||
           (m.businessName && m.businessName.toLowerCase().includes(q));
  });

  const totalTicketCost = tickets.reduce((sum, ticket, idx) => {
    const qty = ticketQuantities[idx] || 0;
    const priceNum = parseFloat(ticket.price) || 0;
    return sum + (qty * priceNum);
  }, 0);

  const selectedTicketCount = Object.values(ticketQuantities).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white min-h-screen pb-16 md:pb-24 overflow-x-hidden">
      <PageHeader 
        label="EVENT DETAILS"
        title={event.title || 'Event Title'}
        description={event.desc ? event.desc.substring(0, 160) + (event.desc.length > 160 ? "..." : "") : "Join us for an inspiring event. Connect with like-minded individuals and gain practical insights."}
      />
      
      <div className="container-xl section-padding flex flex-col gap-12 pt-0 md:pt-4">
        {/* Navigation Breadcrumb */}
        <motion.div {...inView(0)} className="mb-6 flex gap-2 items-center text-sm font-semibold">
          <Link to="/events" className="hover:text-secondary transition-colors">« All Events</Link>
        </motion.div>

        <motion.div {...inView(0.1)} className="mb-0 flex justify-between items-center flex-wrap gap-4 pt-4 border-t border-gray-100">
          <div className={`flex flex-wrap items-center gap-2 ${primaryTextClass} font-medium text-lg`}>
            <span className="flex items-center gap-2">
              {event.month && event.date ? `${event.month} ${event.date}` : 'Date TBD'}{event.year ? `, ${event.year}` : ''} {event.time ? `@ ${event.time}` : ''}
            </span>
            {event.cost && (
              <>
                <span className="hidden md:inline">|</span>
                <span className="flex items-center font-bold text-secondary">
                  {event.cost}
                </span>
              </>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* Main Poster */}
            <motion.div {...inView(0.2)}>
              <div
                className="w-full rounded-2xl overflow-hidden mb-8"
                style={{ border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}
              >
                <img 
                  loading="lazy" 
                  decoding="async" 
                  src={event.image || '/12-1.webp'}
                  alt={event.title}
                  className="w-full h-auto object-cover"
                  onError={(e) => { e.target.src = '/KVS_3369-scaled.webp'; }}
                />
              </div>
              
              <div className="flex flex-col gap-6 text-lg leading-relaxed whitespace-pre-wrap">
                {event.desc ? (
                  <p>{event.desc}</p>
                ) : event.descriptionPart1 ? (
                   <p dangerouslySetInnerHTML={{ __html: event.descriptionPart1 }}></p>
                ) : (
                  <p>
                    Join us for an inspiring event. Connect with like-minded individuals and gain practical insights.
                  </p>
                )}
                {event.descriptionPart2 && (
                   <p dangerouslySetInnerHTML={{ __html: event.descriptionPart2 }}></p>
                )}
              </div>
            </motion.div>

            {/* ─── ATTENDANCE SECTION ──────────────────────── */}
            {attStatus !== 'DISABLED' && (
              <>
                {attMarked ? (
                  /* ── THANK YOU CARD (ONE-TIME COMPLETED ATTENDANCE) ── */
                  <motion.div {...inView(0.25)} className="rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white p-8 md:p-10 shadow-2xl border border-emerald-500/40 relative overflow-hidden flex flex-col items-center text-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-4xl shadow-inner mb-1 animate-bounce">
                      🎉
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                      Thank You for Attending the Event! 🎉
                    </h3>
                    <p className="text-base text-emerald-200 font-medium max-w-lg leading-relaxed">
                      Your attendance has been successfully recorded.
                    </p>
                    {selectedMember && (
                      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700/80 mt-2">
                        <span className="font-semibold text-slate-400">Member:</span>
                        <span className="font-bold text-cyan-300">{selectedMember.name}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{selectedMember.memberId}</span>
                        {attRecord?.checkInTime && (
                          <>
                            <span className="text-slate-500">•</span>
                            <span className="font-bold text-emerald-400">Checked in at {attRecord.checkInTime} IST</span>
                          </>
                        )}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  /* ── FORM / ATTENDANCE ACTION CARD ── */
                  <motion.div {...inView(0.25)} className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 shadow-xl border border-slate-700 relative overflow-hidden">
                    <div className="flex items-center justify-between gap-4 border-b border-slate-700/80 pb-5 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                          <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold tracking-tight text-white">Event Attendance</h3>
                          <p className="text-xs text-slate-300">Official check-in system for LVB members</p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      {attStatus === 'OPEN' && (
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                          Attendance Open
                        </span>
                      )}
                      {attStatus === 'UPCOMING' && (
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          <Clock className="w-3.5 h-3.5" />
                          Attendance Opens {attendanceInfo.openTime ? `at ${attendanceInfo.openTime}` : 'Soon'}
                        </span>
                      )}
                      {attStatus === 'CLOSED' && (
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          Attendance Closed
                        </span>
                      )}
                    </div>

                    {/* Logged in member badge */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl mb-6 text-sm">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                        <div>
                          {selectedMember ? (
                            <div className="font-semibold text-slate-200">
                              Member Profile: <span className="text-cyan-300 font-extrabold">{selectedMember.name}</span> <span className="text-xs text-slate-400">({selectedMember.memberId})</span>
                            </div>
                          ) : (
                            <div className="text-amber-300 font-medium text-xs">
                              No member profile selected. Select your profile to mark attendance.
                            </div>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowMemberModal(true)}
                        className="text-xs font-bold tracking-wider text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        {selectedMember ? 'Change Member' : 'Select Member'}
                      </button>
                    </div>

                    {/* State specific UI */}
                    {attStatus === 'UPCOMING' && (
                      <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-amber-300 font-bold text-base">
                          <Clock className="w-5 h-5" />
                          {attendanceInfo.message || 'Attendance opens soon'}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Attendance automatically opens during the check-in window. Please return during the check-in time.
                        </p>
                      </div>
                    )}

                    {attStatus === 'CLOSED' && (
                      <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-slate-300 font-bold text-base">
                          <X className="w-5 h-5 text-rose-400" />
                          Attendance Closed
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          The attendance window for this event is closed.
                        </p>
                      </div>
                    )}

                    {attStatus === 'OPEN' && (
                      <div className="flex flex-col gap-4">
                        {/* ── MANDATORY ONE-TIME ATTENDANCE NOTICE ── */}
                        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-200">
                          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div className="leading-relaxed">
                            <strong className="font-bold text-amber-300">Notice:</strong> You can submit your attendance only once. Please make sure your details are correct before submitting.
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <p className="text-xs text-slate-300">
                            Click below to confirm your attendance with device location verification.
                          </p>
                          <button
                            onClick={handleMarkAttendance}
                            disabled={attSubmitting}
                            className="w-full sm:w-auto self-start bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold py-3.5 px-8 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            <Navigation className="w-5 h-5 animate-bounce" />
                            {attSubmitting ? 'Verifying Location & Marking...' : 'Mark Attendance'}
                          </button>
                        </div>

                        {attMessage && (
                          <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                            attMessageType === 'error' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}>
                            {attMessageType === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                            {attMessage}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </>
            )}

            {/* Event Sessions */}
            {sessions.length > 0 && (
              <motion.div {...inView(0.3)} className="flex flex-col gap-10">
                <h3 className={`text-2xl font-extrabold ${primaryTextClass} pb-4 border-b border-gray-200`}>Event Sessions</h3>
                {sessions.map((session, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-6 items-start border-b border-subtle pb-8">
                    <div className="icon-box w-14 h-14 bg-secondary flex-shrink-0 text-white rounded-xl shadow-lg border-none flex items-center justify-center mt-1">
                      {renderIcon(session.iconType)}
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="h-lg">{session.title}</h3>
                      {session.primaryText && (
                        <div className={`${primaryTextClass} font-semibold text-lg flex items-center gap-2`}>
                          <span className="font-normal">{session.primaryLabel || 'Speaker'}:</span> {session.primaryText}
                        </div>
                      )}
                      {session.secondaryText && (
                        <div className={`${primaryTextClass} font-semibold text-lg flex items-center gap-2`}>
                          <span className="font-normal">{session.secondaryLabel || 'Topic'}:</span> {session.secondaryText}
                        </div>
                      )}
                      {session.description && (
                        <p className="mt-2" dangerouslySetInnerHTML={{ __html: session.description }}></p>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Calendar Integration */}
            <motion.div {...inView(0.4)} className="pt-2 relative z-20">
              <button 
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="btn-secondary group flex items-center gap-2 bg-surface hover:bg-surface-hover transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span className={`${primaryTextClass} font-medium`}>Add to calendar</span>
                <ChevronDown className={`w-4 h-4 opacity-70 transition-transform ${calendarOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
              </button>

              {calendarOpen && (
                <div className="absolute top-14 left-0 w-64 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden py-1 z-50">
                  <a href={calendarLinks.google} target="_blank" rel="noreferrer" className="block w-full px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100">
                    Google Calendar
                  </a>
                  <a href={calendarLinks.ics} download="event.ics" className="block w-full px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100">
                    iCalendar
                  </a>
                  <a href={calendarLinks.outlook365} target="_blank" rel="noreferrer" className="block w-full px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100">
                    Outlook 365
                  </a>
                  <a href={calendarLinks.outlookLive} target="_blank" rel="noreferrer" className="block w-full px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2">
                    Outlook Live
                  </a>
                </div>
              )}
            </motion.div>

            {/* ─── DYNAMIC TICKET SECTION ──────────────────── */}
            {tickets.length > 0 && (
              <motion.div {...inView(0.5)} className="rounded-[24px] bg-gray-50 border border-gray-100 shadow-sm p-8 mt-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                  <div className="flex items-center gap-3">
                    <Ticket className="w-6 h-6 text-secondary" />
                    <h3 className={`text-2xl font-extrabold ${primaryTextClass}`}>Tickets & Registration</h3>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full">
                    {tickets.length} Option{tickets.length > 1 ? 's' : ''} Available
                  </span>
                </div>

                <div className="flex flex-col gap-6">
                  {tickets.map((ticket, idx) => {
                    const isSoldOut = ticket.status === 'Sold Out';
                    return (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-semibold ${primaryTextClass} text-lg`}>{ticket.category}</h4>
                            {isSoldOut ? (
                              <span className="text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700 px-2 py-0.5 rounded">Sold Out</span>
                            ) : (
                              <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Available</span>
                            )}
                          </div>
                          {ticket.description && (
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{ticket.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-6 sm:w-auto w-full justify-between sm:justify-end">
                          <span className={`text-xl font-bold ${primaryTextClass} flex items-center`}>
                            {isNaN(parseFloat(ticket.price)) ? ticket.price : `₹ ${parseFloat(ticket.price).toFixed(2)}`}
                          </span>
                          {!isSoldOut && (
                            <select 
                              className={`input-primary w-24 px-4 py-2 text-center font-semibold bg-white border border-gray-200 ${primaryTextClass} rounded-xl shadow-sm`}
                              value={ticketQuantities[idx] || 0}
                              onChange={(e) => handleQtyChange(idx, e.target.value)}
                            >
                              {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
                  <div className="text-sm font-semibold">
                    Total Selected: <span className="text-lg font-extrabold text-secondary">{selectedTicketCount} Ticket(s)</span>
                    {totalTicketCost > 0 && (
                      <span className="ml-2 text-slate-500">(₹ {totalTicketCost.toFixed(2)})</span>
                    )}
                  </div>
                  <button 
                    disabled={selectedTicketCount === 0}
                    onClick={() => setTicketModalOpen(true)}
                    className="btn-primary w-full sm:w-auto text-base py-3 px-8 shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Get Tickets
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div {...inView(0.3)} className="sticky top-28 flex flex-col gap-8">
              
              <div className="rounded-[24px] bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-8 flex flex-col gap-8">
                {/* Details */}
                <div>
                  <h4 className={`font-display font-extrabold text-xl ${primaryTextClass} border-b border-gray-200 pb-3 mb-4`}>Details</h4>
                  <ul className="flex flex-col gap-4 text-sm">
                    {event.month && event.date && (
                      <li className="flex flex-col">
                        <span className="tracking-wider uppercase text-xs font-semibold mb-1">Date</span>
                        <span className={`${primaryTextClass} font-medium flex items-center gap-2`}>
                          <Calendar className="w-4 h-4 text-secondary"/> {event.month} {event.date} {event.year}
                        </span>
                      </li>
                    )}
                    {event.time && (
                      <li className="flex flex-col">
                        <span className="tracking-wider uppercase text-xs font-semibold mb-1">Time</span>
                        <span className={`${primaryTextClass} font-medium flex items-center gap-2`}>
                          <Clock className="w-4 h-4 text-secondary"/> {event.time}
                        </span>
                      </li>
                    )}
                    {event.cost && (
                      <li className="flex flex-col">
                        <span className="tracking-wider uppercase text-xs font-semibold mb-1">Cost</span>
                        <span className={`${primaryTextClass} font-medium flex items-center gap-1 font-bold text-secondary`}>
                          {event.cost}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Organizer */}
                {event.organizer && (
                  <div>
                    <h4 className={`font-display font-extrabold text-xl ${primaryTextClass} border-b border-gray-200 pb-3 mb-4`}>Organizer</h4>
                    <ul className="flex flex-col gap-4 text-sm">
                      <li>
                        <span className={`${primaryTextClass} font-semibold text-base`}>{event.organizer}</span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Venue */}
                {event.venue && (
                  <div>
                    <h4 className={`font-display font-extrabold text-xl ${primaryTextClass} border-b border-gray-200 pb-3 mb-4`}>Venue</h4>
                    <ul className="flex flex-col gap-4 text-sm">
                      <li className={`${primaryTextClass} font-medium leading-relaxed flex items-start gap-2`}>
                         <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                         {event.venue}
                      </li>
                    </ul>
                    
                    {event.mapLink && (
                      <div className="mt-4 w-full h-40 bg-zinc-200 rounded-lg overflow-hidden relative">
                        <iframe 
                          title="event location"
                          src={event.mapLink}
                          className="absolute inset-0 w-full h-full border-0" 
                          allowFullScreen="" 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Navigation */}
        <motion.div {...inView(0.6)} className="mt-16 border-t border-subtle pt-6 flex justify-between items-center text-sm font-medium">
          <Link to="/events" className={`${primaryTextClass} hover:text-secondary flex items-center gap-2 transition-colors`}>
            « Previous Event
          </Link>
          <div className="hidden sm:block font-bold">LVB PLATINUM CHAPTER</div>
          <Link to="/events" className={`${primaryTextClass} hover:text-secondary flex items-center gap-2 transition-colors`}>
            Next Event »
          </Link>
        </motion.div>

      </div>

      {/* ─── MEMBER SELECTION MODAL ───────────────────────── */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Select Member Profile</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select your profile to record attendance</p>
              </div>
              <button 
                onClick={() => setShowMemberModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 pb-2">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search member name or ID..."
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-3 pl-10 rounded-xl text-slate-800 outline-none focus:border-cyan-500 font-medium text-sm"
                  autoFocus
                />
                <Search className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
              </div>
            </div>

            <div className="max-h-[320px] overflow-y-auto p-6 pt-2 flex flex-col gap-2">
              {filteredMembers.map(m => (
                <div 
                  key={m.id || m._id}
                  onClick={() => handleSelectMember(m)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-cyan-50 border border-gray-100 hover:border-cyan-200 transition-all cursor-pointer group"
                >
                  <div>
                    <div className="font-extrabold text-slate-800 group-hover:text-cyan-700">{m.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{m.businessName} • {m.chapter || 'Surat Platinum'}</div>
                  </div>
                  <span className="text-xs font-bold text-cyan-600 bg-cyan-100 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    Select
                  </span>
                </div>
              ))}
              {filteredMembers.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-8 font-semibold">
                  No matching members found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TICKET CHECKOUT & PAYMENT MODAL ─────────── */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl max-h-[88vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 my-auto relative">
            
            {/* Modal Header (Fixed at top of modal box) */}
            <div className="shrink-0 flex justify-between items-center px-6 py-4.5 border-b border-gray-100 bg-gray-50/90">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700 shadow-sm shrink-0">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">Ticket Checkout & Payment</h3>
                  <p className="text-xs font-medium text-slate-500 line-clamp-1">{event.title}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setTicketModalOpen(false);
                  setProofSuccess(false);
                  setProofError('');
                }}
                className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Inner Content Body (Internal Box Scrolling) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">

              {/* ── SUCCESS STATE CARD ── */}
              {proofSuccess ? (
                <div className="flex flex-col items-center text-center p-6 sm:p-8 bg-emerald-50 border border-emerald-200 rounded-3xl gap-5 max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-lg animate-bounce">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xl sm:text-2xl font-black text-emerald-900">
                      Payment Proof Uploaded Successfully! ✓
                    </h4>
                    <p className="text-sm font-semibold text-emerald-800 mt-2">
                      Thank you. Your payment is under verification.
                    </p>
                    <p className="text-xs text-emerald-700 mt-1">
                      Our HR/Admin team will contact you within 15–30 minutes.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setTicketModalOpen(false);
                      setProofSuccess(false);
                      setTicketQuantities({});
                    }}
                    className="mt-2 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl transition-all shadow-md text-sm"
                  >
                    Done & Close
                  </button>
                </div>
              ) : existingSubmission && existingSubmission.status === 'Pending' ? (
                /* ── PENDING VERIFICATION STATE CARD ── */
                <div className="flex flex-col items-center text-center p-6 sm:p-8 bg-amber-50 border border-amber-200 rounded-3xl gap-5 max-w-lg mx-auto">
                  <div className="w-14 h-14 rounded-full bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center text-2xl">
                    ⏳
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 bg-amber-200 text-amber-900 text-xs font-bold rounded-full mb-2">
                      Status: Under Verification
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold text-amber-900">
                      Payment Submission Received
                    </h4>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      You have already submitted a payment proof for this event. Our HR/Admin team is currently reviewing your submission and will contact you within 15–30 minutes.
                    </p>
                  </div>
                  <div className="w-full bg-white p-4 rounded-2xl border border-amber-200 text-xs text-left flex flex-col gap-1.5 shadow-sm">
                    <div><strong className="text-slate-700">Ticket:</strong> {existingSubmission.ticketCategory}</div>
                    <div><strong className="text-slate-700">Total Amount:</strong> ₹ {existingSubmission.totalAmount}</div>
                    <div><strong className="text-slate-700">Submitted Name:</strong> {existingSubmission.userName}</div>
                  </div>
                  <button 
                    onClick={() => setTicketModalOpen(false)}
                    className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl transition-all shadow-md text-sm"
                  >
                    Close Modal
                  </button>
                </div>
              ) : (
                /* ── 2-COLUMN PROFESSIONAL RESPONSIVE PAYMENT SCREEN ── */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
                  
                  {/* ── LEFT COLUMN: TICKET DETAILS + USER INFO + PROOF UPLOAD ── */}
                  <div className="flex flex-col gap-5">
                    
                    {/* Selected Tickets Summary */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 shadow-sm">
                      <h4 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
                        Selected Ticket Summary
                      </h4>
                      {tickets.map((t, idx) => {
                        const qty = ticketQuantities[idx] || 0;
                        if (!qty) return null;
                        const itemTotal = (parseFloat(t.price) || 0) * qty;
                        return (
                          <div key={idx} className="flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-800">
                            <span>{t.category} x {qty}</span>
                            <span className="font-extrabold text-slate-900">₹ {itemTotal.toFixed(2)}</span>
                          </div>
                        );
                      })}
                      <div className="flex justify-between items-center text-sm sm:text-base font-black border-t border-slate-200 pt-2.5 text-secondary">
                        <span>Total Amount Payable</span>
                        <span className="text-base sm:text-lg font-black text-cyan-700">₹ {totalTicketCost.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Contact Details Form */}
                    <div className="flex flex-col gap-3">
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                        Contact Details for Pass Verification
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Full Name *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Enter your full name"
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 p-2.5 sm:p-3 rounded-xl text-slate-800 text-xs sm:text-sm font-medium outline-none focus:border-cyan-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Phone Number</label>
                          <input 
                            type="tel" 
                            placeholder="Phone / WhatsApp"
                            value={userPhone}
                            onChange={e => setUserPhone(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 p-2.5 sm:p-3 rounded-xl text-slate-800 text-xs sm:text-sm font-medium outline-none focus:border-cyan-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Email Address</label>
                          <input 
                            type="email" 
                            placeholder="email@example.com"
                            value={userEmail}
                            onChange={e => setUserEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 p-2.5 sm:p-3 rounded-xl text-slate-800 text-xs sm:text-sm font-medium outline-none focus:border-cyan-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Upload Payment Screenshot Section */}
                    {paymentQrUrl && (
                      <div className="flex flex-col gap-3 pt-2 border-t border-slate-200">
                        <label className="font-extrabold text-slate-800 text-xs uppercase tracking-wider block">
                          Upload Payment Screenshot *
                        </label>

                        <div className="relative border-2 border-dashed border-slate-300 hover:border-cyan-500 rounded-2xl p-3.5 bg-slate-50 transition-colors text-center cursor-pointer flex flex-col items-center gap-2">
                          <input 
                            type="file" 
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />

                          {proofPreviewUrl ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="relative max-h-32 rounded-xl overflow-hidden border border-slate-300 shadow-sm">
                                <img src={proofPreviewUrl} alt="Screenshot Preview" className="max-h-32 object-contain" />
                              </div>
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Screenshot attached: {proofFile?.name}
                              </span>
                              <span className="text-[10px] text-slate-400">Click or drag to replace screenshot</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1.5 text-slate-500 py-1">
                              <Upload className="w-6 h-6 text-cyan-600 mb-0.5" />
                              <span className="text-xs font-bold text-slate-700">Click to choose image or drag screenshot here</span>
                              <span className="text-[10px] text-slate-400">Supported formats: JPG, JPEG, PNG, WEBP (Max 10 MB)</span>
                            </div>
                          )}
                        </div>

                        {proofError && (
                          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {proofError}
                          </div>
                        )}

                        {/* Submit Button */}
                        <button 
                          onClick={handleSubmitPaymentProof}
                          disabled={uploadingProof || !proofFile}
                          className="mt-1 w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold py-3 sm:py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs sm:text-sm tracking-wide"
                        >
                          {uploadingProof ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Uploading Payment Proof...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              Submit Payment Proof
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ── RIGHT COLUMN: PAYMENT QR CODE CARD ── */}
                  <div className="flex flex-col gap-4 h-full">
                    <div className="bg-slate-950 text-white p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center text-center gap-3.5 relative overflow-hidden">
                      {/* Glow effects */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
                      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

                      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 w-full justify-center">
                        <QrCode className="w-4 h-4 text-cyan-400" />
                        <h4 className="font-extrabold text-cyan-300 text-xs sm:text-sm tracking-wider uppercase">
                          Official Payment QR Code
                        </h4>
                      </div>

                      {loadingQr ? (
                        <div className="flex items-center justify-center p-10 text-xs text-slate-400 font-bold gap-2">
                          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" /> Loading payment QR code...
                        </div>
                      ) : paymentQrUrl ? (
                        <>
                          <div className="bg-white p-3.5 rounded-2xl shadow-2xl border border-slate-200 max-w-[210px] sm:max-w-[230px] transition-transform duration-300 hover:scale-[1.02]">
                            <img 
                              src={paymentQrUrl} 
                              alt="Payment QR Code" 
                              className="w-full h-auto object-contain rounded-lg"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <p className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
                              Scan QR code & complete payment
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Supported via Google Pay, PhonePe, Paytm, or BHIM UPI
                            </p>
                          </div>

                          <div className="w-full bg-slate-900/80 border border-slate-800 p-2.5 sm:p-3 rounded-2xl flex items-center justify-between text-xs mt-1">
                            <span className="text-slate-400 font-medium">Grand Total</span>
                            <span className="text-sm sm:text-base font-black text-emerald-400">₹ {totalTicketCost.toFixed(2)}</span>
                          </div>
                        </>
                      ) : (
                        /* If Admin has not uploaded a QR code */
                        <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 flex flex-col items-center gap-3 text-center my-3">
                          <AlertCircle className="w-7 h-7 text-amber-400" />
                          <div>
                            <strong className="font-bold text-amber-300 text-sm block mb-1">Payment Option Unavailable</strong>
                            No payment QR code has been configured by Admin yet. Please contact leadership to process your ticket.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
