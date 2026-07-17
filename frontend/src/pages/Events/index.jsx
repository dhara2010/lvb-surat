/**
 * ══════════════════════════════════════════
 *  MEETING — Structure + Upcoming Events
 *  All colors via design-system utilities.
 * ══════════════════════════════════════════
 */
import React, { useState, useEffect } from 'react';
import { usePrimaryTextClass } from '../../hooks/useTheme';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { getEvents } from '../../api/eventsApi';
import PageHeader from '../../components/ui/PageHeader';

const inView = (delay = 0) => ({
  initial:     { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: false, amount: 0.2 },
  transition:  { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

const meetingDetails = [
  { icon: Calendar, label: 'Every Wednesday',      sub: '7:30 AM – 9:30 AM IST' },
  { icon: MapPin,   label: 'Premium Venue, Surat', sub: '5-Star Hotel, Grand Ballroom' },
];

export default function Meeting() {
  const primaryTextClass = usePrimaryTextClass();

  const { data: eventsData, loading, error } = useFetch(getEvents);
  const events = eventsData || [];

  return (
    <div id="meeting" className="bg-white min-h-screen pb-16 md:pb-24 overflow-x-hidden">
      <PageHeader 
        label="EVENTS & MEETINGS"
        title="How & When We Meet"
        description="Consistency builds credibility. Explore our structured meeting systems and upcoming chapter agendas."
      />

      <div className="container-xl section-padding flex flex-col gap-20 pt-0 md:pt-4">

        {/* ─── Chapter Profile ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Photo */}
          <motion.div {...inView(0.1)}>
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border:    '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <img loading="lazy" decoding="async" src="/12-1.webp"
                alt="LVB Platinum Chapter weekly meeting"
                className="w-full aspect-[4/3] object-cover"
                onError={(e) => { e.target.src = '/KVS_3369-scaled.webp'; }}
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div {...inView(0)} className="flex flex-col gap-6">
            <h2 className={`text-3xl md:text-4xl lg:text-4xl font-extrabold ${primaryTextClass} tracking-tight`}>
              Meeting Structure
            </h2>
            <div className="w-24 h-1 bg-secondary"></div>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Consistency builds credibility. Every Wednesday morning, our
              members gather to exchange referrals, present their businesses,
              and conduct structured introductions designed to generate real
              outcomes.
            </p>

            {/* Detail cards */}
            <div className="flex flex-col gap-3 mt-2">
              {meetingDetails.map((d, i) => {
                const Icon = d.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 shadow-sm"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-secondary"
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: 'var(--color-on-secondary)' }}
                        aria-hidden
                      />
                    </div>
                    <div>
                      <p className={`text-base font-bold ${primaryTextClass}`}>
                        {d.label}
                      </p>
                      <p className="text-slate-600 text-sm mt-0.5">{d.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link to="/contact" className="btn-primary group mt-2 self-start" id="meeting-cta">
              Register as Guest
              <ArrowRight
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </motion.div>

        </div>

        {/* ─── Upcoming Events ──────────────── */}
        <div>
          <motion.div {...inView(0)} className="mb-12">
            <span className="inline-block text-secondary font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-3">Chapter Agenda</span>
            <h2 className={`text-3xl md:text-4xl lg:text-4xl font-extrabold ${primaryTextClass} tracking-tight`}>
              Upcoming Events
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[300px]">
            {loading && <div className="col-span-3 flex justify-center items-center text-muted font-bold tracking-widest">LOADING EVENTS...</div>}
            {error && <div className="col-span-3 flex justify-center items-center text-red-400 font-bold tracking-widest">FAILED TO LOAD EVENTS</div>}
            {!loading && !error && events.length === 0 && <div className="col-span-3 flex justify-center items-center text-muted font-bold tracking-widest">NO EVENTS AVAILABLE</div>}

            {events.map((ev, i) => (
              <motion.div
                key={i}
                {...inView(i * 0.1)}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-secondary shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col gap-5"
              >
                {/* Date Badge */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-lg flex flex-col items-center justify-center shrink-0 bg-secondary"
                  >
                    <span className="text-xl md:text-2xl font-black text-black leading-none">
                      {ev.date}
                    </span>
                    <span className="text-xs font-bold text-black leading-none mt-1 uppercase">
                      {ev.month}
                    </span>
                  </div>
                  <span className="text-slate-500 text-sm font-bold tracking-wider uppercase">{ev.year}</span>
                </div>

                <div className="flex flex-col gap-2 flex-grow">
                  <h3 className={`text-xl md:text-2xl font-bold ${primaryTextClass} group-hover:text-secondary transition-colors line-clamp-2`}>
                    {ev.title}
                  </h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap line-clamp-3">{ev.desc}</p>
                </div>

                <Link
                  to={`/events/${ev.id || i}`}
                  className="btn-secondary text-sm py-2.5 w-full text-center"
                  id={`event-cta-${i}`}
                >
                  View Event Details
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
