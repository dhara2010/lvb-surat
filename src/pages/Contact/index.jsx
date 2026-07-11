import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, MapPin, Mail, ArrowRight } from 'lucide-react';
import { faqs } from '../../data';
import { submitContactForm } from '../../api/contactApi';
import PageHeader from '../../components/ui/PageHeader';

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.15 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

const contactDetails = [
  { icon: Clock, label: 'Every Wednesday', sub: '7:30 AM – 9:30 AM IST' },
  { icon: MapPin, label: '5-Star Hotel, Surat', sub: 'Grand Ballroom, Gujarat' },
  { icon: Mail, label: 'info@lvbsuratplatinum.com', sub: 'Membership inquiries' },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', category: '', referral: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Company: ${formData.company} | Category: ${formData.category} | Referral: ${formData.referral} \n\n ${formData.message}`
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', company: '', category: '', referral: '', message: '' });
      }, 4000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-light">
      <PageHeader
        label="CONTACT US"
        title="Get In Touch"
        description="Whether you have questions about membership, upcoming events, or how we operate, our team is ready to answer all your questions."
      />
      <div className="container-xl section-padding flex flex-col gap-20 pt-0 md:pt-4">

        {/* ─── Contact Form Layout ──────────── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-14 rounded-2xl p-8 md:p-14 section-white"
          style={{
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <motion.div {...inView(0)} className="relative flex flex-col justify-center rounded-2xl overflow-hidden p-8 md:p-10 shadow-inner">
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
              <img loading="lazy" decoding="async" src="/faq.webp"
                alt="Contact Background"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 flex flex-col gap-6">
              <div>
                <span className="section-label block mb-3 !text-white">Get In Touch</span>
                <h2 className="h-lg !text-white">Let's Connect</h2>
                <div className="divider-mint mt-4" />
              </div>
              <p className="!text-white text-sm leading-relaxed opacity-90">
                Interested in joining or visiting our chapter? Fill in the form and
                we'll confirm your category vacancy and arrange a guest pass within
                24 hours.
              </p>

              <div className="flex flex-col gap-3 mt-2">
                {contactDetails.map((d, i) => {
                  const Icon = d.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="icon-box w-9 h-9 shrink-0 mt-0.5 bg-white/80"
                        style={{ borderRadius: 'var(--radius-md)' }}
                      >
                        <Icon className="w-4 h-4" aria-hidden />
                      </div>
                      <div>
                        <p
                          className="text-sm font-semibold text-white"
                        >
                          {d.label}
                        </p>
                        <p className="text-secondary text-xs">{d.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div {...inView(0.1)} className="p-2 md:p-4">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(20,184,166,0.12)', border: '2px solid var(--color-secondary)' }}
                  >
                    <svg className="w-7 h-7" style={{ color: 'var(--color-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3
                    className="h-md"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Message Received!
                  </h3>
                  <p className="text-body text-sm">
                    Our membership committee will reach out within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-semibold uppercase tracking-wider text-body"
                        htmlFor="contact-name"
                      >
                        Full Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="input-primary py-3.5"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-semibold uppercase tracking-wider text-body"
                        htmlFor="contact-company"
                      >
                        Business Name
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Your company"
                        className="input-primary py-3.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-semibold uppercase tracking-wider text-body"
                        htmlFor="contact-phone"
                      >
                        Phone
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        className="input-primary py-3.5"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-semibold uppercase tracking-wider text-body"
                        htmlFor="contact-email"
                      >
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="hello@company.com"
                        className="input-primary py-3.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-semibold uppercase tracking-wider text-body"
                        htmlFor="contact-category"
                      >
                        Industry Category
                      </label>
                      <input
                        id="contact-category"
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g. Textiles, Diamonds"
                        className="input-primary py-3.5"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-semibold uppercase tracking-wider text-body"
                        htmlFor="contact-referral"
                      >
                        Referred By (Optional)
                      </label>
                      <input
                        id="contact-referral"
                        type="text"
                        value={formData.referral}
                        onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
                        placeholder="Member Name"
                        className="input-primary py-3.5"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-semibold uppercase tracking-wider text-body"
                      htmlFor="contact-message"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows="6"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your business and exactly what you're looking for from the LVB Surat Platinum chapter..."
                      className="input-primary resize-none p-4"
                    />
                  </div>

                  {error && <div className="text-red-400 text-sm mt-2">{error}</div>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn-primary w-full group mt-2 py-4 text-base ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    id="contact-submit"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <ArrowRight
                      className="w-5 h-5 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ─── FAQ Accordion ─────────────────── */}
        <div className="max-w-4xl mx-auto w-full pt-12 pb-16">
          <motion.div {...inView(0.1)} className="text-center mb-12">
            <span className="section-label block mb-3 mx-auto">Got Questions?</span>
            <h2 className="h-lg" style={{ fontFamily: 'var(--font-display)' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-body text-sm max-w-xl mx-auto mt-4">
              Find answers to the most common questions about joining our chapter and understanding our weekly referral mechanics.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div
                  key={i}
                  {...inView(i * 0.05)}
                  className="rounded-2xl overflow-hidden bg-white"
                  style={{
                    border: '1px solid var(--color-border)',
                    boxShadow: isOpen ? '0 20px 40px -15px rgba(0,0,0,0.1)' : 'var(--shadow-card)',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-semibold text-[15px]" style={{ color: 'var(--color-heading)' }}>
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: 'backOut' }}
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 ml-4"
                      style={{ backgroundColor: 'rgba(20,184,166,0.1)', color: 'var(--color-secondary)' }}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 text-[14px] leading-relaxed text-body border-t border-gray-100 mx-6 pt-5">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
