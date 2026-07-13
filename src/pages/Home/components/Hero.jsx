export default function Hero() {
  return (
    <div className="relative w-full h-[100svh] flex items-center justify-center overflow-hidden bg-[#000000]">
      <video
        src="/hero_video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover pointer-events-none"
      />
    </div>
  );
}