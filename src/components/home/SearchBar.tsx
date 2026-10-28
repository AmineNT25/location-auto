"use client";
import { MapPin, CalendarDays, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { locations, type SearchCriteria } from "@/types/car";
import { localDate, nextDate, validateDates } from "@/lib/rental";
export default function SearchBar({
  onSearch,
}: {
  onSearch: (criteria: SearchCriteria) => void;
}) {
  const [location, setLocation] = useState("");
  const [pickup, setPickup] = useState("");
  const [returnDate, setReturn] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="relative z-10 mx-auto -mt-12 max-w-7xl px-5 sm:px-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const issue = validateDates(pickup, returnDate);
          setError(issue);
          if (!issue) onSearch({ location, pickup, returnDate });
        }}
        className="rounded-lg border border-gray-100 bg-white p-5 shadow-[0_12px_45px_-12px_rgba(21,26,56,0.2)] sm:p-7"
      >
        <div className="grid gap-5 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center">
          <label className="block md:border-r md:border-gray-200 md:pr-5">
            <span className="mb-2 flex items-center gap-2 text-xs font-semibold">
              <MapPin className="size-4 text-brand" /> Pickup location
            </span>
            <span className="relative block">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full appearance-none bg-transparent pr-5 text-sm text-muted"
                aria-label="Pickup location"
              >
                <option value="">All locations</option>
                {locations.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-0.5 size-4 text-muted" />
            </span>
          </label>
          <label className="block md:border-r md:border-gray-200 md:pr-5">
            <span className="mb-2 flex items-center gap-2 text-xs font-semibold">
              <CalendarDays className="size-4 text-brand" /> Pickup date
            </span>
            <input
              aria-label="Pickup date"
              required
              type="date"
              min={localDate()}
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
                if (returnDate && returnDate <= e.target.value)
                  setReturn(nextDate(e.target.value));
              }}
              className="w-full bg-transparent text-sm text-muted"
            />
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-semibold">
              <CalendarDays className="size-4 text-brand" /> Return date
            </span>
            <input
              aria-label="Return date"
              required
              type="date"
              min={pickup ? nextDate(pickup) : nextDate(localDate())}
              value={returnDate}
              onChange={(e) => setReturn(e.target.value)}
              className="w-full bg-transparent text-sm text-muted"
            />
          </label>
          <button className="flex items-center justify-center gap-3 rounded-md bg-brand px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-brand/90">
            <Search className="size-4" /> Search Cars
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
