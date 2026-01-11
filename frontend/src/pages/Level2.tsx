import { useEffect, useState, useCallback, useMemo } from "react";
import Cat2Bar from "../graphs/Cat2Bar";
import { fetchLifeSummary, type LifeSummaryResponse } from "../api/lifeSummary";
import { addCategory2 } from "../api/category2";
import { useNavigate } from "react-router-dom";

type Props = {
  userId: number;
};

const PRESETS = [
  "Exercising",
  "Learning / studying",
  "Health care",
  "Relationship care",
];

export default function Level2({ userId }: Props) {
  const [summary, setSummary] = useState<LifeSummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summaryMode, setSummaryMode] = useState(false);
  const navigate = useNavigate();

  const [hours, setHours] = useState<Record<string, number>>(() =>
    Object.fromEntries(PRESETS.map((p) => [p, 0]))
  );

  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<Record<string, boolean>>({});

  const [customLabel, setCustomLabel] = useState("");
  const [customHours, setCustomHours] = useState(0);

  const refresh = useCallback(async () => {
    const s = await fetchLifeSummary(userId);
    setSummary(s);

    // OPTIONAL: hydrate inputs from backend once (nice UX)
    // If you DON'T want this behavior, delete this block.
    setHours((prev) => {
      const next = { ...prev };
      (s.category2 ?? []).forEach((a) => {
        // Only hydrate if user hasn't typed something already
        if (typeof next[a.label] !== "number" || next[a.label] === 0) {
          next[a.label] = next[a.label] ?? 0;
        }
      });
      return next;
    });

    // mark backend items as "added"
    setAdded((prev) => {
      const next = { ...prev };
      (s.category2 ?? []).forEach((a) => {
        next[a.label] = true;
      });
      return next;
    });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    refresh().catch(() => setError("Failed to load summary"));
  }, [userId, refresh]);

  /* ---------- ADD / EDIT ---------- */

  const handleAdd = async (label: string) => {
    const value = hours[label];
    if (!value || value <= 0) {
      setError("Enter hours/week > 0");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await addCategory2(userId, label, value);

      // immediately mark as added + stop editing (UI becomes frozen)
      setAdded((p) => ({ ...p, [label]: true }));
      setEditing((p) => ({ ...p, [label]: false }));

      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (label: string) => {
    setError("");
    setEditing((p) => ({ ...p, [label]: true }));
  };

  const saveEdit = async (label: string) => {
    const value = hours[label];
    if (!value || value <= 0) {
      setError("Enter hours/week > 0");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await addCategory2(userId, label, value);

      // stop editing (UI freezes again)
      setEditing((p) => ({ ...p, [label]: false }));
      setAdded((p) => ({ ...p, [label]: true }));

      await refresh();
    } finally {
      setLoading(false);
    }
  };

  /* ---------- CUSTOM ---------- */

  const handleAddCustom = async () => {
    const label = customLabel.trim();
    if (!label || customHours <= 0) {
      setError("Enter label and hours");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await addCategory2(userId, label, customHours);

      // make it editable in UI immediately
      setHours((p) => ({ ...p, [label]: customHours }));
      setAdded((p) => ({ ...p, [label]: true }));
      setEditing((p) => ({ ...p, [label]: false }));

      setCustomLabel("");
      setCustomHours(0);

      await refresh();
    } finally {
      setLoading(false);
    }
  };

  /* ---------- 🔥 LIVE PREVIEW MAINTENANCE ---------- */

  const previewMaintenance = useMemo(() => {
    if (!summary) return [];

    return (summary.category2 ?? []).map((a) => {
      // while editing, compute preview years from hours
      if (editing[a.label]) {
        const editedHours = hours[a.label] ?? 0;
        const editedYears =
          (editedHours * 52 * summary.level1.remaining_years) / (24 * 365);

        return { label: a.label, value: editedYears };
      }

      // otherwise use backend value
      return { label: a.label, value: a.years };
    });
  }, [summary, hours, editing]);

  const adjusted = summary?.adjusted;

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">Life Level2</h2>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {adjusted && (
        <div className="space-y-2 pt-4">
          <Cat2Bar
            sleep={adjusted.sleep_years}
            work={adjusted.work_years}
            commute={adjusted.commute_years}
            routine={adjusted.routine_years}
            free={adjusted.free_years}
            maintenance={previewMaintenance}
          />
          <p className="text-xs text-zinc-500">
            Maintenance used: {summary?.maintenance_years.toFixed(2)}y
          </p>
        </div>
      )}

      {summaryMode && summary && (
        <div className="space-y-2">
          <h3 className="text-sm text-zinc-400">Your life maintenance</h3>
          <ul className="text-sm text-zinc-200 space-y-1">
            {summary.category2.map((a) => (
              <li key={a.label}>
                • {a.label}: {a.years.toFixed(2)} years
              </li>
            ))}
          </ul>
        </div>
      )}

      {!summaryMode && (
        <>
          {/* PRESETS */}
          <div className="space-y-4">
            {PRESETS.map((label) => {
              const isAdded = !!added[label];
              const isEditing = !!editing[label];
              const frozen = isAdded && !isEditing;

              return (
                <MaintenanceItem
                  key={label}
                  label={label}
                  value={hours[label] ?? 0}
                  frozen={frozen}
                  added={isAdded}
                  editing={isEditing}
                  loading={loading}
                  onChange={(v) => setHours((p) => ({ ...p, [label]: v }))}
                  onAdd={() => handleAdd(label)}
                  onEdit={() => startEdit(label)}
                  onSave={() => saveEdit(label)}
                />
              );
            })}
          </div>
        </>
      )}

      {/* CUSTOM */}
      <div className="pt-6 border-t border-zinc-800 space-y-3">
        <label className="text-sm text-zinc-400">Custom activity</label>

        <input
          value={customLabel}
          onChange={(e) => setCustomLabel(e.target.value)}
          placeholder="e.g. Meditation"
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
            className="rounded bg-emerald-600 px-4 py-2 text-black disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>
      <button
        onClick={() => setSummaryMode((v) => !v)}
        className="rounded border border-zinc-600 px-4 py-2 text-sm text-zinc-300"
      >
        {summaryMode ? "Edit activities" : "View summary"}
      </button>
      <button
        onClick={() => navigate("/level3")}
        className="w-full rounded bg-red-700 px-4 py-2 text-sm text-black"
      >
        Continue to Life Leakage
      </button>
    </div>
  );
}

/* ---------- ITEM ---------- */

function MaintenanceItem({
  label,
  value,
  frozen,
  added,
  editing,
  loading,
  onChange,
  onAdd,
  onEdit,
  onSave,
}: {
  label: string;
  value: number;
  frozen: boolean;
  added: boolean;
  editing: boolean;
  loading: boolean;
  onChange: (v: number) => void;
  onAdd: () => void;
  onEdit: () => void;
  onSave: () => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-zinc-400">{label} (hours/week)</label>

      <div className="flex gap-3">
        <input
          type="number"
          value={value}
          disabled={frozen}
          onChange={(e) => onChange(Number(e.target.value))}
          onFocus={(e) => e.currentTarget.select()}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 disabled:opacity-60"
        />

        {!added ? (
          <button
            onClick={onAdd}
            disabled={loading}
            className="rounded bg-emerald-600 px-4 py-2 text-black disabled:opacity-40"
          >
            Add
          </button>
        ) : editing ? (
          <button
            onClick={onSave}
            disabled={loading}
            className="rounded bg-emerald-600 px-4 py-2 text-black disabled:opacity-40"
          >
            Save
          </button>
        ) : (
          <button
            onClick={onEdit}
            className="rounded border border-zinc-600 px-4 py-2 text-zinc-300"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
