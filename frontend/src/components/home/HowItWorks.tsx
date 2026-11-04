import { CarFront, CalendarDays, KeyRound, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
const steps = [
  {
    icon: CarFront,
    title: "Choose your car",
    text: "From city essentials to weekend upgrades. Find the car that feels like you.",
  },
  {
    icon: CalendarDays,
    title: "Select your dates",
    text: "A spontaneous escape or a planned adventure. Make room for your next trip.",
  },
  {
    icon: KeyRound,
    title: "Book & drive",
    text: "A few simple steps, and you're on your way. The open road is waiting.",
  },
];
export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-gray-100 bg-paper/70 py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <ScrollReveal className="text-center">
          <p className="text-xs font-semibold uppercase text-brand">
            Less planning. More exploring.
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Your next trip, in three simple steps.
          </h2>
          <p className="mt-4 text-sm text-muted">
            From finding your favorite to finding your freedom.
          </p>
        </ScrollReveal>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <ScrollReveal
              key={title}
              delay={i * 0.12}
              className="relative text-center"
            >
              <div className="relative mx-auto flex size-16 items-center justify-center rounded-lg border border-brand/10 bg-white text-brand shadow-sm">
                <Icon className="size-7" strokeWidth={1.5} />
                <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-brand text-[10px] font-semibold text-white">
                  0{i + 1}
                </span>
              </div>
              {i < 2 && (
                <ArrowRight className="absolute right-0 top-5 hidden size-5 translate-x-7 text-brand/30 md:block" />
              )}
              <h3 className="mt-6 text-lg font-semibold">{title}</h3>
              <p className="mx-auto mt-3 max-w-[270px] text-sm leading-6 text-muted">
                {text}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
