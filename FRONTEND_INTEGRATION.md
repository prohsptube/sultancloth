# Frontend-to-API Integration Guide

This guide shows how to connect the frontend pages to use the MongoDB API instead of hardcoded data.

## Current State

**Homepage** (`src/app/page.tsx`):
- Currently uses hardcoded `categories` array
- Shows interactive dropdowns with hardcoded items

**Collection Pages** (`src/app/collections/[category]/page.tsx`):
- Currently just placeholders
- Need to fetch and display products

## Integration Steps

### Step 1: Create Categories API (Optional but Recommended)

Currently categories are hardcoded in the frontend. To make them dynamic:

**Create** `src/app/api/categories/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getCategoriesCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";

export async function GET() {
  try {
    const categories = await getCategoriesCollection();
    const allCategories = await categories.find({}).toArray();
    return NextResponse.json(allCategories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const body = await request.json();
    const categories = await getCategoriesCollection();
    
    const result = await categories.insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { _id: result.insertedId, ...body },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
```

### Step 2: Update Homepage to Fetch Products

Update `src/app/page.tsx`:

**Before** (hardcoded):
```tsx
const [expandedCategory, setExpandedCategory] = useState<string | null>("men");
const categories = [
  {
    label: "Men",
    icon: Users,
    description: "Premium collection for men",
    items: [
      { label: "Unstitched", href: "/collections/men" },
      // ... more items
    ],
  },
  // ... more categories
];
```

**After** (API-based):
```tsx
"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("men");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to load categories:", err));

    // Fetch all products
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  // Rest of component...
}
```

### Step 3: Update Collection Pages

Update `src/app/collections/[category]/page.tsx`:

**Before** (placeholder):
```tsx
export default function CollectionPage({ params }: { params: { category: string } }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{params.category}</h1>
      <p>Collection page coming soon...</p>
    </div>
  );
}
```

**After** (dynamic with products):
```tsx
"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useParams } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
}

export default function CollectionPage() {
  const params = useParams();
  const category = params.category as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products for this category
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (p: Product) => p.category.toLowerCase() === category.toLowerCase()
        );
        setProducts(filtered);
      })
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 capitalize mb-2">
          {category}
        </h1>
        <p className="text-gray-600 mb-8">
          {products.length} products available
        </p>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Step 4: Update ProductCard Component

Ensure `src/components/product/ProductCard.tsx` handles the product structure:

```tsx
import Image from "next/image";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    category: string;
    price: number;
    description?: string;
    image?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      <div className="bg-gray-200 h-48 flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {product.description || "No description"}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-red-600">
            Rs. {product.price.toFixed(0)}
          </span>
          <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Step 5: Add to Admin Dashboard

Update admin dashboard to also manage categories:

In `src/app/admin/dashboard/page.tsx`, add a tabs component:

```tsx
const [activeTab, setActiveTab] = useState<"products" | "categories">("products");

return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Tabs */}
    <div className="flex gap-4 mb-8 border-b border-gray-200">
      <button
        onClick={() => setActiveTab("products")}
        className={`px-4 py-2 font-medium ${
          activeTab === "products"
            ? "text-red-600 border-b-2 border-red-600"
            : "text-gray-600"
        }`}
      >
        Products
      </button>
      <button
        onClick={() => setActiveTab("categories")}
        className={`px-4 py-2 font-medium ${
          activeTab === "categories"
            ? "text-red-600 border-b-2 border-red-600"
            : "text-gray-600"
        }`}
      >
        Categories
      </button>
    </div>

    {/* Tab content */}
    {activeTab === "products" && <ProductsTab />}
    {activeTab === "categories" && <CategoriesTab />}
  </div>
);
```

## Testing the Integration

1. **Add sample data via admin**:
   - Go to `/admin/dashboard`
   - Create a few products with category "men", "women", etc.

2. **Check homepage**:
   - Products should appear in category dropdowns
   - Click categories to expand and see products

3. **Check collection pages**:
   - Visit `/collections/men`
   - Should display all products with category "men"

## Data Model Reference

### Product Schema
```json
{
  "_id": "ObjectId",
  "name": "Premium Cotton Kameez",
  "category": "men",
  "price": 3999,
  "description": "Finest cotton fabric, hand-stitched",
  "image": "https://example.com/image.jpg",
  "createdAt": "2025-01-10T12:00:00Z",
  "updatedAt": "2025-01-10T12:00:00Z"
}
```

### Category Schema (Optional)
```json
{
  "_id": "ObjectId",
  "name": "Men",
  "slug": "men",
  "description": "Men's clothing collection",
  "icon": "Users",
  "createdAt": "2025-01-10T12:00:00Z",
  "updatedAt": "2025-01-10T12:00:00Z"
}
```

## Common Issues

**Q: Products not loading?**
A: Check browser console for errors, make sure MongoDB is running, verify MONGODB_URI in .env.local

**Q: API returns 401 Unauthorized?**
A: This only happens on write operations (POST/PUT/DELETE). Make sure you're logged in to admin first.

**Q: Images not showing?**
A: Add image URLs in the admin dashboard (or integrate with Cloudinary/S3 later)

**Q: Category filtering not working?**
A: Make sure product category matches the filter (case-sensitive)

---

**Status**: Ready to implement when MongoDB is configured
**Next**: Set up MongoDB Atlas, then add sample products
