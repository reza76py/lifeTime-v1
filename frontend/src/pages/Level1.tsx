import { useEffect, useRef, useState } from "react";
import { submitLevel1 } from "../api/level1";
import type { Level1Result, Level1Payload } from "../api/level1";
import { useNavigate } from "react-router-dom";
import Cat1Bar from "../graphs/Cat1Bar";

type Props = {
  userId: number;
  onResultChange: (r: Level1Result) => void;
  hasResult: boolean;
  result: Level1Result | null; // ✅ ADD THIS
};

export default function Level1({
  userId,
  onResultChange,
  hasResult,
  result,
}: Props) {
  const [inputs, setInputs] = useState<Level1Payload>({
    sleep_hours_per_day: 0,
    work_hours_per_day: 0,
    work_days_per_week: 0,
    commute_hours_per_workday: 0,
    daily_routine_hours: 0,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // 🔥 LIVE UPDATE LOGIC
  useEffect(() => {
    if (!userId) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(async () => {
      try {
        setError("");
        setLoading(true);
        const r = await submitLevel1(userId, inputs);
        onResultChange(r);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to update graph");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputs, userId, onResultChange]);

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">Survival & obligation</h2>

      {/* ✅ CATEGORY 1 GRAPH */}
      {hasResult && result && (
        <div className="space-y-2 pt-4">
          <Cat1Bar
            sleep={result.sleep_years}
            work={result.work_years}
            commute={result.commute_years}
            routine={result.routine_years}
            free={result.free_years}
          />
        </div>
      )}

      {/* INPUTS */}
      <div className="space-y-4">
        <Input
          label="Sleep (hours/day)"
          value={inputs.sleep_hours_per_day}
          onChange={(v) => setInputs({ ...inputs, sleep_hours_per_day: v })}
        />

        <Input
          label="Work (hours/day)"
          value={inputs.work_hours_per_day}
          onChange={(v) => setInputs({ ...inputs, work_hours_per_day: v })}
        />

        <Input
          label="Work days / week"
          value={inputs.work_days_per_week}
          onChange={(v) => setInputs({ ...inputs, work_days_per_week: v })}
        />

        <Input
          label="Commute (hours/workday)"
          value={inputs.commute_hours_per_workday}
          onChange={(v) =>
            setInputs({ ...inputs, commute_hours_per_workday: v })
          }
        />

        <Input
          label="Daily routine (hours/day)"
          value={inputs.daily_routine_hours}
          onChange={(v) => setInputs({ ...inputs, daily_routine_hours: v })}
        />
      </div>

      {error && <p className="text-red-400">{error}</p>}
      {loading && <p className="text-sm text-zinc-400">Updating…</p>}

      {/* GO TO CATEGORY 2 */}
      {hasResult && (
        <div className="pt-6 border-t border-zinc-800">
          <button
            onClick={() => navigate("/maintenance")}
            className="w-full rounded bg-emerald-600 px-4 py-3 text-sm font-medium text-black hover:bg-emerald-500 transition"
          >
            Go to Life Level2
          </button>


        </div>
      )}
    </div>
  );
}

/* Small reusable input */
function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-zinc-400">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onFocus={(e) => e.currentTarget.select()}
        className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
      />
    </div>
  );
}
