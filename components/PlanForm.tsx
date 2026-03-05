"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormInput, MealPlan } from "@/lib/types";

const PROTEINS = ["Chicken", "Fish", "Shrimp", "Eggs", "Tofu", "Paneer", "Beans", "Beef", "Pork"];
const CARBS = ["Rice", "Quinoa", "Pasta", "Sweet Potato", "Pita / Flatbread", "Farro", "Couscous"];
const RESTRICTIONS = ["No shellfish", "No gluten", "No dairy", "No nuts", "None"];
const PLAN_LENGTHS = [3, 5, 6] as const;

const defaultForm: FormInput = {
  planLength: 5,
  proteins: [],
  carbs: [],
  servings: 2,
  restrictions: [],
  adventurousness: "moderate",
};

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

export default function PlanForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormInput>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.proteins.length === 0 || form.carbs.length === 0) {
      setError("Please select at least one protein and one carb.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || "Generation failed.");
      }
      const plan: MealPlan = await res.json();
      sessionStorage.setItem("mealPlan", JSON.stringify(plan));
      sessionStorage.setItem("formInput", JSON.stringify(form));
      router.push("/plan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Plan Length */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2C6E49]">
          Plan Length
        </h2>
        <div className="flex gap-3">
          {PLAN_LENGTHS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setForm((f) => ({ ...f, planLength: n }))}
              className={`rounded-full border px-6 py-2 text-sm font-medium transition-colors ${
                form.planLength === n
                  ? "border-[#2C6E49] bg-[#2C6E49] text-white"
                  : "border-[#E2E2E2] bg-white text-[#3D3D3D] hover:border-[#4A9068] hover:text-[#2C6E49]"
              }`}
            >
              {n} days
            </button>
          ))}
        </div>
      </section>

      {/* Proteins */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2C6E49]">
          Proteins
        </h2>
        <div className="flex flex-wrap gap-2">
          {PROTEINS.map((p) => (
            <label
              key={p}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                form.proteins.includes(p)
                  ? "border-[#2C6E49] bg-[#F0F7F3] text-[#2C6E49]"
                  : "border-[#E2E2E2] bg-white text-[#3D3D3D] hover:border-[#4A9068]"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={form.proteins.includes(p)}
                onChange={() => setForm((f) => ({ ...f, proteins: toggle(f.proteins, p) }))}
              />
              {p}
            </label>
          ))}
        </div>
      </section>

      {/* Carbs */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2C6E49]">
          Carbs
        </h2>
        <div className="flex flex-wrap gap-2">
          {CARBS.map((c) => (
            <label
              key={c}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                form.carbs.includes(c)
                  ? "border-[#2C6E49] bg-[#F0F7F3] text-[#2C6E49]"
                  : "border-[#E2E2E2] bg-white text-[#3D3D3D] hover:border-[#4A9068]"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={form.carbs.includes(c)}
                onChange={() => setForm((f) => ({ ...f, carbs: toggle(f.carbs, c) }))}
              />
              {c}
            </label>
          ))}
        </div>
      </section>

      {/* Servings */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2C6E49]">
          Servings
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, servings: Math.max(1, f.servings - 1) }))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E2E2] text-[#3D3D3D] hover:border-[#4A9068] hover:text-[#2C6E49]"
          >
            −
          </button>
          <span className="w-8 text-center text-lg font-semibold text-[#1A1A1A]">
            {form.servings}
          </span>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, servings: f.servings + 1 }))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E2E2] text-[#3D3D3D] hover:border-[#4A9068] hover:text-[#2C6E49]"
          >
            +
          </button>
          <span className="text-sm text-[#6B6B6B]">people</span>
        </div>
      </section>

      {/* Dietary Restrictions */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2C6E49]">
          Dietary Restrictions
        </h2>
        <div className="flex flex-wrap gap-2">
          {RESTRICTIONS.map((r) => (
            <label
              key={r}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                form.restrictions.includes(r)
                  ? "border-[#2C6E49] bg-[#F0F7F3] text-[#2C6E49]"
                  : "border-[#E2E2E2] bg-white text-[#3D3D3D] hover:border-[#4A9068]"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={form.restrictions.includes(r)}
                onChange={() =>
                  setForm((f) => ({ ...f, restrictions: toggle(f.restrictions, r) }))
                }
              />
              {r}
            </label>
          ))}
        </div>
      </section>

      {/* Adventurousness */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2C6E49]">
          Flavor Profile
        </h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          {(
            [
              { value: "simple", label: "Simple & familiar" },
              { value: "moderate", label: "Moderately adventurous" },
              { value: "bold", label: "Bold flavors" },
            ] as const
          ).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, adventurousness: value }))}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                form.adventurousness === value
                  ? "border-[#2C6E49] bg-[#2C6E49] text-white"
                  : "border-[#E2E2E2] bg-white text-[#3D3D3D] hover:border-[#4A9068] hover:text-[#2C6E49]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Error */}
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-[#2C6E49] px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-[#4A9068] disabled:opacity-60"
      >
        {loading ? "Generating your plan…" : "Generate My Plan"}
      </button>
    </form>
  );
}
