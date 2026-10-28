import type { Car, SearchCriteria } from "@/types/car";
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function nextDate(value: string, days = 1) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return localDate(date);
}
export function rentalDays(pickup: string, returnDate: string) {
  return Math.round((Date.parse(returnDate) - Date.parse(pickup)) / 86400000);
}
export function validateDates(pickup: string, returnDate: string) {
  if (
    !pickup ||
    !returnDate ||
    !Number.isFinite(rentalDays(pickup, returnDate))
  )
    return "Please select your pickup and return dates.";
  if (pickup < localDate()) return "Pickup date must be today or later.";
  if (rentalDays(pickup, returnDate) < 1)
    return "Return date must be at least one day after pickup.";
  return "";
}
export function isAvailable(car: Car, criteria: SearchCriteria) {
  return !car.unavailable?.some(
    ([start, end]) => criteria.pickup < end && criteria.returnDate > start,
  );
}
export const currency = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);
