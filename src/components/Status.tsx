const notes = [
  "I run one Etsy shop and one Wix store, and I built ETSYNC to stop updating stock in both places by hand.",
  "No other seller is connected. ETSYNC isn't distributed, sold, or offered to anyone else right now.",
  "There's no sign-up form and no account creation for other sellers, because there's no one else to sign up.",
  "If that ever changes, this page and the API access request behind it will be updated to match.",
];

export default function Status() {
  return (
    <section id="status" className="relative border-t border-border/60 bg-surface/30 py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-violet">
          Project Status
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Built by one person, used by one person
        </h2>
        <p className="mt-4 text-lg text-muted">
          ETSYNC is a personal tool, not a company or a public product. Here
          is exactly who uses it today.
        </p>

        <div className="card-glass mx-auto mt-10 max-w-lg rounded-2xl p-8 text-left">
          <ul className="space-y-4">
            {notes.map((note) => (
              <li key={note} className="flex items-start gap-2.5 text-sm text-foreground/90">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mt-0.5 shrink-0 text-emerald-600"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {note}
              </li>
            ))}
          </ul>

          <a
            href="mailto:yasin.gumusel@gmail.com"
            className="mt-8 block rounded-full border border-border px-5 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
          >
            Questions? Email Me
          </a>
        </div>
      </div>
    </section>
  );
}
