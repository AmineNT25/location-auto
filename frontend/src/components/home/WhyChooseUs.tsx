import {
  Wallet,
  BadgeCheck,
  MousePointer2,
  Headphones,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
const benefits = [
  {
    icon: Wallet,
    title: "Fair prices. More possibilities.",
    text: "Great cars at prices that leave room for the journey.",
  },
  {
    icon: BadgeCheck,
    title: "A car for every kind of trip.",
    text: "Everyday favorites and premium rides, all in one place.",
  },
  {
    icon: MousePointer2,
    title: "Booking made beautifully simple.",
    text: "Pick your dates, find your fit, and get on your way.",
  },
  {
    icon: Headphones,
    title: "Here for you, around the clock.",
    text: "Our vision: helpful, human support, whenever you need it.",
  },
];
export default function WhyChooseUs() {
  return (
    <>
      <section
        id="about"
        className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20"
      >
        <ScrollReveal className="relative min-h-[360px] overflow-hidden rounded-lg">
          <Image
            src="/images/hero.jpg"
            alt="A silver sports car ready for an open-road adventure"
            fill
            sizes="(max-width:1023px) 100vw, 50vw"
            className="object-cover object-[65%_center]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-7 left-7 right-7 text-white">
            <p className="text-xs uppercase text-white/70">
              More than a car rental
            </p>
            <p className="mt-2 text-3xl font-medium">
              A good trip starts
              <br />
              with a great ride.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase text-brand">
            The DriveGo difference
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Built around your journey.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted">
            Big plans or no plans at all. We believe getting there should be the
            easy part.
          </p>
          <div className="mt-8 space-y-6">
            {benefits.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand/7 text-brand">
                  <Icon className="size-5" strokeWidth={1.6} />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
      <section className="bg-brand px-5 py-14 text-white sm:px-8">
        <ScrollReveal className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 sm:flex-row sm:items-center">
          <div>
            <p className="mb-3 text-xs font-medium text-white/70">
              NEW ROADS. NEW MEMORIES.
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Ready for Your Next Adventure?
            </h2>
            <p className="mt-3 text-sm text-white/75">
              Your perfect ride is closer than you think.
            </p>
          </div>
          <a
            href="#cars"
            className="flex shrink-0 items-center gap-7 rounded-md bg-white px-6 py-4 text-sm font-semibold text-brand transition-transform hover:-translate-y-1"
          >
            Explore Cars <ArrowUpRight className="size-4" />
          </a>
        </ScrollReveal>
      </section>
    </>
  );
}
