// src/lib/types.ts
export type ProductType = "UNSTITCHED" | "STITCHED";

export interface Product {
  id: string;
  slug: string;
  name: string;
  type: ProductType; // stitched or unstitched

  // e.g. "Lawn", "Khaddar", "Wash & Wear", "Boski"
  fabricType: string;

  season?: "Summer" | "Winter" | "AllSeason";

  // Numeric price in PKR
  pricePKR?: number;
  salePricePKR?: number;
  discount?: number;

  gallery?: string[];
  description: string;

  gsm?: number;
  widthInches?: number;
  cutLengthMeters?: number;

  // e.g. ["men", "unstitched", "wash-and-wear"]
  tags: string[];
}
