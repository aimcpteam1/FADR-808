import productsData from "@/data/products.json";

export const GENRES = ["House", "EDM", "Techno", "Trance", "DnB", "Garage"] as const;

export const COLORS = [
  { name: "Red",    hex: "#c0392b" },
  { name: "Orange", hex: "#d6781e" },
  { name: "Yellow", hex: "#e4d31e" },
  { name: "Green",  hex: "#5f966e" },
  { name: "Blue",   hex: "#2980b9" },
  { name: "Purple", hex: "#8e44ad" },
  { name: "Pink",   hex: "#e85a96" },
  { name: "White",  hex: "#e8e8e8" },
  { name: "Mono",   hex: "#3c3c3c" },
] as const;

export type Genre = (typeof GENRES)[number];
export type ColorName = (typeof COLORS)[number]["name"];

export interface Product {
  id: string;
  name: string;
  genre: Genre;
  color: ColorName;
  colorHex: string;
  image: string;
}

export const PRODUCTS = productsData as Product[];

/**
 * Find the product that best matches a genre + color selection.
 * Genre is weighted higher than color; ties resolve to the lowest id.
 * Always returns a product (never null) — the "closest" one.
 */
export function findBestProduct(genre: Genre, color: ColorName): Product {
  let best = PRODUCTS[0];
  let bestScore = -1;

  for (const p of PRODUCTS) {
    const score = (p.genre === genre ? 2 : 0) + (p.color === color ? 1 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best;
}
