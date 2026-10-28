import {
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { Logo } from "./Navbar";
export default function Footer({
  onContact,
}: {
  onContact: (title: string) => void;
}) {
  return (
    <footer className="bg-[#111527] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-[2fr_1fr_1fr_1.3fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-[260px] text-sm leading-6 text-white/50">
            Good cars. Great journeys.
            <br />
            Discover Morocco, your way.
          </p>
          <div className="mt-5 flex gap-2">
            {[
              { Icon: Instagram, name: "Instagram" },
              { Icon: Facebook, name: "Facebook" },
              { Icon: Linkedin, name: "LinkedIn" },
            ].map(({ Icon, name }) => (
              <button
                onClick={() => onContact(name)}
                key={name}
                title={name}
                aria-label={name}
                className="rounded-md border border-white/15 p-2 text-white/60 hover:border-white/40 hover:text-white"
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Explore</h3>
          <div className="mt-5 flex flex-col gap-3 text-xs text-white/50">
            <a href="#cars" className="hover:text-white">
              Find a car
            </a>
            <a href="#how-it-works" className="hover:text-white">
              How it works
            </a>
            <a href="#about" className="hover:text-white">
              About DriveGo
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Good to know</h3>
          <div className="mt-5 flex flex-col items-start gap-3 text-xs text-white/50">
            {["Help & support", "Rental information", "Privacy policy"].map(
              (label) => (
                <button
                  onClick={() => onContact(label)}
                  key={label}
                  className="hover:text-white"
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Let&apos;s talk</h3>
          <p className="mt-5 flex items-center gap-2 text-xs text-white/50">
            <Mail className="size-3.5" /> hello@drivego.example
          </p>
          <p className="mt-3 flex items-center gap-2 text-xs text-white/50">
            <MapPin className="size-3.5" /> Casablanca, Morocco
          </p>
          <button
            onClick={() => onContact("Help & support")}
            className="mt-5 flex items-center gap-3 text-xs text-white/80"
          >
            Get in touch <ArrowUpRight className="size-3" />
          </button>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 border-t border-white/10 px-5 py-6 text-[10px] text-white/40 sm:px-8">
        <p>Copyright &copy; 2026 DriveGo. All rights reserved.</p>
        <a href="/image-credits.html" className="hover:text-white">Image credits</a>
        <p>Frontend demo · Sample vehicles and prices · Made for the journey</p>
      </div>
    </footer>
  );
}
