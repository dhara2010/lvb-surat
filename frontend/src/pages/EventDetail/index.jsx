import React, { useState, useEffect } from 'react';
import { usePrimaryTextClass } from '../../hooks/useTheme';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Mic, Briefcase, Users, ChevronDown, AlertCircle,
  UserCheck, CheckCircle2, Search, X, Ticket, ExternalLink, ShieldCheck, Navigation
} from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { getEvent, checkAttendance, markEventAttendance } from '../../api/eventsApi';
import { getMembers } from '../../api/membersApi';
import PageHeader from '../../components/ui/PageHeader';

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function EventDetail() {
  const primaryTextClass = usePrimaryTextClass();
  const { slug, eventId: legacyEventId } = useParams();
  const eventId = slug || legacyEventId;

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

  // Fetch event data
  const { data: event, loading, error } = useFetch(getEvent, eventId);

  if (!eventId || eventId === 'undefined') {
    return <Navigate to="/events" replace />;
  }

  // Check if current member has already marked attendance from API & localStorage
  useEffect(() => {
    if (eventId) {
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

      {/* ─── TICKET CHECKOUT / CONFIRMATION MODAL ─────────── */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <Ticket className="w-6 h-6 text-secondary" />
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Ticket Registration</h3>
                  <p className="text-xs text-slate-500">{event.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setTicketModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b border-gray-200 pb-2">Selected Tickets</h4>
                {tickets.map((t, idx) => {
                  const qty = ticketQuantities[idx] || 0;
                  if (!qty) return null;
                  const itemTotal = (parseFloat(t.price) || 0) * qty;
                  return (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="font-medium text-slate-800">{t.category} x {qty}</div>
                      <div className="font-bold text-slate-900">₹ {itemTotal.toFixed(2)}</div>
                    </div>
                  );
                })}
                <div className="flex justify-between items-center text-base font-extrabold border-t border-gray-200 pt-3 text-secondary">
                  <span>Grand Total</span>
                  <span>₹ {totalTicketCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-2xl text-xs text-cyan-900 leading-relaxed">
                <p className="font-bold mb-1">Registration Instructions:</p>
                Please contact the event organizer or chapter leadership to finalize payment and receive your official pass.
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setTicketModalOpen(false)} 
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    alert('Thank you! Your ticket reservation request has been received.');
                    setTicketModalOpen(false);
                    setTicketQuantities({});
                  }}
                  className="btn-primary py-2.5 px-6 text-sm"
                >
                  Confirm Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
