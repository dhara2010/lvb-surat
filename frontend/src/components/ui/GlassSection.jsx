
export default function GlassSection({ children, className = '', ...props }) {
  return (
    <section 
      className={`relative py-24 pb-32 w-full flex flex-col font-sans overflow-hidden ${className}`}
      {...props}
    >
      {/* Optional: if global CSS doesn't apply well, uncomment below */}
      {/* <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(rgba(255,255,255,0.15), rgba(255,255,255,0.15))' }} /> */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
}
