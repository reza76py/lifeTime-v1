import { useEffect, useState, useCallback, useMemo } from "react";
import Cat3Bar from "../graphs/Cat3Bar";
import { fetchLifeSummary, type LifeSummaryResponse } from "../api/lifeSummary";
import { addCategory3 } from "../api/category3";
import { useNavigate } from "react-router-dom";

type Props = {
  userId: number;
};

export default function Level3({ userId }: Props) {
  const [summary, setSummary] = useState<LifeSummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [customLabel, setCustomLabel] = useState("");
  const [customHours, setCustomHours] = useState(0);

  const [summaryMode, setSummaryMode] = useState(false);
  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    const s = await fetchLifeSummary(userId);
    setSummary(s);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    refresh().catch(() => setError("Failed to load summary"));
  }, [userId, refresh]);

  /* ---------- ADD LEAKAGE ---------- */

  const handleAddCustom = async () => {
    const label = customLabel.trim();
    if (!label || customHours <= 0) {
      setError("Enter activity and hours/week");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await addCategory3(userId, customLabel.trim(), customHours);

      setCustomLabel("");
      setCustomHours(0);

      await refresh();
    } finally {
      setLoading(false);
    }
  };

  /* ---------- LIVE PREVIEW ---------- */

  const previewLeakage = useMemo(() => {
    if (!summary) return [];

    return (summary.category3 ?? []).map((a) => ({
      label: a.label,
      value: a.years,
    }));
  }, [summary]);

  const adjusted = summary?.adjusted;

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      {error && <p className="text-sm text-red-400">{error}</p>}

      {adjusted && (
        <div className="space-y-2 pt-4">
          <Cat3Bar
            sleep={adjusted.sleep_years}
            work={adjusted.work_years}
            commute={adjusted.commute_years}
            routine={adjusted.routine_years}
            free={adjusted.free_years}
            leakage={previewLeakage}
          />
          <p className="text-xs text-zinc-500">
            Lost time is permanently removed from your free life.
          </p>
        </div>
      )}

      {/* SUMMARY MODE */}
      {summaryMode && summary && (
        <div className="space-y-3">
          <h3 className="text-sm text-zinc-400">Life leakage list</h3>
          <ul className="text-sm text-zinc-300 space-y-1">
            {summary.category3.map((a) => (
              <li key={a.label}>
                • {a.label}: {a.years.toFixed(2)} years lost
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ADD MODE */}
      {!summaryMode && (
        <div className="pt-6 border-t border-zinc-800 space-y-3">
          <label className="text-sm text-zinc-400">
            Life leakage (hours/week)
          </label>

          <input
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="e.g. Social media"
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
          />

          <div className="flex gap-3">
            <input
              type="number"
              value={customHours}
              onChange={(e) => setCustomHours(Number(e.target.value))}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            />
            <button
              onClick={handleAddCustom}
              disabled={loading}
              className="rounded bg-red-600 px-4 py-2 text-black disabled:opacity-40"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Life Level 3 — Leakage</h2>

        <button
          onClick={() => setSummaryMode((v) => !v)}
          className="rounded border border-zinc-600 px-4 py-2 text-sm text-zinc-300"
        >
          {summaryMode ? "Add leakage" : "View summary"}
        </button>
      </div>
      <button
        onClick={() => navigate("/total")}
        className="w-full rounded bg-zinc-200 px-4 py-2 text-sm text-zinc-900"
      >
        View Life Total
      </button>
    </div>
  );
}
