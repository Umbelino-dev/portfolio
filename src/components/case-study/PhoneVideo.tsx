/**
 * A video inside a phone (Iury, 2026-11-16: the AutonomIA motion piece). The frame
 * is drawn in CSS (rounded body, a thin bezel, the island), the screen holds a
 * native <video> with controls, muted inline playback allowed, no autoplay. Until
 * the file exists the screen says so: never a fake video.
 */
export function PhoneVideo({ src, poster, title, pending }: { src?: string; poster?: string; title: string; pending: string }) {
  return (
    <div className="relative mx-auto aspect-[9/19.5] w-[clamp(14rem,22vw,18.5rem)] rounded-[2.75rem] bg-ink p-[0.6rem] shadow-[0_30px_60px_-30px_rgba(16,16,16,0.55),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]">
      <span aria-hidden="true" className="absolute top-[1.1rem] left-1/2 z-10 h-[1.4rem] w-[32%] -translate-x-1/2 rounded-full bg-ink" />
      <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-ink-800">
        {src ? (
          <video src={src} poster={poster} controls playsInline preload="metadata" title={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
            <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full border border-paper/20 text-paper/70">
              <svg viewBox="0 0 24 24" className="ml-0.5 size-5" fill="currentColor">
                <path d="M8.5 5.8v12.4a.8.8 0 0 0 1.2.7l9.6-6.2a.8.8 0 0 0 0-1.4L9.7 5.1a.8.8 0 0 0-1.2.7z" />
              </svg>
            </span>
            <p className="text-note text-paper-300">{title}</p>
            <p className="text-caption text-gray-500">{pending}</p>
          </div>
        )}
      </div>
    </div>
  );
}
