export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-orange via-accent-pink to-accent-violet">
        {/* Just the M, matching the small favicon rather than the full app
            icon: the sync ring around it turns to mush at this size, and the
            wordmark next to it already carries the name. */}
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="text-white">
          <path
            d="M5 17.5V6.5l7 6.6 7-6.6v11"
            stroke="currentColor"
            strokeWidth="3.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="font-display text-lg font-bold tracking-tight text-foreground">
        MirrorStock
      </span>
    </div>
  );
}
