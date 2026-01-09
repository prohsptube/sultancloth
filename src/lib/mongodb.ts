// lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    console.log("[MongoDB] Using cached connection");
    return { client: cachedClient, db: cachedDb };
  }

  const mongoUri = process.env.MONGODB_URI;
  console.log("[MongoDB] MONGODB_URI exists:", !!mongoUri);
  console.log("[MongoDB] MONGODB_URI preview:", mongoUri ? mongoUri.substring(0, 20) + "..." : "undefined");
  
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const client = new MongoClient(mongoUri);

  try {
    console.log("[MongoDB] Attempting to connect...");
    await client.connect();
    const db = client.db("sultancloth");

    cachedClient = client;
    cachedDb = db;

    console.log("[MongoDB] Connected successfully to database: sultancloth");
    return { client, db };
  } catch (error) {
    console.error("[MongoDB] Connection error:", error);
    throw error;
  }
}

export async function getProductsCollection() {
  const { db } = await connectToDatabase();
  return db.collection("products");
}

export async function getCategoriesCollection() {
  const { db } = await connectToDatabase();
  return db.collection("categories");
}

export async function getHeroSlidesCollection() {
  const { db } = await connectToDatabase();
  return db.collection("hero_slides");
}
