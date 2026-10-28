"use client";
import Image from "next/image";
import { useState } from "react";
import { Check, MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import Modal from "@/components/ui/Modal";
import type { Car, SearchCriteria } from "@/types/car";
import {
  currency,
  isAvailable,
  localDate,
  nextDate,
  rentalDays,
  validateDates,
} from "@/lib/rental";
export default function BookingModal({
  car,
  criteria,
  onClose,
}: {
  car: Car;
  criteria: SearchCriteria;
  onClose: () => void;
}) {
  const [pickup, setPickup] = useState(
    criteria.pickup || nextDate(localDate()),
  );
  const [returnDate, setReturn] = useState(
    criteria.returnDate || nextDate(localDate(), 4),
  );
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const days = rentalDays(pickup, returnDate);
  const valid = !validateDates(pickup, returnDate);
  const total = valid ? days * car.price : 0;
  return (
    <Modal
      title={confirmed ? "You're ready for the road" : "Make it your next ride"}
      onClose={onClose}
    >
      {confirmed ? (
        <div className="p-7 text-center">
          <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Check className="size-8" />
          </span>
          <h3 className="text-2xl font-semibold">Adventure, here you come.</h3>
          <p className="mt-3 text-sm leading-6 text-muted">
            Your demo booking for the {car.brand} {car.model} is confirmed.
          </p>
          <div className="my-6 rounded-md bg-paper p-5 text-left text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted">Your dates</span>
              <span>
                {pickup} to {returnDate}
              </span>
            </div>
            <div className="mt-3 flex justify-between">
              <span className="text-muted">
                {days} {days === 1 ? "day" : "days"} in {car.location}
              </span>
              <strong>{currency(total)} MAD</strong>
            </div>
          </div>
          <p className="text-xs leading-5 text-muted">
            This is a frontend demo. No vehicle has been reserved and no payment
            has been taken.
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-md bg-brand py-3.5 text-sm font-semibold text-white"
          >
            Keep exploring
          </button>
        </div>
      ) : (
        <form
          className="p-6"
          onSubmit={(e) => {
            e.preventDefault();
            const issue = validateDates(pickup, returnDate);
            if (issue) {
              setError(issue);
              return;
            }
            if (!isAvailable(car, { ...criteria, pickup, returnDate })) {
              setError(
                "This car is unavailable for those dates. Please choose another period.",
              );
              return;
            }
            setError("");
            setConfirmed(true);
          }}
        >
          <div className="relative mb-5 aspect-[2.1] overflow-hidden rounded-md">
            <Image
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              fill
              sizes="480px"
              className="object-cover"
            />
          </div>
          <p className="text-xs font-medium text-brand">{car.category}</p>
          <h3 className="mt-1 text-xl font-semibold">
            {car.brand} {car.model}
          </h3>
          <p className="mt-2 flex items-center gap-1 text-xs text-muted">
            <MapPin className="size-3.5" />
            {car.location}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 min-[400px]:grid-cols-2">
            <label className="text-xs font-medium">
              Pickup date
              <input
                aria-label="Booking pickup date"
                required
                type="date"
                value={pickup}
                min={localDate()}
                onChange={(e) => {
                  setPickup(e.target.value);
                  if (returnDate <= e.target.value)
                    setReturn(nextDate(e.target.value));
                }}
                className="mt-2 block w-full rounded-md border border-gray-200 p-3 text-sm"
              />
            </label>
            <label className="text-xs font-medium">
              Return date
              <input
                aria-label="Booking return date"
                required
                type="date"
                value={returnDate}
                min={pickup ? nextDate(pickup) : nextDate(localDate())}
                onChange={(e) => setReturn(e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-200 p-3 text-sm"
              />
            </label>
          </div>
          <div className="mt-6 space-y-3 border-y border-gray-100 py-5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">
                {currency(car.price)} MAD x {valid ? days : 0} days
              </span>
              <span>{currency(total)} MAD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Booking fee</span>
              <span className="text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between pt-2 text-lg font-semibold">
              <span>Estimated total</span>
              <span>{currency(total)} MAD</span>
            </div>
          </div>
          {error && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}
          <button className="mt-5 flex w-full items-center justify-center gap-3 rounded-md bg-brand py-3.5 text-sm font-semibold text-white hover:bg-brand/90">
            Confirm Booking <ArrowRight className="size-4" />
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted">
            <ShieldCheck className="size-3.5" /> Demo booking. No payment
            required.
          </p>
        </form>
      )}
    </Modal>
  );
}
