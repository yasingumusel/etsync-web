export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* The full app icon, so the header, the browser tab and the App Market
          listing all show the same mark. Drawn inline rather than loaded as
          an image so it stays sharp on any display. */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 1000 1000"
        className="shrink-0"
        role="img"
        aria-label="MirrorStock"
      >
        <defs>
          <linearGradient id="ms-logo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent-orange)" />
            <stop offset="0.5" stopColor="var(--accent-pink)" />
            <stop offset="1" stopColor="var(--accent-violet)" />
          </linearGradient>
        </defs>
        <rect width="1000" height="1000" rx="230" fill="url(#ms-logo)" />
        <g
          fill="none"
          stroke="#fff"
          strokeWidth="54"
          strokeLinecap="round"
          opacity="0.92"
        >
          <path d="M200 500a300 300 0 0 1 300-300h28" />
          <path d="M800 500a300 300 0 0 1-300 300h-28" />
        </g>
        <g fill="#fff" opacity="0.92">
          <path d="M502 116l92 84-92 84z" />
          <path d="M498 884l-92-84 92-84z" />
        </g>
        <path
          d="M368 600V404l132 126 132-126v196"
          fill="none"
          stroke="#fff"
          strokeWidth="66"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display text-lg font-bold tracking-tight text-foreground">
        MirrorStock
      </span>
    </div>
  );
}
