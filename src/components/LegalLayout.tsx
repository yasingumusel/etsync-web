export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated: {updated}</p>

        <div
          className="mt-12 space-y-5 text-sm leading-relaxed text-muted
          [&_h2]:font-display [&_h2]:mt-10 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground
          [&_p]:leading-relaxed
          [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5
          [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-accent-pink
          [&_code]:rounded [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_code]:text-foreground"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
