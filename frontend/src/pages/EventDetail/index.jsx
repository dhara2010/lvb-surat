import React, { useState } from 'react';
import { usePrimaryTextClass } from '../../hooks/useTheme';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Mic, Briefcase, Users, ChevronDown, AlertCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { getEvent } from '../../api/eventsApi';

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function EventDetail() {
  const primaryTextClass = usePrimaryTextClass();

  const { eventId } = useParams();
  const [ticketQuantities, setTicketQuantities] = useState({});
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Fetch event data
  const { data: event, loading, error } = useFetch(getEvent, eventId);

  const handleQtyChange = (idx, val) => {
    setTicketQuantities(prev => ({ ...prev, [idx]: Number(val) }));
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'mic': return <Mic className="w-7 h-7 text-white" />;
      case 'briefcase': return <Briefcase className="w-7 h-7 text-white" />;
      default: return <Users className="w-7 h-7 text-white" />;
    }
  };

  if (loading) {
    return (
      <div className="section-white min-h-screen pt-32 pb-20 flex justify-center items-center">
        <span className="font-bold tracking-widest text-muted">LOADING EVENT DETAILS...</span>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="section-white min-h-screen pt-32 pb-20 flex flex-col justify-center items-center gap-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <span className="font-bold tracking-widest text-red-500">FAILED TO LOAD EVENT OR NOT FOUND</span>
        <Link to="/events" className="btn-secondary mt-4">Go Back to Events</Link>
      </div>
    );
  }

  // Fallback defaults for missing fields to prevent rendering errors on legacy simple data
  const sessions = event.sessions || [];
  const tickets = event.tickets || [];

  const calendarLinks = {
      google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title || 'LVB Surat Event')}&details=${encodeURIComponent(event.desc || 'Join us for this premium event.')}&location=${encodeURIComponent(event.venue || 'Surat, Gujarat')}`,
      outlookLive: `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(event.title || 'LVB Surat Event')}&body=${encodeURIComponent(event.desc || 'Join us for this premium event.')}&location=${encodeURIComponent(event.venue || 'Surat, Gujarat')}`,
      outlook365: `https://outlook.office.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(event.title || 'LVB Surat Event')}&body=${encodeURIComponent(event.desc || 'Join us for this premium event.')}&location=${encodeURIComponent(event.venue || 'Surat, Gujarat')}`,
      ics: `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:${encodeURIComponent(event.title || 'LVB Surat Event')}%0ADESCRIPTION:${encodeURIComponent(event.desc || 'Join us for this premium event.')}%0ALOCATION:${encodeURIComponent(event.venue || 'Surat, Gujarat')}%0AEND:VEVENT%0AEND:VCALENDAR`
  };

  return (
    <div className="section-white min-h-screen pt-24 pb-20">
      <div className="container-xl">
        {/* Navigation Breadcrumb */}
        <motion.div {...inView(0)} className="mb-6 flex gap-2 items-center text-sm">
          <Link to="/events" className="text-muted hover:text-secondary transition-colors">« All Events</Link>
        </motion.div>

        {/* Hero Header */}
        <motion.div {...inView(0.1)} className="mb-12">
          <h1 className="h-display mb-4">{event.title || 'Event Title'}</h1>
          <div className={`flex flex-wrap items-center gap-2 ${primaryTextClass} font-medium text-lg`}>
            <span className="flex items-center gap-2">
              {event.month && event.date ? `${event.month} ${event.date}` : 'Date TBD'}{event.year ? `, ${event.year}` : ''} {event.time ? `@ ${event.time}` : ''}
            </span>
            {event.cost && (
              <>
                <span className="text-muted hidden md:inline">|</span>
                <span className="flex items-center text-secondary">
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
                <img loading="lazy" decoding="async" src={event.image || '/12-1.webp'}
                  alt={event.title}
                  className="w-full h-auto object-cover"
                  onError={(e) => { e.target.src = '/KVS_3369-scaled.webp'; }}
                />
              </div>
              
              <div className="flex flex-col gap-6 text-body text-lg leading-relaxed whitespace-pre-wrap">
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

            {/* Event Sessions */}
            {sessions.length > 0 && (
              <motion.div {...inView(0.3)} className="flex flex-col gap-10">
                {sessions.map((session, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-6 items-start border-b border-subtle pb-8">
                    <div className="icon-box w-14 h-14 bg-secondary flex-shrink-0 text-white rounded-xl shadow-lg border-none mt-1">
                      {renderIcon(session.iconType)}
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="h-lg">{session.title}</h3>
                      {session.primaryText && (
                        <div className={`${primaryTextClass} font-semibold text-lg flex items-center gap-2`}>
                          <span className="text-muted font-normal">{session.primaryLabel || 'Speaker'}:</span> {session.primaryText}
                        </div>
                      )}
                      {session.secondaryText && (
                        <div className={`${primaryTextClass} font-semibold text-lg flex items-center gap-2`}>
                          <span className="text-muted font-normal">{session.secondaryLabel || 'Topic'}:</span> {session.secondaryText}
                        </div>
                      )}
                      {session.description && (
                        <p className="text-body mt-2" dangerouslySetInnerHTML={{ __html: session.description }}></p>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            <motion.div {...inView(0.4)} className="pt-2 relative z-20">
                <button 
                  onClick={() => setCalendarOpen(!calendarOpen)}
                  className="btn-secondary group flex items-center gap-2 bg-surface hover:bg-surface-hover transition-colors"
                >
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span className={`${primaryTextClass} font-medium`}>Add to calendar</span>
                  <ChevronDown className={`w-4 h-4 opacity-70 transition-transform ${calendarOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                </button>

                {calendarOpen && (
                  <div className="absolute top-14 left-0 w-64 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden py-1 z-50">
                    <a href={calendarLinks.google} target="_blank" rel="noreferrer" className="block w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100">
                      Google Calendar
                    </a>
                    <a href={calendarLinks.ics} download="event.ics" className="block w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100">
                      iCalendar
                    </a>
                    <a href={calendarLinks.outlook365} target="_blank" rel="noreferrer" className="block w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100">
                      Outlook 365
                    </a>
                    <a href={calendarLinks.outlookLive} target="_blank" rel="noreferrer" className="block w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      Outlook Live
                    </a>
                  </div>
                )}
            </motion.div>

            {/* Tickets */}
            {tickets.length > 0 && (
              <motion.div {...inView(0.5)} className="card-primary p-8 mt-4 bg-surface shadow-lg">
                <h3 className="h-lg mb-6 pb-4 border-b border-subtle">Tickets</h3>
                <div className="flex flex-col gap-6">
                  
                  {tickets.map((ticket, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-subtle last:border-0 last:pb-0">
                      <div className="flex-1">
                        <h4 className={`font-semibold ${primaryTextClass} text-lg`}>{ticket.category}</h4>
                        {ticket.description && (
                          <p className="text-sm text-muted mt-1 leading-relaxed">{ticket.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-6 sm:w-auto w-full justify-between sm:justify-end">
                        <span className={`text-lg font-bold ${primaryTextClass} flex items-center`}>
                          ₹ {parseFloat(ticket.price).toFixed(2)}
                        </span>
                        <select 
                          className="input-primary w-24 px-4 py-2 text-center font-semibold bg-surface-hover hover:bg-white"
                          value={ticketQuantities[idx] || 0}
                          onChange={(e) => handleQtyChange(idx, e.target.value)}
                        >
                          {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                  
                </div>

                <div className="mt-8 flex justify-end">
                  <button className="btn-primary w-full sm:w-auto text-base py-3 px-8 shadow-md">
                    Get Tickets
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div {...inView(0.3)} className="sticky top-28 flex flex-col gap-8">
              
              <div className="card-primary bg-bg-alt border-none shadow-md p-8 flex flex-col gap-8">
                {/* Details */}
                <div>
                  <h4 className={`font-display font-semibold text-xl ${primaryTextClass} border-b border-border pb-3 mb-4`}>Details</h4>
                  <ul className="flex flex-col gap-4 text-sm">
                    {event.month && event.date && (
                      <li className="flex flex-col">
                        <span className="text-muted tracking-wider uppercase text-xs font-semibold mb-1">Date</span>
                        <span className={`${primaryTextClass} font-medium flex items-center gap-2`}>
                          <Calendar className="w-4 h-4 text-secondary"/> {event.month} {event.date} {event.year}
                        </span>
                      </li>
                    )}
                    {event.time && (
                      <li className="flex flex-col">
                        <span className="text-muted tracking-wider uppercase text-xs font-semibold mb-1">Time</span>
                        <span className={`${primaryTextClass} font-medium flex items-center gap-2`}>
                          <Clock className="w-4 h-4 text-secondary"/> {event.time}
                        </span>
                      </li>
                    )}
                    {event.cost && (
                      <li className="flex flex-col">
                        <span className="text-muted tracking-wider uppercase text-xs font-semibold mb-1">Cost</span>
                        <span className={`${primaryTextClass} font-medium flex items-center gap-1`}>
                          {event.cost}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Organizer */}
                {event.organizer && (
                  <div>
                    <h4 className={`font-display font-semibold text-xl ${primaryTextClass} border-b border-border pb-3 mb-4`}>Organizer</h4>
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
                    <h4 className={`font-display font-semibold text-xl ${primaryTextClass} border-b border-border pb-3 mb-4`}>Venue</h4>
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
          <div className="hidden sm:block text-muted">LVB PLATINUM CHAPTER</div>
          <Link to="/events" className={`${primaryTextClass} hover:text-secondary flex items-center gap-2 transition-colors`}>
            Next Event »
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
