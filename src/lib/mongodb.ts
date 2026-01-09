// lib/mongodb.ts
import { MongoClient, Db } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db("sultancloth");

    cachedClient = client;
    cachedDb = db;

    console.log("Connected to MongoDB");
    return { client, db };
  } catch (error) {
    console.error("MongoDB connection error:", error);
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
