import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Membership', href: '/membership' },
  { label: 'Contact', href: '/contact' },
];

const contactInfo = [
  'Every Wednesday · 7:30 AM – 9:30 AM IST',
  'Grand Ballroom, 5-Star Hotel, Surat',
  'info@lvbsuratplatinum.com',
];

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="section-dark"
      style={{ borderTop: '1px solid rgba(20, 184, 166, 0.15)' }}
    >
      <div className="container-xl py-16">

        {/* ─── Top Grid ─────────────────────── */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-10"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >

          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <img
              src="/LVB_Platinum.png"
              alt="LVB Surat Platinum"
              className="h-10 w-auto"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              Surat's invite-only elite business networking chapter for top
              entrepreneurs, manufacturers, and trade leaders.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="flex flex-col gap-3">
            <p className="section-label mb-1">Navigation</p>
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm w-fit transition-colors duration-200"
                style={{ color: 'rgba(255,255,255,0.45)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-secondary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Chapter Details Column */}
          <div className="flex flex-col gap-3">
            <p className="section-label mb-1">Chapter Details</p>
            {contactInfo.map((item, i) => (
              <p
                key={i}
                className="text-sm"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                {item}
              </p>
            ))}
            <Link
              to="/contact"
              className="btn-primary group mt-3 self-start text-xs px-5 py-2.5"
              id="footer-cta"
            >
              Let's Connect
              <ArrowRight
                className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
        </div>

        {/* ─── Bottom Bar ───────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © {new Date().getFullYear()} LVB Surat Platinum Chapter. All rights reserved.
          </p>
          <p
            className="text-xs"
            style={{ color: 'var(--color-secondary)', opacity: 0.6 }}
          >
            Est. 2024 &middot; Surat, Gujarat
          </p>
        </div>

      </div>
    </footer>
  );
}
