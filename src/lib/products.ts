// lib/products.ts
import { Product } from "./types";

export const products: Product[] = [
  // UNSTITCHED FABRICS
  {
    id: "u1",
    slug: "royal-wash-and-wear-charcoal",
    name: "Royal Wash & Wear – Charcoal Grey",
    type: "UNSTITCHED",
    fabricType: "Wash & Wear",
    season: "AllSeason",
    pricePKR: 3800,
    description:
      "Four-piece unstitched premium Wash & Wear fabric in charcoal grey. Soft fall, wrinkle-resistant and perfect for formal shalwar kameez.",
    gsm: 110,
    widthInches: 56,
    cutLengthMeters: 4.5,
    tags: ["men", "unstitched", "wash-and-wear", "formal"],
  },
  {
    id: "u2",
    slug: "summer-lawn-3piece-ice-blue",
    name: "Summer Lawn 3-Piece – Ice Blue",
    type: "UNSTITCHED",
    fabricType: "Lawn",
    season: "Summer",
    pricePKR: 5200,
    description:
      "Printed lawn 3-piece suit in ice blue with dupatta and trouser fabric. Lightweight and breathable for high temperatures.",
    gsm: 90,
    widthInches: 54,
    cutLengthMeters: 4.0,
    tags: ["women", "unstitched", "lawn", "summer"],
  },

  // STITCHED
  {
    id: "s1",
    slug: "men-kurta-wash-and-wear-stone",
    name: "Men’s Kurta – Wash & Wear Stone Grey",
    type: "STITCHED",
    fabricType: "Wash & Wear",
    season: "AllSeason",
    pricePKR: 6500,
    description:
      "Ready-to-wear men’s kurta stitched from Sultan Wash & Wear in stone grey. Slim fit with detailed cuff and band collar.",
    tags: ["men", "stitched", "kurta", "wash-and-wear"],
  },
  {
    id: "s2",
    slug: "women-stitched-3piece-khaddar-maroon",
    name: "Women’s Stitched 3-Piece – Khaddar Maroon",
    type: "STITCHED",
    fabricType: "Khaddar",
    season: "Winter",
    pricePKR: 8200,
    description:
      "Stitched winter 3-piece set in maroon khaddar with embroidered neckline and straight trouser.",
    tags: ["women", "stitched", "khaddar", "winter"],
  },
];
