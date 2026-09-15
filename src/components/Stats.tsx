const stats = [
  { value: "1", label: "Etsy shop connected — mine" },
  { value: "2", label: "Read-only scopes used" },
  { value: "0", label: "Other sellers connected" },
  { value: "0", label: "Writes back to Etsy" },
];

export default function Stats() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 rounded-2xl border border-border bg-surface/50 px-8 py-10 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-gradient sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 text-xs text-muted sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
