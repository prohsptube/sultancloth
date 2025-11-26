// lib/types.ts
export type ProductType = "UNSTITCHED" | "STITCHED";

export interface Product {
  id: string;
  slug: string;
  name: string;
  type: ProductType; // stitched or unstitched
  fabricType: string; // e.g. "Lawn", "Khaddar", "Wash & Wear", "Boski"
  season?: "Summer" | "Winter" | "AllSeason";
  pricePKR: number;
  gallery?: string[];
  description: string;
  gsm?: number;
  widthInches?: number;
  cutLengthMeters?: number;
  tags: string[]; // e.g. ["men", "unstitched", "wash-and-wear"]
}
