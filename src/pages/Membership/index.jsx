/**
 * ══════════════════════════════════════════
 *  MEMBERS — Leadership Grid + Testimonials
 *  Theme-system classes; no hardcoded colors.
 * ══════════════════════════════════════════
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const inView = (delay = 0) => ({
  initial:     { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: false, amount: 0.15 },
  transition:  { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

const leaders = [
  { name: 'Sanjay Kotadiya', role: 'President',       img: '/sanjay.png',   company: 'Kotadiya Group',  cat: 'Real Estate'      },
  { name: 'Mayur Savani',    role: 'Vice President',   img: '/mayur-1.png',  company: 'Savani Designs',  cat: 'Apparel'          },
  { name: 'Pragnesh Patel',  role: 'Treasurer',        img: '/pragnesh.jpg', company: 'Patel Trading',   cat: 'Diamond Merchant' },
  { name: 'Divya Vegad',     role: 'Secretary',        img: '/divya.png',    company: 'BrandFlow UX',    cat: 'Branding & UX'    },
  { name: 'Kishor Kotadiya', role: 'Membership Chair', img: '/kishor.png',   company: 'Kishor Textiles', cat: 'Textiles'         },
];

const testimonials = [
  {
    text: 'LVB Platinum transformed my client pipeline. The category exclusivity rule meant every textile lead is mine alone — I closed over ₹1.5 Crore in new business within the first six months.',
    name: 'Kishor Kotadiya', role: 'Textile Manufacturer', company: 'Kishor Fabrics', img: '/kishor.png',
  },
  {
    text: 'For commercial real estate, the right introduction changes everything. The relationships I built through this chapter led to two major warehouse projects I would never have found through conventional channels.',
    name: 'Sanjay Shah', role: 'Real Estate Developer', company: 'Sanjay Buildcon', img: '/sanjay.png',
  },
];

const avatarFallback = (name) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=FAF8F3&textColor=0B1F3A`;

export default function Members() {
  return (
    <section id="members" className="section-white">
      <div className="container-xl section-padding flex flex-col gap-20">

        {/* ─── Leadership Grid ──────────────── */}
        <div>
          <motion.div {...inView(0)} className="mb-12">
            <span className="section-label block mb-3">Our People</span>
            <h2
              className="h-lg"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Leadership Team
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {leaders.map((l, i) => (
              <motion.div
                key={i}
                {...inView(i * 0.07)}
                className="flex flex-col gap-3 group"
              >
                {/* Portrait */}
                <div
                  className="rounded-xl overflow-hidden aspect-[3/4]"
                  style={{
                    border:     '1px solid var(--color-border)',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-secondary)';
                    e.currentTarget.style.boxShadow   = 'var(--shadow-card-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.boxShadow   = 'none';
                  }}
                >
                  <img
                    src={l.img}
                    alt={`${l.name} — ${l.role}`}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 grayscale group-hover:grayscale-0"
                    onError={(e) => { e.target.src = avatarFallback(l.name); }}
                  />
                </div>

                {/* Labels */}
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-heading)' }}
                  >
                    {l.name}
                  </p>
                  <p className="text-muted text-xs mt-0.5">{l.role}</p>
                  <span className="badge mt-1.5">{l.cat}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...inView(0.2)} className="mt-10">
            <Link to="/contact" className="btn-primary" id="join-chapter-cta">
              Join Our Chapter
            </Link>
          </motion.div>
        </div>

        {/* ─── Testimonials ─────────────────── */}
        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '5rem' }}>
          <motion.div {...inView(0)} className="mb-12">
            <span className="section-label block mb-3">Testimonials</span>
            <h2
              className="h-lg"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              What Members Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                {...inView(i * 0.1)}
                className="card-primary p-8 flex flex-col gap-5"
              >
                <Quote
                  className="w-8 h-8"
                  style={{ color: 'var(--color-border)' }}
                  aria-hidden
                />
                <p
                  className="text-body text-base leading-relaxed italic flex-grow"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}
                >
                  "{t.text}"
                </p>
                <div
                  className="flex items-center gap-3 pt-5"
                  style={{ borderTop: '1px solid var(--color-border-subtle)' }}
                >
                  <div
                    className="w-11 h-11 rounded-full overflow-hidden shrink-0"
                    style={{ border: '2px solid var(--color-border)' }}
                  >
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = avatarFallback(t.name); }}
                    />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: 'var(--color-heading)' }}
                    >
                      {t.name}
                    </p>
                    <p className="text-muted text-xs">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
