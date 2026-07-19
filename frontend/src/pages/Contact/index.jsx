import React, { useState } from 'react';
import { usePrimaryTextClass } from '../../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, MapPin, Mail, ArrowRight } from 'lucide-react';
import { faqs } from '../../data';
import { submitContactForm } from '../../api/contactApi';
import PageHeader from '../../components/ui/PageHeader';
import TypingHeading from '../../components/animations/TypingHeading';

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
          <TypingHeading el="h2" className="text-section font-bold">
            Get In Touch
          </TypingHeading>
        }
        description="Whether you have questions about membership, upcoming events, or how we operate, our team is ready to answer all your questions."
      />
      <div className="container-xl section-padding flex flex-col gap-24 pt-10 md:pt-16">

        {/* ─── Contact Section ──────────── */}
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 pl-1 pr-1">

          {/* Left Column: Info Panel */}
          <motion.div {...inView(0)} className="lg:col-span-2 flex flex-col justify-between rounded-[40px] bg-gray-50 p-10 md:p-14 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
            {/* Decorative background shapes */}



            <div className="relative z-10 flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-[3px] bg-secondary rounded-full"></div>
                  <span className="font-extrabold tracking-[0.25em] uppercase text-xs">Reach Out</span>
                </div>
                <h2 className={`text-4xl md:text-5xl lg:text-[2.75rem] font-black ${primaryTextClass} tracking-tight leading-[1.15]`}>
                  Let's Start a <br /><span className="bg-clip-text bg-gradient-to-r from-secondary to-[#4FA3D1]">Conversation.</span>
                </h2>
              </div>

              <p className="text-[15px] leading-[1.8] font-medium mt-2">
                Interested in joining Surat's most exclusive business network? Contact our committee directly to arrange a guest pass or discuss membership criteria.
              </p>

              <div className="flex flex-col gap-6 mt-8">
                {contactDetails.map((d, i) => {
                  const Icon = d.icon;
                  return (
                    <div key={i} className="flex items-start gap-4 group cursor-default">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm group-hover:border-secondary/30 group-hover:shadow-[0_8px_20px_rgba(18,59,93,0.12)] transition-all duration-400 group-hover:-translate-y-1">
                        <Icon className="w-6 h-6" strokeWidth={1.5} aria-hidden />
                      </div>
                      <div className="flex flex-col justify-center pt-2">
                        <p className={`text-[15px] font-extrabold ${primaryTextClass} mb-0.5 group-hover:text-secondary transition-colors`}>{d.label}</p>
                        <p className="text-sm font-medium">{d.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Graphic / Social Proof */}
            <div className="relative z-10 mt-14 pt-8 border-t border-gray-200">
              <p className={`text-[11px] font-black ${primaryTextClass} uppercase tracking-[0.2em] mb-4`}>Connect with us</p>
              <div className="flex gap-5">
                {['LinkedIn', 'Twitter', 'Instagram'].map((social, i) => (
                  <a key={i} href="#" className="text-sm font-bold  hover:text-secondary hover:-translate-y-0.5 transition-all">
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Premium Form */}
          <motion.div {...inView(0.1)} className="lg:col-span-3 rounded-[40px] bg-white p-10 md:p-14 border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative">

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-5 py-20 text-center"
                >
                  <div className="w-20 h-20 rounded-[24px] bg-green-50 border-2 border-green-400 flex items-center justify-center mb-4 shadow-[0_10px_30px_rgba(74,222,128,0.2)]">
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
                    className={`mt-6 w-full sm:w-auto sm:self-end inline-flex items-center justify-center gap-3 rounded-[12px] bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white font-bold text-[13px] md:text- uppercase tracking-widest xl:py-3.5 xl:px-10 py-3 px-8 border border-transparent transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}>
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
                  className={`rounded-2xl overflow-hidden bg-white border border-gray-100 transition-all duration-300 ${isOpen ? 'shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]' : 'shadow-sm hover:shadow-md'}`}
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
