import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
const geist = localFont({
  src: "../../public/geist.woff2",
  variable: "--font-geist",
  display: "swap",
});
export const metadata: Metadata = {
  title: "DriveGo | Your journey starts here",
  description:
    "Find your perfect rental car across Morocco. Explore premium vehicles in Casablanca, Rabat, Marrakech, Agadir and Tangier.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
