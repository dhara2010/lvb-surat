import React, { useState } from'react';
import { motion, AnimatePresence } from'framer-motion';
import ScrollReveal3D from'../../../components/animations/ScrollReveal3D';
import TextReveal from'../../../components/animations/TextReveal';
import TypingHeading from'../../../components/animations/TypingHeading';
import { Plus, Minus } from'lucide-react';
import FoldingImage from'../../../components/effects/FoldingImage';
import { faqs } from'../../../data';

const FAQAccordion = ({ faqs }) => {
  const [open, setOpen] = useState(null);
  return (
    <div className="flex flex-col gap-4 w-full">
      {faqs.map((faq, i) => (
        <div key={i} className="border-b border-white/20 pb-3">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex justify-between items-center text-left py-3 font-extrabold  text-base md:text-lg hover:text-[#4FA3D1] transition-colors"
          >
            {faq.q}
            {open === i ? <Minus className="w-5 h-5 shrink-0"  /> : <Plus className="w-5 h-5 shrink-0" />}
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height:'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="pt-1 pb-4  text-sm leading-relaxed">{faq.a}</p>
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
      <div className="container-xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start lg:items-center">
          <ScrollReveal3D className="flex-1 w-full relative hidden lg:block">

            <FoldingImage 
              src="/faq.webp"
              alt="Networking"
              className="w-[95%] aspect-[4/5] rounded-3xl relative z-10 shadow-none ml-auto overflow-hidden" 
            />
          </ScrollReveal3D>
          <div className="flex-1 w-full max-w-2xl mx-auto">
            <TypingHeading el="h2" className="text-3xl md:text-4xl lg:text-4xl font-extrabold mb-10 text-center lg:text-left">
              Frequently Asked <br className="hidden md:block" /> Questions
            </TypingHeading>
            <ScrollReveal3D delay={0.4}>
              <FAQAccordion faqs={faqs} />
            </ScrollReveal3D>
          </div>
        </div>
      </div>
    </div>
  );
}
