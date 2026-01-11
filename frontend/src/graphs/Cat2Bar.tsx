type Segment = {
  key: string;
  label: string;
  value: number;
  barClass: string;
  textClass: string;
  dotClass: string;
};

type Props = {
  sleep: number;
  work: number;
  commute: number;
  routine: number;
  free: number;
  maintenance?: { label: string; value: number }[];
};

export default function Cat2Bar({
  sleep,
  work,
  commute,
  routine,
  free,
  maintenance,
}: Props) {
  const segments: Segment[] = [
    {
      key: "sleep",
      label: "Sleep",
      value: sleep,
      barClass: "bg-zinc-500/60",
      textClass: "text-zinc-100",
      dotClass: "bg-zinc-400",
    },
    {
      key: "work",
      label: "Work",
      value: work,
      barClass: "bg-zinc-700",
      textClass: "text-zinc-100",
      dotClass: "bg-zinc-600",
    },
    {
      key: "commute",
      label: "Commute",
      value: commute,
      barClass: "bg-amber-700/60",
      textClass: "text-zinc-100",
      dotClass: "bg-amber-600",
    },
    {
      key: "routine",
      label: "Routine",
      value: routine,
      barClass: "bg-zinc-600/50",
      textClass: "text-zinc-100",
      dotClass: "bg-zinc-500",
    },

    // ✅ CATEGORY 2 SEGMENTS (NEW)
    ...(maintenance ?? []).map((m, i) => ({
      key: `m-${i}`,
      label: m.label,
      value: m.value,
      barClass: "bg-blue-500/60",
      textClass: "text-white",
      dotClass: "bg-blue-400",
    })),
    {
      key: "free",
      label: "Free",
      value: free,
      barClass: "bg-emerald-500",
      textClass: "text-zinc-900",
      dotClass: "bg-emerald-400",
    },
  ];

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  const pct = (v: number) => {
    if (total <= 0) return 0;
    return (v / total) * 100;
  };

  let cumulative = 0;

  return (
    <div className="w-full space-y-2">
      {/* BAR */}
      <div className="relative w-full h-9 flex rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700/60">
        {segments.map((s) => {
          const widthPct = pct(s.value);
          const showInside = widthPct >= 10;

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
                    text-xs font-medium
                    whitespace-nowrap
                    select-none
                  `}
                >
                  {s.label}: {s.value.toFixed(1)}y
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* OUTSIDE LABELS (VERTICAL) */}
      <div className="relative w-full h-20">
        {segments.map((s) => {
          const widthPct = pct(s.value);
          const showOutside = widthPct < 10 && widthPct > 0;

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
              <span
                className={`inline-block w-2 h-2 rounded-full ${s.dotClass}`}
              />
              <span
                className={`
                  ${s.textClass}
                  text-xs font-medium
                  whitespace-nowrap
                `}
              >
                {s.label}: {s.value.toFixed(1)}y
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
