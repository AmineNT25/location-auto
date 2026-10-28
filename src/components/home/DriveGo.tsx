"use client";
import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import {
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  X,
  Heart,
  SlidersHorizontal,
} from "lucide-react";
import { cars } from "@/data/cars";
import { isAvailable } from "@/lib/rental";
import type { Car, Category, SearchCriteria } from "@/types/car";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "./Hero";
import SearchBar from "./SearchBar";
import CarListing from "./CarListing";
import CarFilters from "@/components/cars/CarFilters";
import BookingModal from "@/components/cars/BookingModal";
import HowItWorks from "./HowItWorks";
import WhyChooseUs from "./WhyChooseUs";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AccountModal from "@/components/ui/AccountModal";
import Modal from "@/components/ui/Modal";
const emptyCriteria: SearchCriteria = {
  location: "",
  pickup: "",
  returnDate: "",
};
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("drivego-favorites", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("drivego-favorites", callback);
  };
}
let memoryFavorites = "[]";
function getSnapshot() {
  try {
    return localStorage.getItem("drivego-favorites") || memoryFavorites;
  } catch {
    return memoryFavorites;
  }
}
const serverSnapshot = () => "[]";
const info: Record<string, string> = {
  "Help & support":
    "DriveGo is a frontend prototype, so there is no live support team. The contact address shown is a placeholder. Explore the cars and use the booking form to try a demo reservation.",
  "Rental information":
    "Prices are sample daily rates in Moroccan dirhams (MAD). Rentals have a one-day minimum. Your estimate is the daily rate multiplied by the number of rental days. Demo confirmations do not reserve a real vehicle. All photos are illustrative.",
  "Privacy policy":
    "DriveGo stores only your favorite vehicle IDs in this browser's local storage. Account form details are never sent or saved. Search and demo booking details stay in memory and reset when you refresh. You can clear favorites by unsaving each vehicle or clearing this site's browser data.",
};
export default function DriveGo() {
  const [criteria, setCriteria] = useState<SearchCriteria>(emptyCriteria);
  const [category, setCategory] = useState<Category>("All Cars");
  const [savedOnly, setSavedOnly] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [selected, setSelected] = useState<Car | null>(null);
  const [account, setAccount] = useState(false);
  const [information, setInformation] = useState<string | null>(null);
  const stored = useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
  const favorites: number[] = useMemo(() => {
    try {
      const value: unknown = JSON.parse(stored);
      return Array.isArray(value)
        ? value.filter(
            (id): id is number =>
              typeof id === "number" && cars.some((car) => car.id === id),
          )
        : [];
    } catch {
      return [];
    }
  }, [stored]);
  const toggleFavorite = useCallback(
    (id: number) => {
      const next = favorites.includes(id)
        ? favorites.filter((item) => item !== id)
        : [...favorites, id];
      memoryFavorites = JSON.stringify(next);
      try {
        localStorage.setItem("drivego-favorites", memoryFavorites);
      } catch {
        /* Favorites remain available for this session when storage is disabled. */
      }
      window.dispatchEvent(new Event("drivego-favorites"));
    },
    [favorites],
  );
  const filtered = useMemo(() => {
    const result = cars.filter(
      (car) =>
        (!criteria.location || car.location === criteria.location) &&
        (category === "All Cars" || car.category === category) &&
        (!savedOnly || favorites.includes(car.id)) &&
        (!criteria.pickup || isAvailable(car, criteria)),
    );
    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    return result;
  }, [criteria, category, savedOnly, favorites, sort]);
  const closeBooking = useCallback(() => setSelected(null), []);
  const closeAccount = useCallback(() => setAccount(false), []);
  const closeInformation = useCallback(() => setInformation(null), []);
  const reset = () => {
    setCategory("All Cars");
    setCriteria(emptyCriteria);
    setSavedOnly(false);
  };
  const listingKey = `${criteria.location}-${criteria.pickup}-${criteria.returnDate}-${category}-${savedOnly}-${sort}`;
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#cars"
        className="sr-only z-50 rounded-md bg-white p-4 text-brand focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to vehicles
      </a>
      <Navbar
        favorites={favorites.length}
        savedOnly={savedOnly}
        onFavorites={() => {
          setSavedOnly((value) => !value);
          document
            .getElementById("cars")
            ?.scrollIntoView();
        }}
        onAccount={() => setAccount(true)}
      />
      <main>
        <Hero />
        <SearchBar
          onSearch={(value) => {
            setCriteria(value);
            document
              .getElementById("cars")
              ?.scrollIntoView();
          }}
        />
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-7 text-[11px] text-muted sm:px-8">
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-brand" /> A little peace of
            mind, every mile
          </span>
          <span className="hidden h-3 border-l border-gray-200 sm:block" />
          <span className="flex items-center gap-2">
            <MapPin className="size-4 text-brand" /> 5 Moroccan cities. Endless
            possibilities.
          </span>
          <span className="hidden h-3 border-l border-gray-200 lg:block" />
          <span className="flex items-center gap-2">
            <ArrowUpRight className="size-4 text-brand" /> Your next chapter
            starts here
          </span>
        </div>
        <section id="cars" className="bg-paper/60 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <ScrollReveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-brand">
                    A ride for every road
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                    Find a car that fits your plans.
                  </h2>
                  <p className="mt-4 text-sm text-muted">
                    A quick city trip or the long way home. Make it yours.
                  </p>
                </div>
                <span className="pb-1 text-xs text-muted">
                  {filtered.length} vehicles to explore
                </span>
              </div>
            </ScrollReveal>
            <div className="my-8 flex flex-wrap items-center justify-between gap-4">
              <CarFilters value={category} onChange={setCategory} />
              <label className="flex items-center gap-2 text-xs text-muted">
                <SlidersHorizontal className="size-3.5" />
                <span className="sr-only">Sort vehicles</span>
                <select
                  aria-label="Sort vehicles"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="max-w-full bg-transparent py-2"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </label>
            </div>
            {(criteria.location || criteria.pickup || savedOnly) && (
              <div className="mb-5 flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-2 text-muted">
                  {savedOnly && <Heart className="size-3.5 text-brand" />}
                  {savedOnly
                    ? "Saved cars"
                    : criteria.location || "All locations"}
                  {criteria.pickup &&
                    ` · ${criteria.pickup} to ${criteria.returnDate}`}
                </span>
                <button
                  onClick={reset}
                  className="flex items-center gap-1 text-brand"
                >
                  Clear filters <X className="size-3" />
                </button>
              </div>
            )}
            <CarListing
              key={listingKey}
              cars={filtered}
              favorites={favorites}
              onFavorite={toggleFavorite}
              onBook={setSelected}
              onReset={reset}
            />
            <p className="text-center text-[10px] text-muted">
              A collection for inspiration. Sample prices in MAD; vehicle photos
              are illustrative.
            </p>
          </div>
        </section>
        <HowItWorks />
        <WhyChooseUs />
      </main>
      <Footer onContact={setInformation} />
      <AnimatePresence>
        {selected && (
          <BookingModal
            car={selected}
            criteria={criteria}
            onClose={closeBooking}
          />
        )}
        {account && <AccountModal onClose={closeAccount} />}
        {information && (
          <Modal title={information} onClose={closeInformation}>
            <div className="p-6">
              <p className="text-sm leading-7 text-muted">
                {info[information] ||
                  `DriveGo's ${information} profile is not connected in this demo. Stay here to explore our collection and plan a sample trip.`}
              </p>
              <button
                onClick={closeInformation}
                className="mt-6 rounded-md bg-brand px-5 py-3 text-sm font-medium text-white"
              >
                Got it
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
