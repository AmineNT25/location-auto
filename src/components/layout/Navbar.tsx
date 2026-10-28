"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Menu, X, CarFront, Heart } from "lucide-react";
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a
      href="#"
      aria-label="DriveGo home"
      className={`inline-flex items-center gap-2 text-2xl font-bold ${light ? "text-white" : "text-ink"}`}
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-brand text-white">
        <CarFront className="size-6" strokeWidth={2.2} />
      </span>
      Drive<span className="-ml-2 text-brand">Go</span>
      <span className="text-brand">.</span>
    </a>
  );
}
export default function Navbar({
  onAccount,
  onFavorites,
  favorites,
  savedOnly,
}: {
  onAccount: () => void;
  onFavorites: () => void;
  favorites: number;
  savedOnly: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["Explore Cars", "#cars"],
    ["How It Works", "#how-it-works"],
    ["About Us", "#about"],
  ];
  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-lg transition-shadow ${scrolled ? "shadow-sm" : ""}`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8"
      >
        <Logo />
        <div className="hidden items-center gap-9 text-sm font-medium md:flex">
          {links.map(([text, href]) => (
            <a
              className="transition-colors hover:text-brand"
              key={href}
              href={href}
            >
              {text}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onFavorites}
            aria-label={`Favorites, ${favorites} saved vehicles`}
            aria-pressed={savedOnly}
            title="Saved cars"
            className={`relative rounded-md p-2 ${savedOnly ? "bg-brand/10 text-brand" : "hover:bg-paper"}`}
          >
            <Heart className={`size-5 ${savedOnly ? "fill-brand" : ""}`} />
            {favorites > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-brand text-[10px] text-white">
                {favorites}
              </span>
            )}
          </button>
          <button
            onClick={onAccount}
            className="hidden items-center gap-3 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand/90 sm:flex"
          >
            Login / Sign Up <ArrowUpRight className="size-4" />
          </button>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
            className="p-2 md:hidden"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100 bg-white md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {links.map(([text, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="rounded-md p-3 hover:bg-paper"
                >
                  {text}
                </a>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  onAccount();
                }}
                className="rounded-md bg-brand p-3 text-white sm:hidden"
              >
                Login / Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
