"use client";

import { useState } from "react";
import { MealPlan } from "@/lib/types";
import DayCard from "./DayCard";

interface Props {
  plan: MealPlan;
}

async function downloadDocx(plan: MealPlan) {
  const res = await fetch("/api/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plan),
  });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "meal-prep-plan.docx";
  a.click();
  URL.revokeObjectURL(url);
}

export default function PlanPreview({ plan }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setDownloading(true);
    setError(null);
    try {
      await downloadDocx(plan);
    } catch {
      setError("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  const DownloadButton = ({ className }: { className?: string }) => (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`rounded-2xl bg-[#2C6E49] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4A9068] disabled:opacity-60 ${className ?? ""}`}
    >
      {downloading ? "Preparing…" : "Download .docx"}
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Top download button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">
          {plan.days.length}-day plan
        </h2>
        <DownloadButton />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {/* Summary table */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-[#E2E2E2]">
        <div className="flex bg-[#2C6E49] px-6 py-3">
          <span className="w-24 text-xs font-bold uppercase tracking-widest text-white">Day</span>
          <span className="text-xs font-bold uppercase tracking-widest text-white">Meal</span>
        </div>
        <div className="divide-y divide-[#E2E2E2]">
          {plan.days.map((day, i) => (
            <div
              key={day.day}
              className={`flex px-6 py-3 text-sm ${i % 2 === 0 ? "bg-[#F0F7F3]" : "bg-white"}`}
            >
              <span className="w-24 font-semibold text-[#1A1A1A]">{day.day}</span>
              <span className="text-[#3D3D3D]">{day.mealName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sunday prep */}
      <div className="rounded-2xl border border-[#E2E2E2] bg-white shadow-sm overflow-hidden">
        <div className="border-l-4 border-[#2C6E49] px-6 py-5">
          <h2 className="mb-4 font-serif text-xl font-semibold text-[#1A1A1A]">Sunday Prep</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2C6E49]">
                Chop & Store
              </h3>
              <ul className="space-y-1">
                {plan.sundayPrep.chopAndStore.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[#3D3D3D]">
                    <span className="text-[#4A9068] shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2C6E49]">
                Cook Tonight
              </h3>
              <ul className="space-y-1">
                {plan.sundayPrep.cookTonight.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[#3D3D3D]">
                    <span className="text-[#4A9068] shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Day cards */}
      <div className="space-y-3">
        {plan.days.map((day, i) => (
          <DayCard
            key={day.day}
            day={day}
            index={i}
            isLast={i === plan.days.length - 1}
          />
        ))}
      </div>

      {/* Grocery list */}
      <div className="rounded-2xl border border-[#E2E2E2] bg-white shadow-sm px-6 py-5">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#2C6E49]">
          Grocery List
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { label: "Proteins",           items: plan.groceryList.proteins },
            { label: "Carbs & Grains",     items: plan.groceryList.carbsAndGrains },
            { label: "Vegetables",         items: plan.groceryList.vegetables },
            { label: "Fresh Produce",      items: plan.groceryList.freshProduce },
            { label: "Fruits",             items: plan.groceryList.fruits },
            { label: "Pantry & Condiments", items: plan.groceryList.pantryAndCondiments },
          ].map(({ label, items }) => (
            <div key={label}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">
                {label}
              </h3>
              <ul className="space-y-1">
                {items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[#3D3D3D]">
                    <span className="text-[#A0A0A0]">☐</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom download button */}
      <div className="flex justify-center pb-8">
        <DownloadButton className="px-10 py-4 text-base" />
      </div>
    </div>
  );
}
