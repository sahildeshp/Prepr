"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MealPlan } from "@/lib/types";
import PlanPreview from "@/components/PlanPreview";

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
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-3xl font-bold text-[#2C6E49]">Your Plan</h1>
          <Link href="/" className="text-sm text-[#6B6B6B] hover:text-[#2C6E49]">
            ← Start over
          </Link>
        </div>
        <PlanPreview plan={plan} />
      </div>
    </div>
  );
}
