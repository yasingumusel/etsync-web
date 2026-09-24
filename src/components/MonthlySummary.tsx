"use client";

import { useState } from "react";

export type MonthStats = {
  month: string; // "YYYY-MM"
  checks: number;
  manualRuns: number;
  created: number;
  autoUpdated: number;
  hidden: number;
  pushedToEtsy: number;
  createdOnEtsy: number;
};

type StoreWithStats = {
  monthlyStats?: MonthStats | null;
  previousMonthStats?: MonthStats | null;
};

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

function monthName(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", { month: "long", timeZone: "UTC" });
}

function sum(list: (MonthStats | null | undefined)[]): MonthStats | null {
  const present = list.filter((s): s is MonthStats => Boolean(s && s.month));
  if (!present.length) return null;
  const month = present.map((s) => s.month).sort().at(-1)!;
  return present
    .filter((s) => s.month === month)
    .reduce(
      (acc, s) => ({
        month,
        checks: acc.checks + s.checks,
        manualRuns: acc.manualRuns + s.manualRuns,
        created: acc.created + s.created,
        autoUpdated: acc.autoUpdated + s.autoUpdated,
        hidden: acc.hidden + s.hidden,
        pushedToEtsy: acc.pushedToEtsy + s.pushedToEtsy,
        createdOnEtsy: acc.createdOnEtsy + s.createdOnEtsy,
      }),
      { month, checks: 0, manualRuns: 0, created: 0, autoUpdated: 0, hidden: 0, pushedToEtsy: 0, createdOnEtsy: 0 }
    );
}

/**
 * "What MirrorStock did for you" - the ongoing work after the first import,
 * so a merchant can see the subscription is still doing something. Counts
 * come from the backend's utils/monthlyStats.js; "Etsy changes picked up"
 * only counts real changes caught by automatic checks, never the full
 * rewrite a manual "Sync Now" does.
 */
export default function MonthlySummary({ stores }: { stores: StoreWithStats[] }) {
  const current = sum(stores.map((s) => s.monthlyStats));
  const previous = sum(stores.map((s) => s.previousMonthStats));
  const [showPrevious, setShowPrevious] = useState(false);

  const stats = showPrevious && previous ? previous : current;

  const tiles = stats
    ? [
        { label: "Automatic checks", value: stats.checks, always: true },
        { label: "Etsy changes picked up", value: stats.autoUpdated, always: true },
        { label: "New listings added", value: stats.created, always: true },
        { label: "Removed listings hidden", value: stats.hidden, always: true },
        { label: "Edits sent to Etsy", value: stats.pushedToEtsy, always: false },
        { label: "Drafts published to Etsy", value: stats.createdOnEtsy, always: false },
      ].filter((t) => t.always || t.value > 0)
    : [];

  return (
    <section className="mt-6 card-glass rounded-2xl p-6" aria-labelledby="monthly-summary-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="monthly-summary-title" className="font-display text-base font-semibold text-foreground">
          {stats ? `What MirrorStock did in ${monthName(stats.month)}` : "What MirrorStock did this month"}
        </h2>
        {previous && current && previous.month !== current.month && (
          <button
            type="button"
            onClick={() => setShowPrevious((v) => !v)}
            className="text-xs font-medium text-accent-violet hover:underline"
          >
            {showPrevious ? `Show ${monthName(current.month)}` : `Show ${monthName(previous.month)}`}
          </button>
        )}
      </div>

      {stats ? (
        <>
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tiles.map((t) => (
              <div key={t.label} className="rounded-xl border border-border bg-surface px-4 py-3">
                <dt className="text-xs text-muted">{t.label}</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-foreground tabular-nums">
                  {compact.format(t.value)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[11px] leading-relaxed text-muted">
            Changes are counted only when an automatic check finds something new on Etsy. A manual
            &ldquo;Sync Now&rdquo; rewrites every product, so it isn&apos;t counted as changes.
          </p>
        </>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-muted">
          MirrorStock checks your Etsy shop automatically every few hours. What it changes in your
          store will be counted here each month.
        </p>
      )}
    </section>
  );
}
