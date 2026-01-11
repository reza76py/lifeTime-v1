import { useState } from "react";
import { createUserProfile } from "../api/level1";

type Props = {
  onCreated: (userId: number) => void;
};

export default function Start({ onCreated }: Props) {
  const [age, setAge] = useState("");
  const [lifeExpectancy, setLifeExpectancy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    const ageNum = Number(age);
    const lifeNum = Number(lifeExpectancy);

    if (!ageNum || ageNum <= 0) {
      setError("Enter a valid age.");
      return;
    }

    if (!lifeNum || lifeNum <= ageNum) {
      setError("Life expectancy must be greater than your age.");
      return;
    }

    setLoading(true);
    try {
      const user = await createUserProfile(ageNum, lifeNum);
      onCreated(user.id);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Define your life context
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          These two numbers define the timeline of your life
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div className="space-y-2">

          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="current age"
            className="
              w-full rounded-lg px-4 py-3
              bg-zinc-900 border border-zinc-700
              text-zinc-100 placeholder-zinc-500
              focus:outline-none focus:ring-2 focus:ring-emerald-500/50
            "
          />
        </div>

        <div className="space-y-2">

          <input
            type="number"
            value={lifeExpectancy}
            onChange={(e) => setLifeExpectancy(e.target.value)}
            placeholder="life expectancy"
            className="
              w-full rounded-lg px-4 py-3
              bg-zinc-900 border border-zinc-700
              text-zinc-100 placeholder-zinc-500
              focus:outline-none focus:ring-2 focus:ring-emerald-500/50
            "
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-400 border border-red-400/30 rounded-lg px-4 py-3 bg-red-500/5">
          {error}
        </div>
      )}

      {/* Action */}
      <button
        onClick={submit}
        disabled={loading}
        className="
          w-full py-3 rounded-lg font-medium tracking-wide
          bg-emerald-500 text-zinc-900
          hover:bg-emerald-400
          disabled:opacity-50 disabled:cursor-not-allowed
          transition
        "
      >
        {loading ? "Saving context…" : "Continue"}
      </button>

      {/* Subtle hint */}

    </div>
  );
}
