"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MealPlan } from "@/lib/types";

export default function PlanPage() {
  const [plan, setPlan] = useState<MealPlan | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("mealPlan");
    if (raw) setPlan(JSON.parse(raw) as MealPlan);
  }, []);

  if (!plan) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <p className="mb-4 text-[#6B6B6B]">No plan found.</p>
          <Link href="/" className="text-sm font-medium text-[#2C6E49] hover:underline">
            ← Start over
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-3xl font-bold text-[#2C6E49]">Your Plan</h1>
          <Link href="/" className="text-sm text-[#6B6B6B] hover:text-[#2C6E49]">
            ← Start over
          </Link>
        </div>

        {/* Summary */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#2C6E49]">
            Summary
          </h2>
          <div className="divide-y divide-[#E2E2E2]">
            {plan.days.map((day) => (
              <div key={day.day} className="flex justify-between py-3 text-sm">
                <span className="font-medium text-[#1A1A1A]">{day.day}</span>
                <span className="text-[#6B6B6B]">{day.mealName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder — full preview coming in Step 3 */}
        <div className="rounded-2xl border border-dashed border-[#E2E2E2] bg-white p-8 text-center text-sm text-[#A0A0A0] shadow-sm">
          Full plan preview + download coming next.
        </div>
      </div>
    </div>
  );
}
