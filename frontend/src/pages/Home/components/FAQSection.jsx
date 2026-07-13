import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal3D } from '../../../components/animations/ScrollReveal3D';
import { Plus, Minus } from 'lucide-react';
import { faqs } from '../../../data';

const FAQAccordion = ({ faqs }) => {
  const [open, setOpen] = useState(null);
  return (
    <div className="flex flex-col gap-4 w-full">
      {faqs.map((faq, i) => (
        <div key={i} className="border-b border-white/20 pb-3">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex justify-between items-center text-left py-3 font-extrabold text-heading text-base md:text-lg hover:text-secondary transition-colors"
          >
            {faq.q}
            {open === i ? <Minus className="w-5 h-5 shrink-0 text-secondary" /> : <Plus className="w-5 h-5 shrink-0 text-muted" />}
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="pt-1 pb-4 text-gray-300 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default function FAQSection() {
  return (
    <div className="py-24 pb-32">
      <div className="container-xl">
        <div className="flex flex-col lg:flex-row gap-16 items-start lg:items-center">
          <ScrollReveal3D className="flex-1 w-full relative hidden lg:block">
            <div className="absolute -bottom-8 -left-8 grid grid-cols-6 gap-3 opacity-30 text-secondary">
              {Array.from({ length: 36 }).map((_, i) => <div key={i} className="w-2.5 h-2.5 rounded-full bg-current"></div>)}
            </div>
            <img loading="lazy" decoding="async" src="/faq.webp"
              alt="Networking"
              className="w-[95%] aspect-[4/5] object-cover rounded-3xl relative z-10 shadow-2xl border border-white/20 ml-auto"
              onError={(e) => { e.target.src = '/KVS_3369-scaled.webp'; }}
            />
          </ScrollReveal3D>
          <ScrollReveal3D delay={0.2} className="flex-1 w-full max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-heading mb-10 text-center lg:text-left">
              Frequently Asked <br className="hidden md:block" /> Questions
            </h2>
            <FAQAccordion faqs={faqs} />
          </ScrollReveal3D>
        </div>
      </div>
    </div>
  );
}
