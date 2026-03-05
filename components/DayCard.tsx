"use client";

import { useState } from "react";
import { Day } from "@/lib/types";
import MacrosBar from "./MacrosBar";

interface Props {
  day: Day;
  index: number;
  isLast: boolean;
}

export default function DayCard({ day, isLast }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-[#E2E2E2] bg-white overflow-hidden shadow-sm">
      {/* Header — always visible */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#F5F5F5] transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#2C6E49] w-20 shrink-0">
            {day.day}
          </span>
          <span className="text-sm font-medium text-[#1A1A1A]">{day.mealName}</span>
        </div>
        <span className="text-[#A0A0A0] text-lg leading-none">{open ? "−" : "+"}</span>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-[#E2E2E2] px-6 py-5 space-y-5">
          {/* Info tags */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Protein",    value: day.protein },
              { label: "Carb",       value: day.carb },
              { label: "Vegetables", value: day.vegetables },
              { label: "Fruit",      value: day.fruit },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-[#F0F7F3] px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#2C6E49]">
                  {label}
                </p>
                <p className="mt-0.5 text-xs text-[#3D3D3D]">{value}</p>
              </div>
            ))}
          </div>

          {/* Macros */}
          <MacrosBar macros={day.macros} />

          {/* Ingredients */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2C6E49]">
              Ingredients
            </h3>
            <ul className="space-y-1">
              {day.ingredients.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-[#3D3D3D]">
                  <span className="text-[#4A9068] shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Cooking instructions */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2C6E49]">
              Cooking Instructions
            </h3>
            <ol className="space-y-2">
              {day.cookingInstructions.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#3D3D3D]">
                  <span className="shrink-0 font-semibold text-[#2C6E49]">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Tonight's prep */}
          {!isLast && day.tonightPrep && day.tonightPrep.length > 0 && (
            <div className="rounded-xl border border-[#E2E2E2] bg-[#F5F5F5] px-4 py-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2C6E49]">
                Tonight&apos;s Prep for Tomorrow
              </h3>
              <ul className="space-y-1">
                {day.tonightPrep.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[#3D3D3D]">
                    <span className="text-[#4A9068] shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
