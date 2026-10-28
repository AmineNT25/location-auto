"use client";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Users,
  Fuel,
  Settings2,
  Star,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import type { Car } from "@/types/car";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { currency } from "@/lib/rental";
export default function CarCard({
  car,
  favorite,
  onFavorite,
  onBook,
  index,
}: {
  car: Car;
  favorite: boolean;
  onFavorite: (id: number) => void;
  onBook: (car: Car) => void;
  index: number;
}) {
  return (
    <ScrollReveal delay={(index % 3) * 0.09}>
      <article className="group h-full overflow-hidden rounded-lg border border-gray-200/80 bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[1.65] overflow-hidden bg-gray-100">
          <Image
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {car.badge && (
            <span
              className={`absolute left-4 top-4 flex items-center gap-1.5 rounded bg-white/95 px-2.5 py-1.5 text-[10px] font-semibold ${car.fuel === "Electric" ? "text-emerald-700" : "text-ink"}`}
            >
              {car.fuel === "Electric" ? (
                <Zap className="size-3" />
              ) : (
                <Star className="size-3 text-brand" />
              )}
              {car.badge}
            </span>
          )}
          <button
            onClick={() => onFavorite(car.id)}
            aria-label={`${favorite ? "Unsave" : "Save"} ${car.brand} ${car.model} in ${car.location}`}
            aria-pressed={favorite}
            title={favorite ? "Remove from favorites" : "Save car"}
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/95 shadow-sm"
          >
            <Heart
              className={`size-4 transition-colors ${favorite ? "fill-brand text-brand" : "text-ink"}`}
            />
          </button>
          <span className="absolute bottom-3 left-4 rounded bg-white/95 px-2 py-1 text-[10px] font-medium text-muted">
            {car.category}
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold">
              {car.brand} {car.model}
            </h3>
            <span className="flex shrink-0 items-center gap-1 pt-1 text-xs font-medium">
              <Star className="size-3 fill-[#eab55c] text-[#eab55c]" />
              {car.rating}
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
            <MapPin className="size-3.5" /> {car.location}
            <span className="ml-auto text-[10px]">
              {car.trips} sample trips
            </span>
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2 border-b border-gray-100 pb-5 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <Users className="size-3.5 shrink-0" />
              {car.seats} seats
            </span>
            <span className="flex items-center gap-1.5">
              <Settings2 className="size-3.5 shrink-0" />
              {car.transmission}
            </span>
            <span className="flex items-center justify-end gap-1.5">
              <Fuel className="size-3.5 shrink-0" />
              {car.fuel}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            <p>
              <span className="text-xl font-bold">{currency(car.price)}</span>
              <span className="ml-1 text-[11px] font-semibold">MAD</span>
              <span className="text-xs text-muted"> / day</span>
            </p>
            <button
              onClick={() => onBook(car)}
              className="flex items-center gap-3 rounded-md bg-brand/8 px-3.5 py-2.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
            >
              Rent Now <ArrowUpRight className="size-3.5" />
            </button>
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}
