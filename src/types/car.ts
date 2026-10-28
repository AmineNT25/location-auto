export const categories = [
  "All Cars",
  "SUV",
  "Sedan",
  "Luxury",
  "Economy",
  "Electric",
] as const;
export type Category = (typeof categories)[number];
export const locations = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Agadir",
  "Tangier",
] as const;
export interface Car {
  id: number;
  brand: string;
  model: string;
  category: Exclude<Category, "All Cars">;
  location: string;
  seats: number;
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  price: number;
  image: string;
  rating: string;
  trips: number;
  badge?: string;
  unavailable?: [string, string][];
}
export interface SearchCriteria {
  location: string;
  pickup: string;
  returnDate: string;
}
