# DriveGo

A responsive Moroccan car-rental frontend built with Next.js App Router, TypeScript, Tailwind CSS 4, Motion, and Lucide.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. On PowerShell systems with script restrictions, use `npm.cmd`.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
```

## Features

- Location, category, availability, favorite, and price filters
- Local-storage favorites with a session fallback
- IntersectionObserver progressive loading with simulated asynchronous batches and skeletons
- Responsive navigation, lazy optimized images, staggered reveal animations, and reduced-motion support
- Accessible booking dialogs with focus trapping, Escape dismissal, date validation, and MAD totals
- Explicit demo-only booking and account flows; no backend or payments

Sample inventory is in `src/data/cars.ts`. A sample blocked period is set for vehicle 9 from December 20 to December 27, 2026. Availability uses non-overlapping pickup/return intervals. Rentals have a minimum duration of one day. Sample ratings and trip counts are illustrative. Photography is illustrative and sourced from Unsplash; production inventory should use verified photographs of each actual rental vehicle.

Photo attribution and licenses are available in `public/image-credits.html` and through the footer. The locally served Geist font is distributed under the SIL Open Font License.

Run the calendar and availability checks with `node --experimental-strip-types --test tests/rental.test.mjs` (Node 22.6+).

No secrets or environment variables are required.
