"use client";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import CarCard from "@/components/cars/CarCard";
import CarSkeleton from "@/components/ui/CarSkeleton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { SearchX, Check } from "lucide-react";
import type { Car } from "@/types/car";
export default function CarListing({
  cars,
  favorites,
  onFavorite,
  onBook,
  onReset,
}: {
  cars: Car[];
  favorites: number[];
  onFavorite: (id: number) => void;
  onBook: (car: Car) => void;
  onReset: () => void;
}) {
  const { count, loading, sentinel, hasMore } = useInfiniteScroll(cars.length);
  return (
    <>
      <div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        aria-busy={loading}
      >
        {cars.slice(0, count).map((car, i) => (
          <CarCard
            key={car.id}
            car={car}
            index={i}
            favorite={favorites.includes(car.id)}
            onFavorite={onFavorite}
            onBook={onBook}
          />
        ))}
        {loading &&
          Array.from(
            {
              length: Math.min(
                count === 0 ? 6 : 3,
                Math.max(cars.length - count, 0),
              ),
            },
            (_, i) => <CarSkeleton key={`skeleton-${i}`} />,
          )}
      </div>
      {!loading && !cars.length && (
        <div className="py-16 text-center">
          <SearchX className="mx-auto mb-4 size-9 text-brand" />
          <h3 className="text-xl font-semibold">No cars found just yet</h3>
          <p className="mt-2 text-sm text-muted">
            Try another location or category, or explore the full collection.
          </p>
          <button
            onClick={onReset}
            className="mt-5 rounded-md bg-brand px-5 py-3 text-sm text-white"
          >
            Explore all cars
          </button>
        </div>
      )}
      <div
        ref={sentinel}
        className="flex min-h-20 items-center justify-center pt-6"
        aria-live="polite"
      >
        {loading ? (
          <LoadingSpinner />
        ) : !hasMore && cars.length > 0 ? (
          <span className="flex items-center gap-2 text-xs text-muted">
            <Check className="size-3.5" /> You&apos;ve explored all{" "}
            {cars.length} vehicles
          </span>
        ) : null}
      </div>
    </>
  );
}
