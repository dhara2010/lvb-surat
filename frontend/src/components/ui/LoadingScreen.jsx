import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="w-full h-[60vh] min-h-[400px] flex flex-col items-center justify-center bg-dark text-white">
      <div className="w-10 h-10 border-4 border-white/20 border-t-secondary rounded-full animate-spin"></div>
      <p className="mt-4 text-sm tracking-widest text-[#B3A369] font-serif uppercase">Loading</p>
    </div>
  );
}
