import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { usePrimaryTextClass } from '../../hooks/useTheme';

export default function NotFound() {
  const primaryTextClass = usePrimaryTextClass();
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl flex flex-col items-center"
      >
        <div className="relative mb-8">
          <h1 className={`text-[8rem] md:text-[12rem] font-black ${primaryTextClass} leading-none tracking-tighter opacity-10`}>
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl md:text-5xl font-extrabold ${primaryTextClass}`}>
              Page Not Found
            </span>
          </div>
        </div>

        <p className="text-lg text-gray-500 font-medium mb-12 max-w-lg">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="bg-primary text-white font-extrabold uppercase tracking-[0.2em] text-[13px] px-8 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-secondary transition-all shadow-lg hover:-translate-y-1"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            Back to Home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className={`bg-gray-100 ${primaryTextClass} font-extrabold uppercase tracking-[0.2em] text-[13px] px-8 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all shadow-sm hover:-translate-y-1`}
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
