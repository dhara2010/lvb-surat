import React, { useState } from 'react';
import { usePrimaryTextClass } from '../../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight } from 'lucide-react';
import { faqs } from '../../data';
import { submitContactForm } from '../../api/contactApi';
import PageHeader from '../../components/ui/PageHeader';
import TypingHeading from '../../components/animations/TypingHeading';

const Instagram = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
);

const Linkedin = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.15 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function Contact() {
  const primaryTextClass = usePrimaryTextClass();
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
    <div id="contact" className="bg-white min-h-screen pb-16 md:pb-24 overflow-x-hidden">
      <PageHeader
        label="CONTACT US"
        title={
          <TypingHeading el="span" className="text-section font-bold">
            Get In Touch
          </TypingHeading>
        }
        description="Whether you have questions about membership, upcoming events, or how we operate, our team is ready to answer all your questions."
      />
      <div className="container-xl section-padding flex flex-col gap-24 pt-10 md:pt-16">

        {/* ─── Contact Section ──────────── */}
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 pl-1 pr-1">

          {/* Left Column: Info Panel */}
          <motion.div {...inView(0)} className="lg:col-span-2 h-full flex flex-col justify-center gap-16 rounded-[2rem] bg-gradient-to-b from-[#044765] to-[#022c40] p-10 md:p-14 border border-[#044765]/20 shadow-[0_20px_40px_rgba(4,71,101,0.2)] relative overflow-hidden group">
            
            {/* Glowing Orbs & Glass Effects */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#4FA3D1]/25 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-70" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#021d2b]/80 to-transparent rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-8">
              <div>
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1, delay: 0.2 }} className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-[3px] bg-[#4FA3D1] rounded-full shadow-[0_0_12px_rgba(79,163,209,0.6)]"></div>
                  <span className="font-extrabold tracking-[0.25em] uppercase text-xs text-[#4FA3D1]">Reach Out</span>
                </motion.div>
                <h2 className="text-4xl md:text-5xl lg:text-[2.75rem] font-black !text-white tracking-tight leading-[1.15]">
                  Let's Start a <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Conversation.</span>
                </h2>
              </div>

              <p className="text-[15px] leading-[1.8] font-medium text-blue-50/80 max-w-sm">
                Interested in joining Surat's most exclusive business network? Contact our committee directly to arrange a guest pass or discuss membership criteria.
              </p>
            </div>
            <div className="relative z-10 pt-8 border-t border-white/10 flex flex-wrap items-center gap-4 sm:gap-8">
              <a
                href="https://www.instagram.com/lvb_platinum_surat/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm font-bold text-white/70 hover:text-white transition-all duration-300 group/link"
              >
                <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-sm group-hover/link:bg-white/10 group-hover/link:border-white/20 group-hover/link:shadow-[0_8px_20px_rgba(0,0,0,0.2)] group-hover/link:-translate-y-1 transition-all duration-300">
                  <Instagram size={18} />
                </div>
                <span>Instagram</span>
              </a>

              <a
                href="https://www.linkedin.com/in/lvb-surat-platinum-9b7367419/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm font-bold text-white/70 hover:text-white transition-all duration-300 group/link"
              >
                <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-sm group-hover/link:bg-white/10 group-hover/link:border-white/20 group-hover/link:shadow-[0_8px_20px_rgba(0,0,0,0.2)] group-hover/link:-translate-y-1 transition-all duration-300">
                  <Linkedin size={18} />
                </div>
                <span>LinkedIn</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Premium Form */}
          <motion.div {...inView(0.1)} className="lg:col-span-3 rounded-2xl bg-white p-10 md:p-14 border border-gray-100 shadow-xl relative">

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-5 py-20 text-center"
                >
                  <div className="w-20 h-20 rounded-lg bg-green-50 border-2 border-green-400 flex items-center justify-center mb-4 shadow-[0_10px_30px_rgba(74,222,128,0.2)]">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className={`text-3xl font-black ${primaryTextClass}`}>Request Submitted</h3>
                  <p className="text-lg max-w-md mx-auto font-medium">
                    Thank you for your interest. Our membership committee will review your details and contact you within 24 hours.
                  </p>
                  <button onClick={() => setSubmitted(false)} className={`mt-8  font-extrabold uppercase tracking-widest text-[13px] hover:${primaryTextClass} transition-colors border-b-2 border-secondary/30 hover:border-primary pb-1`}>
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex flex-col mb-2">
                    <h3 className={`text-2xl md:text-3xl font-extrabold ${primaryTextClass} mb-3`}>Send us a message</h3>
                    <p className="text-[15px] font-medium leading-relaxed">Please fill out the form below with your accurate details to help us process your inquiry faster.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2.5">
                      <label className={`text-[11px] font-black uppercase tracking-[0.2em] ${primaryTextClass} ml-1`} htmlFor="contact-name">Full Name *</label>
                      <input id="contact-name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className={`w-full bg-gray-50/80 border border-gray-200 ${primaryTextClass} font-semibold rounded-2xl px-5 py-4 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all placeholder:text-gray-400 placeholder:font-medium`}
                      />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className={`text-[11px] font-black uppercase tracking-[0.2em] ${primaryTextClass} ml-1`} htmlFor="contact-company">Business Name *</label>
                      <input id="contact-company" type="text" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Company Ltd."
                        className={`w-full bg-gray-50/80 border border-gray-200 ${primaryTextClass} font-semibold rounded-2xl px-5 py-4 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all placeholder:text-gray-400 placeholder:font-medium`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2.5">
                      <label className={`text-[11px] font-black uppercase tracking-[0.2em] ${primaryTextClass} ml-1`} htmlFor="contact-phone">Phone Number *</label>
                      <input id="contact-phone" type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className={`w-full bg-gray-50/80 border border-gray-200 ${primaryTextClass} font-semibold rounded-2xl px-5 py-4 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all placeholder:text-gray-400 placeholder:font-medium`}
                      />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className={`text-[11px] font-black uppercase tracking-[0.2em] ${primaryTextClass} ml-1`} htmlFor="contact-email">Email Address *</label>
                      <input id="contact-email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className={`w-full bg-gray-50/80 border border-gray-200 ${primaryTextClass} font-semibold rounded-2xl px-5 py-4 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all placeholder:text-gray-400 placeholder:font-medium`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2.5">
                      <label className={`text-[11px] font-black uppercase tracking-[0.2em] ${primaryTextClass} ml-1`} htmlFor="contact-category">Industry / Category *</label>
                      <input id="contact-category" type="text" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g. Textiles, Diamonds"
                        className={`w-full bg-gray-50/80 border border-gray-200 ${primaryTextClass} font-semibold rounded-2xl px-5 py-4 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all placeholder:text-gray-400 placeholder:font-medium`}
                      />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className={`text-[11px] font-black uppercase tracking-[0.2em] ${primaryTextClass} ml-1`} htmlFor="contact-referral">Referred By (Optional)</label>
                      <input id="contact-referral" type="text" value={formData.referral} onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
                        placeholder="Member Name"
                        className={`w-full bg-gray-50/80 border border-gray-200 ${primaryTextClass} font-semibold rounded-2xl px-5 py-4 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all placeholder:text-gray-400 placeholder:font-medium`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <label className={`text-[11px] font-black uppercase tracking-[0.2em] ${primaryTextClass} ml-1`} htmlFor="contact-message">Your Message</label>
                    <textarea id="contact-message" rows="4" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you're looking for..."
                      className={`w-full bg-gray-50/80 border border-gray-200 ${primaryTextClass} font-semibold rounded-2xl px-5 py-4 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all placeholder:text-gray-400 placeholder:font-medium resize-none`}
                    />
                  </div>

                  {error && <div className="font-bold text-[13px] bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-6 w-full sm:w-auto sm:self-end inline-flex items-center justify-center gap-3 rounded-md bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white font-bold text-[13px] md:text- uppercase tracking-widest xl:py-3.5 xl:px-10 py-3 px-8 border border-transparent transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}>
                    {isSubmitting ? "Processing..." : "Submit Inquiry"}
                    <ArrowRight className="w-5 h-5 flex-shrink-0" aria-hidden />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ─── FAQ Accordion ─────────────────── */}
        <div className="max-w-4xl mx-auto w-full pt-12 pb-16">
          <motion.div {...inView(0.1)} className="text-center mb-12">
            <span className="inline-block  font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-3 mx-auto">Got Questions?</span>
            <h2 className={`text-3xl md:text-4xl lg:text-4xl font-extrabold ${primaryTextClass} tracking-tight`}>
              Frequently Asked Questions
            </h2>
            <p className="text-base md:text-lg max-w-xl mx-auto mt-4">
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
                  className={`rounded-2xl overflow-hidden bg-white border border-gray-100 transition-all duration-300 ${isOpen ? 'shadow-xl' : 'shadow-sm hover:shadow-md'}`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className={`font-semibold text-[15px] ${primaryTextClass}`}>
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: 'backOut' }}
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 ml-4 bg-secondary/10"
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
                        <div className="px-6 pb-6 text-[14px] leading-relaxed  border-t border-gray-100 mx-6 pt-5">
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
    </div>
  );
}
