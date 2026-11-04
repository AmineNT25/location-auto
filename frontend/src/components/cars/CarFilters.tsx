"use client";
import { CarFront, Gem, Zap, LayoutGrid, Car, Wallet } from "lucide-react";
import { categories, type Category } from "@/types/car";
const icons = [LayoutGrid, CarFront, Car, Gem, Wallet, Zap];
export default function CarFilters({
  value,
  onChange,
}: {
  value: Category;
  onChange: (value: Category) => void;
}) {
  return (
    <div aria-label="Vehicle category" className="flex flex-wrap gap-2">
      {categories.map((category, i) => {
        const Icon = icons[i];
        return (
          <button
            key={category}
            aria-pressed={value === category}
            onClick={() => onChange(category)}
            className={`flex items-center gap-2 rounded-md border px-4 py-2.5 text-xs font-medium transition-colors sm:px-5 sm:text-sm ${value === category ? "border-brand bg-brand text-white" : "border-gray-200 bg-white text-muted hover:border-brand/40 hover:text-brand"}`}
          >
            <Icon className="size-4" />
            {category}
          </button>
        );
      })}
    </div>
  );
}
