import { useEffect, useState } from "react";
import { fetchLifeSummary, type LifeSummaryResponse } from "../api/lifeSummary";
import TotalBar from "../graphs/TotalBar";

type Props = {
  userId: number;
};

export default function Total({ userId }: Props) {
  const [summary, setSummary] = useState<LifeSummaryResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    fetchLifeSummary(userId)
      .then(setSummary)
      .catch(() => setError("Failed to load total summary"));
  }, [userId]);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!summary) return null;

  /* ---------- BASES ---------- */
  const lifeBase = summary.level1.remaining_years;
  const freeBase = summary.level1.free_years;
  const usableFreeBase = Math.max(
    summary.level1.free_years - summary.maintenance_years,
    0
  );

  /* ---------- TOTALS ---------- */
  const survival =
    summary.level1.sleep_years +
    summary.level1.work_years +
    summary.level1.commute_years +
    summary.level1.routine_years;

  const maintenance = summary.maintenance_years;
  const leakage = summary.leakage_years;
  const remainingFree = summary.adjusted.free_years;

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">Life — Total Overview</h2>

      {/* 🔥 COLORFUL SUMMARY GRAPH */}
      <div className="space-y-2">
        <TotalBar
          survival={survival}
          maintenance={maintenance}
          leakage={leakage}
          remainingFree={remainingFree}
        />
        <p className="text-xs text-zinc-400">
          Your remaining life split into Survival, Maintenance, Leakage, and what’s actually free.
        </p>
      </div>

      {/* LEVEL 1 */}
      <Section title="Level 1 — Survival (of remaining life)">
        <Item label="Sleep" value={summary.level1.sleep_years} base={lifeBase} />
        <Item label="Work" value={summary.level1.work_years} base={lifeBase} />
        <Item label="Commute" value={summary.level1.commute_years} base={lifeBase} />
        <Item label="Routine" value={summary.level1.routine_years} base={lifeBase} />
        <Divider />
        <Item label="Total survival" value={survival} base={lifeBase} strong />
      </Section>

      {/* LEVEL 2 */}
      <Section title="Level 2 — Maintenance (of free life)">
        {summary.category2.map((a) => (
          <Item key={a.label} label={a.label} value={a.years} base={freeBase} />
        ))}
        <Divider />
        <Item
          label="Total maintenance"
          value={maintenance}
          base={freeBase}
          strong
        />
      </Section>

      {/* LEVEL 3 */}
      <Section title="Level 3 — Leakage (of usable free life)">
        {summary.category3.map((a) => (
          <Item
            key={a.label}
            label={a.label}
            value={a.years}
            base={usableFreeBase}
          />
        ))}
        <Divider />
        <Item
          label="Total leakage"
          value={leakage}
          base={usableFreeBase}
          strong
        />
      </Section>

      {/* FINAL */}
      <Section title="Final (of remaining life)">
        <Item
          label="Remaining free life"
          value={remainingFree}
          base={lifeBase}
          strong
        />
      </Section>
    </div>
  );
}

/* ---------- Helpers ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm text-zinc-400">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="my-2 border-t border-zinc-800" />;
}

function Item({
  label,
  value,
  base,
  strong,
}: {
  label: string;
  value: number;
  base: number;
  strong?: boolean;
}) {
  const pct = base > 0 ? (value / base) * 100 : 0;

  return (
    <div
      className={`flex justify-between text-sm ${
        strong ? "text-zinc-100 font-semibold" : "text-zinc-200"
      }`}
    >
      <span>{label}</span>
      <span>
        {value.toFixed(2)}y{" "}
        <span className="text-zinc-400 font-normal">({pct.toFixed(1)}%)</span>
      </span>
    </div>
  );
}
