import { Macros } from "@/lib/types";

interface Props {
  macros: Macros;
}

export default function MacrosBar({ macros }: Props) {
  const items = [
    { label: "Calories", value: macros.calories },
    { label: "Protein",  value: `${macros.protein}g` },
    { label: "Carbs",    value: `${macros.carbs}g` },
    { label: "Fat",      value: `${macros.fat}g` },
  ];

  return (
    <div className="grid grid-cols-4 divide-x divide-[#E2E2E2] rounded-xl border border-[#E2E2E2] bg-[#F5F5F5] overflow-hidden">
      {items.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center py-3 px-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#A0A0A0]">
            {label}
          </span>
          <span className="mt-1 text-lg font-bold text-[#1A1A1A]">{value}</span>
        </div>
      ))}
    </div>
  );
}
