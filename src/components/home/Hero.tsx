"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Star, ArrowDown } from "lucide-react";
export default function Hero() {
  return (
    <section className="relative isolate min-h-[520px] overflow-hidden bg-ink pb-20 pt-10 text-white sm:min-h-[550px] sm:pt-14">
      <motion.div
        initial={{ x: 35, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 -z-20"
      >
        <Image
          src="/images/hero.jpg"
          alt="Porsche Panamera driving along an open highway"
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[62%_55%]"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#101423]/95 via-[#101423]/70 to-[#101423]/10" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-xs font-medium text-white/90">
            <span className="size-1.5 rounded-full bg-[#b0aaff]" /> A better way
            to explore Morocco <ArrowUpRight className="size-3.5" />
          </div>
          <h1 className="max-w-[700px] text-[40px] font-semibold leading-[1.12] sm:text-[60px] lg:text-[64px]">
            Find Your Perfect
            <br />
            Ride, <span className="text-[#aaa4ff]">Anywhere.</span>
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mt-6 max-w-[370px] text-sm leading-7 text-white/75 sm:text-base"
        >
          Explore premium vehicles at unbeatable prices.
          <br className="hidden sm:block" /> Book in minutes, drive with
          confidence.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="mt-7 flex flex-wrap items-center gap-6"
        >
          <motion.a
            whileHover={{ y: -3 }}
            href="#cars"
            className="inline-flex items-center gap-7 rounded-md bg-brand px-6 py-3.5 text-sm font-semibold"
          >
            Explore Cars <ArrowUpRight className="size-4" />
          </motion.a>
          <div className="flex items-center gap-2 text-xs text-white/80">
            <span className="flex gap-0.5 text-[#edc371]">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-3 fill-current" />
              ))}
            </span>
            <span>Made for the journey</span>
          </div>
        </motion.div>
        <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/70">
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5 text-[#b9b5ff]" /> No hidden fees
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5 text-[#b9b5ff]" /> Flexible dates
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5 text-[#b9b5ff]" /> Your road, your rules
          </span>
        </div>
      </div>
      <div className="absolute bottom-24 right-8 hidden items-center gap-3 text-xs text-white/70 lg:flex">
        A little freedom goes a long way <ArrowDown className="size-4" />
      </div>
    </section>
  );
}
