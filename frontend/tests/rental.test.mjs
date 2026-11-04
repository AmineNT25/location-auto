import { test } from "node:test";
import assert from "node:assert/strict";
import {
  localDate,
  nextDate,
  rentalDays,
  validateDates,
  isAvailable,
} from "../src/lib/rental.ts";

test("rental duration is calendar-based across month and year boundaries", () => {
  assert.equal(rentalDays("2026-12-30", "2027-01-02"), 3);
  assert.equal(rentalDays("2028-02-28", "2028-03-01"), 2);
  assert.equal(nextDate("2026-12-31"), "2027-01-01");
});

test("date validation rejects missing, reversed, same-day and past rentals", () => {
  const today = localDate();
  const tomorrow = nextDate(today);
  assert.ok(validateDates("", ""));
  assert.ok(validateDates(today, today));
  assert.ok(validateDates(tomorrow, today));
  assert.ok(validateDates("2020-01-01", "2020-01-04"));
  assert.equal(validateDates(today, tomorrow), "");
  assert.equal(rentalDays(today, tomorrow) * 950, 950);
});

test("availability excludes overlaps but allows adjacent reservations", () => {
  const car = { unavailable: [["2026-12-20", "2026-12-27"]] };
  const available = (pickup, returnDate) =>
    isAvailable(car, { pickup, returnDate, location: "" });
  assert.equal(available("2026-12-19", "2026-12-21"), false);
  assert.equal(available("2026-12-21", "2026-12-23"), false);
  assert.equal(available("2026-12-18", "2026-12-29"), false);
  assert.equal(available("2026-12-19", "2026-12-20"), true);
  assert.equal(available("2026-12-27", "2026-12-28"), true);
  assert.equal(
    isAvailable({}, { pickup: "2026-12-21", returnDate: "2026-12-23" }),
    true,
  );
});
