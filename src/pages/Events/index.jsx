/**
 * ══════════════════════════════════════════
 *  MEETING — Structure + Upcoming Events
 *  All colors via design-system utilities.
 * ══════════════════════════════════════════
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(console.error);
  }, []);

  return (
    <section id="meeting" className="section-white">
      <div className="container-xl section-padding flex flex-col gap-20">

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
              <img
                src="/12-1.jpeg"
                alt="LVB Platinum Chapter weekly meeting"
                className="w-full aspect-[4/3] object-cover"
                onError={(e) => { e.target.src = '/KVS_3369-scaled.jpg'; }}
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div {...inView(0)} className="flex flex-col gap-6">
            <span className="section-label">Meeting Structure</span>
            <h2
              className="h-xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              How &amp; When We Meet
            </h2>
            <div className="divider-mint" />
            <p className="text-body text-base leading-relaxed">
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
                    className="flex items-center gap-4 p-4 rounded-lg section-light"
                    style={{ border: '1px solid var(--color-border-subtle)' }}
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
                      <p
                        className="text-sm font-semibold"
                        style={{ color: 'var(--color-heading)' }}
                      >
                        {d.label}
                      </p>
                      <p className="text-muted text-xs mt-0.5">{d.sub}</p>
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
            <span className="section-label block mb-3">Chapter Agenda</span>
            <h2
              className="h-lg"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Upcoming Events
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                {...inView(i * 0.1)}
                className="card-primary p-7 flex flex-col gap-5"
              >
                {/* Date Badge */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-lg flex flex-col items-center justify-center shrink-0 bg-secondary"
                  >
                    <span
                      className="text-lg font-bold leading-none"
                      style={{ color: 'var(--color-on-secondary)', fontFamily: 'var(--font-display)' }}
                    >
                      {ev.date}
                    </span>
                    <span
                      className="text-[10px] font-semibold leading-none mt-0.5"
                      style={{ color: 'var(--color-on-secondary)' }}
                    >
                      {ev.month}
                    </span>
                  </div>
                  <span className="text-muted text-xs font-mono uppercase">{ev.year}</span>
                </div>

                <div className="flex flex-col gap-2 flex-grow">
                  <h3
                    className="h-md leading-snug"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {ev.title}
                  </h3>
                  <p className="text-body text-sm leading-relaxed">{ev.desc}</p>
                </div>

                <Link
                  to="/contact"
                  className="btn-secondary text-sm py-2.5 w-full text-center"
                  id={`event-cta-${i}`}
                >
                  Reserve Seat
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
