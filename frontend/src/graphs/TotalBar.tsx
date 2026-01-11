type Segment = {
  key: string;
  label: string;
  value: number;
  barClass: string;
  textClass: string;
  dotClass: string;
};

type Props = {
  survival: number;
  maintenance: number;
  leakage: number;
  remainingFree: number;
};

export default function TotalBar({
  survival,
  maintenance,
  leakage,
  remainingFree,
}: Props) {
  const segments: Segment[] = [
    {
      key: "survival",
      label: "Survival",
      value: survival,
      barClass: "bg-indigo-500/70",
      textClass: "text-white",
      dotClass: "bg-indigo-400",
    },
    {
      key: "maintenance",
      label: "Maintenance",
      value: maintenance,
      barClass: "bg-blue-500/70",
      textClass: "text-white",
      dotClass: "bg-blue-400",
    },
    {
      key: "leakage",
      label: "Leakage",
      value: leakage,
      barClass: "bg-red-600/70",
      textClass: "text-white",
      dotClass: "bg-red-500",
    },
    {
      key: "remaining",
      label: "Remaining Free",
      value: remainingFree,
      barClass: "bg-emerald-500",
      textClass: "text-zinc-900",
      dotClass: "bg-emerald-400",
    },
  ].filter((s) => s.value > 0);

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  const pct = (v: number) => (total > 0 ? (v / total) * 100 : 0);

  let cumulative = 0;

  return (
    <div className="w-full space-y-2">
      {/* BAR */}
      <div className="relative w-full h-10 flex rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700/60">
        {segments.map((s) => {
          const widthPct = pct(s.value);
          const showInside = widthPct >= 12;

          return (
            <div
              key={s.key}
              style={{ width: `${widthPct}%` }}
              className={`
                relative flex items-center justify-center
                ${s.barClass}
                transition-all duration-700 ease-in-out
              `}
            >
              {showInside && (
                <span
                  className={`
                    ${s.textClass}
                    text-xs font-semibold
                    whitespace-nowrap select-none
                  `}
                >
                  {s.label}: {s.value.toFixed(1)}y
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* OUTSIDE LABELS */}
      <div className="relative w-full h-20">
        {segments.map((s) => {
          const widthPct = pct(s.value);
          const showOutside = widthPct < 12 && widthPct > 0;

          const centerPct = cumulative + widthPct / 2;
          cumulative += widthPct;

          if (!showOutside) return null;

          return (
            <div
              key={s.key}
              style={{
                left: `${centerPct}%`,
                transform: "rotate(45deg)",
                transformOrigin: "top left",
              }}
              className="absolute top-0 left-0 flex items-center gap-1"
            >
              <span className={`inline-block w-2 h-2 rounded-full ${s.dotClass}`} />
              <span className={`${s.textClass} text-xs font-semibold whitespace-nowrap`}>
                {s.label}: {s.value.toFixed(1)}y
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
