// app/admin/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit, Plus, LogOut } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  discount?: number;
  description?: string;
  image?: string;
  sku?: string;
  quantity?: number;
  sizes?: string[]; // e.g., ["XS", "S", "M", "L", "XL", "XXL"]
  sizeChart?: string; // URL to size chart image
  isFeatured?: boolean;
  stockQuantity?: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
}

interface HeroSlide {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  order?: number;
  isActive?: boolean;
}

interface NavSubItem {
  label: string;
  href: string;
}

interface NavCategory {
  label: string;
  href: string;
  subItems?: NavSubItem[];
}

interface NavigationItem {
  _id: string;
  label: string;
  href: string;
  level: number;
  order: number;
  parentId?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: {
    productId?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  paymentStatus: "unpaid" | "paid";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  expiryDate?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: any[];
    paymentStatus: string;
  }[];
}

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  activeCoupons: number;
  ordersByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  recentOrders: any[];
  topProducts: any[];
  lowStockCount: number;
  outOfStockCount: number;
  salesByDay: { date: string; orders: number; revenue: number }[];
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "categories" | "hero" | "navigation" | "orders" | "coupons" | "customers" | "reviews" | "inventory" | "reports" | "shipping" | "settings">("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(false);
  const [navLoading, setNavLoading] = useState(false);
  const [error, setError] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [showNavForm, setShowNavForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingHeroId, setEditingHeroId] = useState<string | null>(null);
  const [editingNavId, setEditingNavId] = useState<string | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: "",
    category: "men",
    price: "",
    salePrice: "",
    discount: "",
    description: "",
    image: "",
    sku: "",
    quantity: "",
    sizes: [] as string[],
    sizeChart: "",
    isFeatured: false,
    stockQuantity: "",
  });
  const [selectedLevel1, setSelectedLevel1] = useState("");
  const [selectedLevel2, setSelectedLevel2] = useState("");
  const [selectedLevel3, setSelectedLevel3] = useState("");
  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: null as string | null,
  });
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [heroFormData, setHeroFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    ctaLabel: "",
    ctaHref: "/collections",
    order: 0,
    isActive: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [navFormData, setNavFormData] = useState({
    label: "",
    href: "",
    level: 1,
    parentId: null as string | null,
  });
  const [couponFormData, setCouponFormData] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minOrderValue: "",
    maxDiscount: "",
    usageLimit: "",
    expiryDate: "",
    isActive: true,
  });
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAnalytics();
    fetchProducts();
    fetchCategories();
    fetchHeroSlides();
    fetchNavigation();
    fetchOrders();
    fetchCoupons();
    fetchCustomers();
    fetchReviews();
    fetchInventory();
    fetchReports();
    fetchShipping();
    fetchSettings();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Error loading products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const fetchHeroSlides = async () => {
    try {
      setHeroLoading(true);
      const res = await fetch("/api/hero-slides");
      if (!res.ok) throw new Error("Failed to fetch hero slides");
      const data = await res.json();
      setHeroSlides(data);
    } catch (err) {
      console.error("Error loading hero slides:", err);
    } finally {
      setHeroLoading(false);
    }
  };

  const fetchNavigation = async () => {
    try {
      setNavLoading(true);
      const res = await fetch("/api/navigation?raw=1");
      if (!res.ok) throw new Error("Failed to fetch navigation");
      const data = await res.json();
      setNavigationItems(data);
    } catch (err) {
      console.error("Error loading navigation:", err);
    } finally {
      setNavLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      setCouponsLoading(true);
      const res = await fetch("/api/coupons", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch coupons");
      const data = await res.json();
      setCoupons(data);
    } catch (err) {
      console.error("Error loading coupons:", err);
    } finally {
      setCouponsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Error loading analytics:", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Error loading customers:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews?all=true", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Error loading reviews:", err);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error("Error loading inventory:", err);
    }
  };

  const fetchReports = async (startDate?: string, endDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      const res = await fetch(`/api/reports?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error("Error loading reports:", err);
    }
  };

  const fetchShipping = async () => {
    try {
      const res = await fetch("/api/shipping", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch shipping methods");
      const data = await res.json();
      setShippingMethods(data);
    } catch (err) {
      console.error("Error loading shipping methods:", err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error("Error loading settings:", err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings");
      }
    } catch (err) {
      alert("Error saving settings");
    }
  };

  const handleAddNavigation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!navFormData.label || !navFormData.href) {
      setError("Label and href are required");
      return;
    }

    try {
      const method = editingNavId ? "PUT" : "POST";
      const url = editingNavId
        ? `/api/navigation/${editingNavId}`
        : "/api/navigation";

      const payload = {
        label: navFormData.label,
        href: navFormData.href,
        level: navFormData.level,
        parentId: navFormData.parentId,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setNavFormData({ label: "", href: "", level: 1, parentId: null });
        setEditingNavId(null);
        setShowNavForm(false);
        await fetchNavigation();
      } else {
        const data = await response.json();
        setError(data.error || "Error saving navigation");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving navigation");
    }
  };

  const handleEditNavigation = (item: NavigationItem) => {
    setEditingNavId(item._id);
    setNavFormData({
      label: item.label,
      href: item.href,
      level: item.level,
      parentId: item.parentId || null,
    });
    setShowNavForm(true);
  };

  const handleDeleteNavigation = async (id: string) => {
    if (!confirm("Delete this navigation item and all its children?")) return;

    try {
      const response = await fetch(`/api/navigation/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Deleted ${data.deletedCount} items`);
        await fetchNavigation(); // Refresh the entire list
      } else {
        const error = await response.json();
        setError("Error deleting navigation item: " + (error.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Error deleting navigation item: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleCancelNavForm = () => {
    setShowNavForm(false);
    setEditingNavId(null);
    setNavFormData({ label: "", href: "", level: 1, parentId: null });
  };

  // COUPON HANDLERS
  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!couponFormData.code || !couponFormData.discountValue) {
      setError("Code and discount value are required");
      return;
    }

    try {
      const method = editingCouponId ? "PUT" : "POST";
      const url = editingCouponId ? `/api/coupons/${editingCouponId}` : "/api/coupons";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(couponFormData),
      });

      if (response.ok) {
        setCouponFormData({
          code: "",
          discountType: "percentage",
          discountValue: "",
          minOrderValue: "",
          maxDiscount: "",
          usageLimit: "",
          expiryDate: "",
          isActive: true,
        });
        setEditingCouponId(null);
        setShowCouponForm(false);
        await fetchCoupons();
      } else {
        const data = await response.json();
        setError(data.error || "Error saving coupon");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving coupon");
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCouponId(coupon._id);
    setCouponFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minOrderValue: coupon.minOrderValue.toString(),
      maxDiscount: coupon.maxDiscount?.toString() || "",
      usageLimit: coupon.usageLimit?.toString() || "",
      expiryDate: coupon.expiryDate ? coupon.expiryDate.split("T")[0] : "",
      isActive: coupon.isActive,
    });
    setShowCouponForm(true);
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;

    try {
      const response = await fetch(`/api/coupons/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchCoupons();
      } else {
        setError("Error deleting coupon");
      }
    } catch (err) {
      setError("Error deleting coupon");
    }
  };

  const handleCancelCouponForm = () => {
    setShowCouponForm(false);
    setEditingCouponId(null);
    setCouponFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrderValue: "",
      maxDiscount: "",
      usageLimit: "",
      expiryDate: "",
      isActive: true,
    });
  };

  // ORDER HANDLERS
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchOrders();
        await fetchAnalytics(); // Refresh dashboard analytics
        await fetchCustomers(); // Refresh customer data
      } else {
        setError("Error updating order status");
      }
    } catch (err) {
      setError("Error updating order status");
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Delete this order?")) return;

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchOrders();
        await fetchAnalytics(); // Refresh dashboard analytics
        await fetchCustomers(); // Refresh customer data
      } else {
        setError("Error deleting order");
      }
    } catch (err) {
      setError("Error deleting order");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  // PRODUCT HANDLERS
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Use deepest selected category slug
    const level3 = categories.find((c) => c._id === selectedLevel3);
    const level2 = categories.find((c) => c._id === selectedLevel2);
    const level1 = categories.find((c) => c._id === selectedLevel1);
    const categoryToUse = level3?.slug || level2?.slug || level1?.slug;

    if (!productFormData.name || !productFormData.price || !categoryToUse) {
      setError("Name, price, and category are required");
      return;
    }

    try {
      const method = editingProductId ? "PUT" : "POST";
      const url = editingProductId
        ? `/api/products/${editingProductId}`
        : "/api/products";

      const payload = {
        ...productFormData,
        category: categoryToUse,
        price: parseFloat(productFormData.price),
        salePrice: productFormData.salePrice ? parseFloat(productFormData.salePrice) : undefined,
        discount: productFormData.discount ? parseFloat(productFormData.discount) : undefined,
        image: productFormData.image || undefined,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setProductFormData({ 
          name: "", 
          category: "men", 
          price: "", 
          salePrice: "", 
          discount: "", 
          description: "", 
          image: "", 
          sku: "", 
          quantity: "", 
          sizes: [], 
          sizeChart: "",
          isFeatured: false,
          stockQuantity: "",
        });
        setEditingProductId(null);
        setShowProductForm(false);
        setSelectedMainCategory("");
        setSelectedSubCategory("");
        setSelectedLevel1("");
        setSelectedLevel2("");
        setSelectedLevel3("");
        setProductImagePreview(null);
        await fetchProducts();
        await fetchInventory(); // Refresh inventory stats
        await fetchAnalytics(); // Refresh dashboard analytics
      } else {
        const data = await response.json();
        setError(data.error || "Error saving product");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving product");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product._id);
    setProductFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      salePrice: product.salePrice?.toString() || "",
      discount: product.discount?.toString() || "",
      description: product.description || "",
      image: product.image || "",
      sku: product.sku || "",
      quantity: product.quantity?.toString() || "",
      sizes: product.sizes || [],
      sizeChart: product.sizeChart || "",
      isFeatured: product.isFeatured || false,
      stockQuantity: product.stockQuantity?.toString() || product.quantity?.toString() || "",
    });
    setProductImagePreview(product.image || null);
    // Preselect category hierarchy based on slug
    const cat = categories.find((c) => c.slug === product.category);
    if (cat) {
      const parent = categories.find((c) => c._id === cat.parentId);
      const grand = parent ? categories.find((c) => c._id === parent.parentId) : null;
      setSelectedLevel3(cat._id);
      setSelectedLevel2(parent?._id || "");
      setSelectedLevel1(grand?._id || parent?._id || "");
    }
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== id));
        await fetchInventory(); // Refresh inventory stats
        await fetchAnalytics(); // Refresh dashboard analytics
      } else {
        setError("Error deleting product");
      }
    } catch (err) {
      setError("Error deleting product");
    }
  };

  const handleCancelProductForm = () => {
    setShowProductForm(false);
    setEditingProductId(null);
    setProductFormData({ 
      name: "", 
      category: "men", 
      price: "", 
      salePrice: "", 
      discount: "", 
      description: "", 
      image: "", 
      sku: "", 
      quantity: "", 
      sizes: [], 
      sizeChart: "",
      isFeatured: false,
      stockQuantity: "",
    });
    setProductImagePreview(null);
  };

  // PRODUCT IMAGE UPLOAD
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setUploadingProductImage(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/hero", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProductFormData({ ...productFormData, image: data.url });
        setProductImagePreview(data.url);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to upload image");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingProductImage(false);
    }
  };

  // HERO SLIDE HANDLERS
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/hero", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setHeroFormData({ ...heroFormData, image: data.url });
        setImagePreview(data.url);
        console.log("Image uploaded:", data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to upload image");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!heroFormData.title || !heroFormData.image || !heroFormData.ctaLabel || !heroFormData.ctaHref) {
      setError("Title, image, CTA label, and CTA link are required");
      return;
    }

    try {
      const method = editingHeroId ? "PUT" : "POST";
      const url = editingHeroId
        ? `/api/hero-slides/${editingHeroId}`
        : "/api/hero-slides";

      const payload = {
        ...heroFormData,
        order: Number(heroFormData.order) || 0,
        isActive: heroFormData.isActive,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setHeroFormData({
          title: "",
          subtitle: "",
          image: "",
          ctaLabel: "",
          ctaHref: "/collections",
          order: 0,
          isActive: true,
        });
        setEditingHeroId(null);
        setShowHeroForm(false);
        await fetchHeroSlides();
      } else {
        const data = await response.json();
        setError(data.error || "Error saving hero slide");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving hero slide");
    }
  };

  const handleEditHeroSlide = (slide: HeroSlide) => {
    setEditingHeroId(slide._id);
    setHeroFormData({
      title: slide.title,
      subtitle: slide.subtitle || "",
      image: slide.image,
      ctaLabel: slide.ctaLabel,
      ctaHref: slide.ctaHref,
      order: slide.order ?? 0,
      isActive: slide.isActive !== false,
    });
    setImagePreview(slide.image);
    setShowHeroForm(true);
  };

  const handleDeleteHeroSlide = async (id: string) => {
    if (!confirm("Delete this hero slide?")) return;

    try {
      const response = await fetch(`/api/hero-slides/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setHeroSlides(heroSlides.filter((s) => s._id !== id));
      } else {
        setError("Error deleting hero slide");
      }
    } catch (err) {
      setError("Error deleting hero slide");
    }
  };

  const handleCancelHeroForm = () => {
    setShowHeroForm(false);
    setEditingHeroId(null);
    setHeroFormData({
      title: "",
      subtitle: "",
      image: "",
      ctaLabel: "",
      ctaHref: "/collections",
      order: 0,
      isActive: true,
    });
    setImagePreview(null);
  };

  // CATEGORY HANDLERS
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!categoryFormData.name || !categoryFormData.slug) {
      setError("Name and slug are required");
      return;
    }

    try {
      const method = editingCategoryId ? "PUT" : "POST";
      const url = editingCategoryId
        ? `/api/categories/${editingCategoryId}`
        : "/api/categories";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(categoryFormData),
      });

      if (response.ok) {
        setCategoryFormData({ name: "", slug: "", description: "", parentId: null });
        setEditingCategoryId(null);
        setShowCategoryForm(false);
        setSelectedMainCategory("");
        setSelectedSubCategory("");
        await fetchCategories();
      } else {
        const data = await response.json();
        setError(data.error || "Error saving category");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving category");
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category._id);
    setCategoryFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
       parentId: category.parentId || null,
     });
     if (category.parentId) {
       setSelectedMainCategory(category.parentId);
     }
     setShowCategoryForm(true);
   };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setCategories(categories.filter((c) => c._id !== id));
      } else {
        setError("Error deleting category");
      }
    } catch (err) {
      setError("Error deleting category");
    }
  };

  const handleCancelCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategoryId(null);
    setCategoryFormData({ name: "", slug: "", description: "", parentId: null });
    setSelectedMainCategory("");
    setSelectedSubCategory("");
  };

  // Get main categories (those without parentId)
  const mainCategories = categories.filter((cat) => !cat.parentId);

  // Get subcategories for selected main category
  const subCategories = selectedMainCategory
    ? categories.filter((cat) => cat.parentId === selectedMainCategory)
    : [];

  // Level2 and Level3 helpers for product form
  const level2Cats = selectedLevel1
    ? categories.filter((cat) => cat.parentId === selectedLevel1)
    : [];
  const level3Cats = selectedLevel2
    ? categories.filter((cat) => cat.parentId === selectedLevel2)
    : [];

  const getCategoryLabel = (cat: Category): string => {
    const parent = categories.find((c) => c._id === cat.parentId);
    const grandParent = parent ? categories.find((c) => c._id === parent.parentId) : null;
    const parts = [grandParent?.name, parent?.name, cat.name].filter(Boolean);
    return parts.join(" / ");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 justify-center">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-2 font-medium transition text-sm ${
              activeTab === "dashboard"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-3 py-2 font-medium transition text-sm ${
              activeTab === "products"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("hero")}
            className={`px-3 py-2 font-medium transition text-sm ${
              activeTab === "hero"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Hero Slides
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-3 py-2 font-medium transition text-sm ${
              activeTab === "categories"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("navigation")}
            className={`px-3 py-2 font-medium transition text-sm ${
              activeTab === "navigation"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Navigation
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3 py-2 font-medium transition text-sm ${
              activeTab === "orders"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`px-3 py-2 font-medium transition text-sm ${
              activeTab === "coupons"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Coupons
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            className={`px-3 py-2 font-medium transition text-sm ${
              activeTab === "customers"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-3 py-2 font-medium transition text-sm ${
              activeTab === "reviews"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-3 py-2 font-medium transition text-sm ${
              activeTab === "inventory"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-3 py-2 font-medium transition text-sm ${
              activeTab === "reports"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-3 py-2 font-medium transition text-sm ${
              activeTab === "shipping"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Shipping
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3 py-2 font-medium transition text-sm ${
              activeTab === "settings"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Settings
          </button>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                    <h3 className="text-3xl font-bold mt-1">Rs. {analytics?.totalRevenue.toLocaleString() || 0}</h3>
                  </div>
                  <div className="bg-blue-400/30 rounded-full p-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Orders</p>
                    <h3 className="text-3xl font-bold mt-1">{analytics?.totalOrders || 0}</h3>
                  </div>
                  <div className="bg-green-400/30 rounded-full p-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Products</p>
                    <h3 className="text-3xl font-bold mt-1">{products.length}</h3>
                  </div>
                  <div className="bg-purple-400/30 rounded-full p-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Active Coupons</p>
                    <h3 className="text-3xl font-bold mt-1">{coupons.filter(c => c.isActive).length}</h3>
                  </div>
                  <div className="bg-orange-400/30 rounded-full p-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Status</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{analytics?.ordersByStatus.pending || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{analytics?.ordersByStatus.processing || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Processing</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{analytics?.ordersByStatus.shipped || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Shipped</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{analytics?.ordersByStatus.delivered || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{analytics?.ordersByStatus.cancelled || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Cancelled</div>
                </div>
              </div>
            </div>

            {/* Sales Trend */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">7-Day Sales Trend</h2>
              <div className="overflow-x-auto">
                <div className="flex items-end justify-between h-64 gap-2">
                  {analytics?.salesByDay.map((day, index) => {
                    const maxRevenue = Math.max(...(analytics?.salesByDay.map(d => d.revenue) || [1]));
                    const height = (day.revenue / maxRevenue) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="text-sm font-semibold text-gray-700 mb-1">Rs. {day.revenue.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 mb-1">{day.orders} orders</div>
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                          style={{ height: `${height}%`, minHeight: '20px' }}
                        ></div>
                        <div className="text-xs text-gray-600 mt-2">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
                <div className="space-y-3">
                  {analytics?.recentOrders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">Rs. {order.totalAmount.toLocaleString()}</div>
                        <div className={`text-xs font-medium ${
                          order.status === 'delivered' ? 'text-green-600' :
                          order.status === 'shipped' ? 'text-purple-600' :
                          order.status === 'processing' ? 'text-blue-600' :
                          order.status === 'cancelled' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>{order.status.toUpperCase()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Top Selling Products</h2>
                <div className="space-y-3">
                  {analytics?.topProducts.map((product, index) => (
                    <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{product.name}</div>
                          <div className="text-sm text-gray-500">Rs. {product.price.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">{product.totalSold} sold</div>
                        <div className="text-xs text-gray-500">Rs. {product.totalRevenue.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stock Alerts */}
            {((analytics?.lowStockCount || 0) > 0 || (analytics?.outOfStockCount || 0) > 0) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Stock Alerts</h2>
                <div className="flex gap-4">
                  {(analytics?.lowStockCount || 0) > 0 && (
                    <div className="flex-1 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <div className="font-bold text-yellow-800">{analytics?.lowStockCount} Products Low Stock</div>
                          <div className="text-sm text-yellow-700">Less than 10 items remaining</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {(analytics?.outOfStockCount || 0) > 0 && (
                    <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div>
                          <div className="font-bold text-red-800">{analytics?.outOfStockCount} Products Out of Stock</div>
                          <div className="text-sm text-red-700">Requires immediate attention</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === "customers" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
              <div className="text-sm text-gray-500">Total Customers: {customers.length}</div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.sort((a, b) => b.totalSpent - a.totalSpent).map((customer) => (
                    <React.Fragment key={customer.email}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{customer.email}</div>
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{customer.totalOrders}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-600">Rs. {customer.totalSpent.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(customer.lastOrderDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => {
                              const expandedRow = document.getElementById(`customer-orders-${customer.email}`);
                              if (expandedRow) {
                                expandedRow.style.display = expandedRow.style.display === 'none' ? 'table-row' : 'none';
                              }
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Orders
                          </button>
                        </td>
                      </tr>
                      <tr id={`customer-orders-${customer.email}`} style={{ display: 'none' }}>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="text-sm font-bold text-gray-700 mb-3">Order History</div>
                          <div className="space-y-2">
                            {customer.orders.map((order) => (
                              <div key={order._id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                                <div className="flex-1">
                                  <div className="flex items-center gap-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      Order #{order.orderNumber || order._id.slice(-8)}
                                    </div>
                                    <div className={`text-xs font-medium px-2 py-1 rounded ${
                                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {order.status.toUpperCase()}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-gray-900">Rs. {order.totalAmount.toLocaleString()}</div>
                                  <div className="text-xs text-gray-500">{order.paymentStatus}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {customers.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No customers yet</h3>
                <p className="mt-1 text-sm text-gray-500">Customers will appear here once orders are placed.</p>
              </div>
            )}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Product Reviews Management</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchReviews()}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {reviews.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending Reviews</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {reviews.filter(r => r.status === 'approved').length}
                </div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">
                  {reviews.filter(r => r.status === 'rejected').length}
                </div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          review.status === 'approved' ? 'bg-green-100 text-green-800' :
                          review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {review.status.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900">{review.title}</h3>
                      <p className="text-gray-600 mt-1">{review.comment}</p>
                      <div className="text-sm text-gray-500 mt-2">
                        By {review.visitorName} • {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                      {review.product && (
                        <div className="text-sm text-blue-600 mt-1">
                          Product: {review.product.name}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      {review.status === 'pending' && (
                        <>
                          <button
                            onClick={async () => {
                              await fetch(`/api/reviews/${review._id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'approved' })
                              });
                              fetchReviews();
                            }}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={async () => {
                              await fetch(`/api/reviews/${review._id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'rejected' })
                              });
                              fetchReviews();
                            }}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={async () => {
                          if (confirm('Delete this review?')) {
                            await fetch(`/api/reviews/${review._id}`, { method: 'DELETE' });
                            fetchReviews();
                          }
                        }}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {reviews.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No reviews yet
              </div>
            )}
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Inventory Management</h2>
              
              {/* Stats */}
              {inventory && (
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">{inventory.stats.totalProducts}</div>
                    <div className="text-sm text-gray-600">Total Products</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{inventory.stats.totalStock}</div>
                    <div className="text-sm text-gray-600">Total Stock</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-600">{inventory.stats.lowStockCount}</div>
                    <div className="text-sm text-gray-600">Low Stock</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-600">{inventory.stats.outOfStockCount}</div>
                    <div className="text-sm text-gray-600">Out of Stock</div>
                  </div>
                </div>
              )}

              {/* Filter Buttons */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => fetchInventory()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  All Products
                </button>
                <button
                  onClick={async () => {
                    const res = await fetch('/api/inventory?alert=low-stock');
                    const data = await res.json();
                    setInventory(data);
                  }}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Low Stock Only
                </button>
                <button
                  onClick={async () => {
                    const res = await fetch('/api/inventory?alert=out-of-stock');
                    const data = await res.json();
                    setInventory(data);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Out of Stock
                </button>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventory?.products.map((product: any) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{product.sku || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">{product.stockQuantity}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">Rs. {product.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            product.stockQuantity === 0 ? 'bg-red-100 text-red-800' :
                            product.stockQuantity <= 10 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {product.stockQuantity === 0 ? 'Out of Stock' :
                             product.stockQuantity <= 10 ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales Reports</h2>

            {/* Date Range Filter */}
            <div className="flex gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  id="reportStartDate"
                  className="px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  id="reportEndDate"
                  className="px-4 py-2 border rounded"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={() => {
                    const start = (document.getElementById('reportStartDate') as HTMLInputElement)?.value;
                    const end = (document.getElementById('reportEndDate') as HTMLInputElement)?.value;
                    fetchReports(start, end);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Generate Report
                </button>
                <button
                  onClick={() => {
                    const start = (document.getElementById('reportStartDate') as HTMLInputElement)?.value;
                    const end = (document.getElementById('reportEndDate') as HTMLInputElement)?.value;
                    const params = new URLSearchParams();
                    if (start) params.append('startDate', start);
                    if (end) params.append('endDate', end);
                    params.append('export', 'csv');
                    window.open(`/api/reports?${params}`, '_blank');
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Export CSV
                </button>
              </div>
            </div>

            {reportData && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">Rs. {reportData.summary.totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{reportData.summary.totalOrders}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">Rs. {Math.round(reportData.summary.averageOrderValue).toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Avg Order Value</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">{reportData.summary.totalItems}</div>
                    <div className="text-sm text-gray-600">Items Sold</div>
                  </div>
                </div>

                {/* Revenue by Category */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-3">Revenue by Category</h3>
                  <div className="space-y-2">
                    {reportData.revenueByCategory.map((cat: any) => (
                      <div key={cat._id} className="flex justify-between items-center">
                        <span className="text-gray-700">{cat._id}</span>
                        <span className="font-bold text-gray-900">Rs. {cat.revenue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Products */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-3">Top 10 Products</h3>
                  <div className="space-y-2">
                    {reportData.topProducts.map((product: any, idx: number) => (
                      <div key={product._id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600">{idx + 1}.</span>
                          <span className="text-gray-700">{product.productName}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">Rs. {product.totalRevenue.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{product.totalQuantity} sold</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!reportData && (
              <div className="text-center py-12 text-gray-500">
                Select date range and click Generate Report
              </div>
            )}
          </div>
        )}

        {/* SHIPPING TAB */}
        {activeTab === "shipping" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Shipping Methods</h2>
              <button
                onClick={async () => {
                  const name = prompt('Shipping Method Name:');
                  const cost = prompt('Cost (Rs):');
                  if (name && cost) {
                    await fetch('/api/shipping', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name, cost: Number(cost), isActive: true })
                    });
                    fetchShipping();
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Shipping Method
              </button>
            </div>

            <div className="space-y-4">
              {shippingMethods.map((method) => (
                <div key={method._id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-gray-900">{method.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        method.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {method.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{method.description}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>Cost: Rs. {method.cost}</span>
                      <span>Est. Delivery: {method.estimatedDays} days</span>
                      {method.freeShippingThreshold && (
                        <span>Free shipping over Rs. {method.freeShippingThreshold}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        await fetch(`/api/shipping/${method._id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ isActive: !method.isActive })
                        });
                        fetchShipping();
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this shipping method?')) {
                          await fetch(`/api/shipping/${method._id}`, { method: 'DELETE' });
                          fetchShipping();
                        }
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {shippingMethods.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No shipping methods configured
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && settings && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Site Settings</h2>
            
            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Store Information */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Store Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                    <input
                      type="text"
                      value={settings.storeName || ""}
                      onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline || ""}
                      onChange={(e) => setSettings({...settings, tagline: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                    <input
                      type="text"
                      value={settings.logo || ""}
                      onChange={(e) => setSettings({...settings, logo: e.target.value})}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Header Display Mode</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-red-500 transition">
                        <input
                          type="radio"
                          name="headerDisplay"
                          value="logo-only"
                          checked={settings.headerDisplay === "logo-only"}
                          onChange={(e) => setSettings({...settings, headerDisplay: e.target.value})}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-gray-900">Logo Only</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-red-500 transition">
                        <input
                          type="radio"
                          name="headerDisplay"
                          value="name-only"
                          checked={settings.headerDisplay === "name-only"}
                          onChange={(e) => setSettings({...settings, headerDisplay: e.target.value})}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-gray-900">Name Only</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-red-500 transition">
                        <input
                          type="radio"
                          name="headerDisplay"
                          value="logo-and-name"
                          checked={settings.headerDisplay === "logo-and-name"}
                          onChange={(e) => setSettings({...settings, headerDisplay: e.target.value})}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-gray-900">Logo + Name</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-red-500 transition">
                        <input
                          type="radio"
                          name="headerDisplay"
                          value="both-stacked"
                          checked={settings.headerDisplay === "both-stacked"}
                          onChange={(e) => setSettings({...settings, headerDisplay: e.target.value})}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-gray-900">Stacked</span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Choose how your brand appears in the header</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={settings.email || ""}
                      onChange={(e) => setSettings({...settings, email: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={settings.phone || ""}
                      onChange={(e) => setSettings({...settings, phone: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                    <input
                      type="text"
                      value={settings.whatsapp || ""}
                      onChange={(e) => setSettings({...settings, whatsapp: e.target.value})}
                      placeholder="+92 300 1234567"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={settings.address || ""}
                      onChange={(e) => setSettings({...settings, address: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                    <input
                      type="text"
                      value={settings.facebook || ""}
                      onChange={(e) => setSettings({...settings, facebook: e.target.value})}
                      placeholder="https://facebook.com/..."
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                    <input
                      type="text"
                      value={settings.instagram || ""}
                      onChange={(e) => setSettings({...settings, instagram: e.target.value})}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                    <input
                      type="text"
                      value={settings.twitter || ""}
                      onChange={(e) => setSettings({...settings, twitter: e.target.value})}
                      placeholder="https://twitter.com/..."
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Business Settings */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
                    <input
                      type="text"
                      value={settings.currency || "Rs."}
                      onChange={(e) => setSettings({...settings, currency: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={settings.taxRate || 0}
                      onChange={(e) => setSettings({...settings, taxRate: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Shipping Fee</label>
                    <input
                      type="number"
                      value={settings.shippingFee || 0}
                      onChange={(e) => setSettings({...settings, shippingFee: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold</label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold || 0}
                      onChange={(e) => setSettings({...settings, freeShippingThreshold: parseFloat(e.target.value) || 0})}
                      placeholder="Minimum order for free shipping"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div>
            {showProductForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {editingProductId ? "Edit Product" : "Add Product"}
                </h2>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={productFormData.name}
                        onChange={(e) =>
                          setProductFormData({ ...productFormData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category (Level 1)
                      </label>
                      <select
                        value={selectedLevel1}
                        onChange={(e) => {
                          setSelectedLevel1(e.target.value);
                          setSelectedLevel2("");
                          setSelectedLevel3("");
                        }}
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                      >
                        <option value="">Select Category</option>
                        {mainCategories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedLevel1 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category (Level 2)
                        </label>
                        <select
                          value={selectedLevel2}
                          onChange={(e) => {
                            setSelectedLevel2(e.target.value);
                            setSelectedLevel3("");
                          }}
                          className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        >
                          <option value="">Select Sub Category</option>
                          {level2Cats.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {selectedLevel2 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category (Level 3)
                        </label>
                        <select
                          value={selectedLevel3}
                          onChange={(e) => setSelectedLevel3(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        >
                          <option value="">Select Sub Sub Category</option>
                          {level3Cats.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (PKR)
                      </label>
                      <input
                        type="number"
                        value={productFormData.price}
                        onChange={(e) =>
                          setProductFormData({ ...productFormData, price: e.target.value })
                        }
                        step="0.01"
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sale Price (PKR) - Optional
                      </label>
                      <input
                        type="number"
                        value={productFormData.salePrice}
                        onChange={(e) =>
                          setProductFormData({ ...productFormData, salePrice: e.target.value })
                        }
                        step="0.01"
                        placeholder="Leave empty if no sale"
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount (%) - Optional
                      </label>
                      <input
                        type="number"
                        value={productFormData.discount}
                        onChange={(e) =>
                          setProductFormData({ ...productFormData, discount: e.target.value })
                        }
                        step="1"
                        min="0"
                        max="100"
                        placeholder="e.g., 20"
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                      />
                    </div>
                  </div>

                  {/* Product Image Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image
                    </label>
                    
                    {productImagePreview && (
                      <div className="mb-3 relative rounded-lg overflow-hidden border-2 border-gray-200">
                        <div
                          className="h-48 bg-cover bg-center"
                          style={{ backgroundImage: `url(${productImagePreview})` }}
                        >
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="text-white text-center">
                              <p className="text-sm font-medium">Preview</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mb-2">
                      <label
                        htmlFor="product-image-upload"
                        className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition ${
                          uploadingProductImage
                            ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                            : "border-red-300 bg-red-50 hover:border-red-500 hover:bg-red-100"
                        }`}
                      >
                        <Plus size={20} className="text-red-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {uploadingProductImage ? "Uploading..." : "Upload Product Image (Max 5MB)"}
                        </span>
                      </label>
                      <input
                        id="product-image-upload"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleProductImageUpload}
                        disabled={uploadingProductImage}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended: Square images 800×800 pixels. Auto-optimized to WebP.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Or paste image URL:
                      </label>
                      <input
                        type="text"
                        value={productFormData.image}
                        onChange={(e) => {
                          setProductFormData({ ...productFormData, image: e.target.value });
                          setProductImagePreview(e.target.value);
                        }}
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={productFormData.description}
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                    />
                  </div>

                  {/* Additional Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SKU (Stock Keeping Unit)
                      </label>
                      <input
                        type="text"
                        value={productFormData.sku}
                        onChange={(e) =>
                          setProductFormData({ ...productFormData, sku: e.target.value })
                        }
                        placeholder="e.g., PROD-001"
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Available Sizes (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={productFormData.sizes?.join(", ") || ""}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="e.g., XS, S, M, L, XL"
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                      />
                    </div>
                  </div>

                  {/* Size Chart Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size Chart Image URL (optional)
                    </label>
                    <input
                      type="text"
                      value={productFormData.sizeChart}
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, sizeChart: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                    />
                    <p className="text-xs text-gray-500 mt-1">Paste link to size chart image</p>
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={productFormData.stockQuantity}
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, stockQuantity: e.target.value })
                      }
                      placeholder="e.g., 50"
                      className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                    />
                  </div>

                  {/* Featured Checkbox */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productFormData.isFeatured}
                        onChange={(e) =>
                          setProductFormData({ ...productFormData, isFeatured: e.target.checked })
                        }
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Feature this product (show on homepage)
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3 md:col-span-2">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      {editingProductId ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelProductForm}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!showProductForm && (
              <button
                onClick={() => setShowProductForm(true)}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition mb-6"
              >
                <Plus size={20} />
                Add Product
              </button>
            )}

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600">No products yet. Add one to get started!</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                          Rs. {product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* HERO TAB */}
        {activeTab === "hero" && (
          <div>
            {showHeroForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {editingHeroId ? "Edit Hero Slide" : "Add Hero Slide"}
                </h2>
                <form onSubmit={handleAddHeroSlide} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={heroFormData.title}
                        onChange={(e) => setHeroFormData({ ...heroFormData, title: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={heroFormData.subtitle}
                        onChange={(e) => setHeroFormData({ ...heroFormData, subtitle: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        placeholder="Crafted in Pakistan • Shipped Worldwide"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hero Image
                      </label>
                      
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="mb-3 relative rounded-lg overflow-hidden border-2 border-gray-200">
                          <div
                            className="h-48 bg-cover bg-center"
                            style={{
                              backgroundImage: imagePreview.startsWith('linear-')
                                ? imagePreview
                                : `url(${imagePreview})`,
                            }}
                          >
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <div className="text-white text-center">
                                <p className="text-sm font-medium">Preview</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* File Upload */}
                      <div className="mb-2">
                        <label
                          htmlFor="hero-image-upload"
                          className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition ${
                            uploadingImage
                              ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                              : "border-red-300 bg-red-50 hover:border-red-500 hover:bg-red-100"
                          }`}
                        >
                          <Plus size={20} className="text-red-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {uploadingImage ? "Uploading..." : "Upload Image (Max 5MB, JPG/PNG/WebP)"}
                          </span>
                        </label>
                        <input
                          id="hero-image-upload"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: 1920×600 to 1920×800 pixels. Image will be auto-optimized to WebP.
                        </p>
                      </div>

                      {/* Manual URL Input */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Or paste image URL / CSS gradient:
                        </label>
                        <input
                          type="text"
                          value={heroFormData.image}
                          onChange={(e) => {
                            setHeroFormData({ ...heroFormData, image: e.target.value });
                            setImagePreview(e.target.value);
                          }}
                          className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                          placeholder="https://... or linear-gradient(...)"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CTA Label</label>
                      <input
                        type="text"
                        value={heroFormData.ctaLabel}
                        onChange={(e) => setHeroFormData({ ...heroFormData, ctaLabel: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                      <input
                        type="text"
                        value={heroFormData.ctaHref}
                        onChange={(e) => setHeroFormData({ ...heroFormData, ctaHref: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        placeholder="/collections"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                      <input
                        type="number"
                        value={heroFormData.order}
                        onChange={(e) =>
                          setHeroFormData({ ...heroFormData, order: Number(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        min={0}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={heroFormData.isActive}
                      onChange={(e) => setHeroFormData({ ...heroFormData, isActive: e.target.checked })}
                    />
                    <span className="text-sm text-gray-700">Active (show on site)</span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      {editingHeroId ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelHeroForm}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!showHeroForm && (
              <button
                onClick={() => setShowHeroForm(true)}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition mb-6"
              >
                <Plus size={20} />
                Add Hero Slide
              </button>
            )}

            {heroLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading hero slides...</p>
              </div>
            ) : heroSlides.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600">No hero slides yet. Add one to get started!</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">CTA</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Active</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {heroSlides.map((slide) => (
                      <tr key={slide._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">
                          <div className="font-semibold">{slide.title}</div>
                          {slide.subtitle && (
                            <div className="text-xs text-gray-500">{slide.subtitle}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div>{slide.ctaLabel}</div>
                          <div className="text-xs text-gray-500">{slide.ctaHref}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{slide.order ?? 0}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {slide.isActive === false ? "No" : "Yes"}
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => handleEditHeroSlide(slide)}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteHeroSlide(slide._id)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === "categories" && (
          <div>
            {showCategoryForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {editingCategoryId ? "Edit Category" : "Add Category"}
                </h2>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <div className="flex gap-4 mb-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="categoryType"
                          value="main"
                          checked={!categoryFormData.parentId}
                          onChange={() =>
                            setCategoryFormData({ ...categoryFormData, parentId: null })
                          }
                        />
                        <span className="text-sm text-gray-700">Main Category</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="categoryType"
                          value="sub"
                          checked={categoryFormData.parentId !== null}
                          onChange={() =>
                            setCategoryFormData({
                              ...categoryFormData,
                              parentId: "",
                            })
                          }
                        />
                        <span className="text-sm text-gray-700">Sub Category</span>
                      </label>
                    </div>
                  </div>

                  {categoryFormData.parentId !== null && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Category
                      </label>
                      <select
                        value={categoryFormData.parentId || ""}
                        onChange={(e) =>
                          setCategoryFormData({ ...categoryFormData, parentId: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        required
                      >
                        <option value="">Select Parent Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {getCategoryLabel(cat)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.name}
                      onChange={(e) =>
                        setCategoryFormData({ ...categoryFormData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug (URL-friendly name)
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.slug}
                      onChange={(e) =>
                        setCategoryFormData({ ...categoryFormData, slug: e.target.value })
                      }
                      placeholder="e.g. mens-clothing"
                      className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={categoryFormData.description}
                      onChange={(e) =>
                        setCategoryFormData({ ...categoryFormData, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      {editingCategoryId ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelCategoryForm}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!showCategoryForm && (
              <button
                onClick={() => setShowCategoryForm(true)}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition mb-6"
              >
                <Plus size={20} />
                Add Category
              </button>
            )}

            {categories.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600">No categories yet. Add one to get started!</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Slug</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categories.map((category) => {
                      const parentCategory = category.parentId
                        ? categories.find((c) => c._id === category.parentId)
                        : null;
                      return (
                        <tr key={category._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-800">
                            {parentCategory ? (
                              <div>
                                <div className="text-xs text-gray-500">
                                  {parentCategory.name} &gt;
                                </div>
                                <div className="ml-4">{category.name}</div>
                              </div>
                            ) : (
                              <div className="font-semibold">{category.name}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{category.slug}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {parentCategory ? "Sub" : "Main"}
                          </td>
                          <td className="px-6 py-4 text-sm flex gap-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="text-blue-600 hover:text-blue-800 transition"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className="text-red-600 hover:text-red-800 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* NAVIGATION TAB */}
        {activeTab === "navigation" && (
          <div>
            <div className="mb-6 flex gap-2">
              {navigationItems.length === 0 && (
                <button
                  onClick={async () => {
                    if (!confirm("This will clear existing navigation and load defaults. Continue?")) return;
                    try {
                      setNavLoading(true);
                      const response = await fetch("/api/navigation/seed-main", {
                        method: "POST",
                        credentials: "include",
                      });
                      if (response.ok) {
                        const data = await response.json();
                        console.log("Seed response:", data);
                        await fetchNavigation();
                        alert(data.message || "Navigation seeded successfully!");
                      } else {
                        const error = await response.json();
                        alert("Failed to seed navigation: " + (error.error || "Unknown error"));
                      }
                    } catch (err) {
                      console.error("Seed error:", err);
                      alert("Error seeding navigation: " + (err instanceof Error ? err.message : "Unknown error"));
                    } finally {
                      setNavLoading(false);
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
                  disabled={navLoading}
                >
                  {navLoading ? "Seeding..." : "Seed Default Navigation"}
                </button>
              )}
              
              {!showNavForm && (
                <button
                  onClick={() => setShowNavForm(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Navigation Item
                </button>
              )}
            </div>

            {showNavForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {editingNavId ? "Edit Navigation Item" : "Add Navigation Item"}
                </h2>
                <form onSubmit={handleAddNavigation} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      value={navFormData.level}
                      onChange={(e) => {
                        const level = parseInt(e.target.value);
                        setNavFormData({ 
                          ...navFormData, 
                          level,
                          parentId: level === 1 ? null : navFormData.parentId
                        });
                      }}
                      className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                    >
                      <option value={1}>Main Menu Item</option>
                      <option value={2}>Category (Level 2)</option>
                      <option value={3}>Sub-Category (Level 3)</option>
                    </select>
                  </div>

                  {navFormData.level > 1 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Item *
                      </label>
                      <select
                        value={navFormData.parentId || ""}
                        onChange={(e) =>
                          setNavFormData({ ...navFormData, parentId: e.target.value || null })
                        }
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        required
                      >
                        <option value="">Select Parent</option>
                        {navigationItems
                          .filter((item) => item.level < navFormData.level)
                          .map((item) => {
                            const indent = "  ".repeat(item.level - 1);
                            return (
                              <option key={item._id} value={item._id}>
                                {indent}{item.label} (Level {item.level})
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label *
                    </label>
                    <input
                      type="text"
                      value={navFormData.label}
                      onChange={(e) =>
                        setNavFormData({ ...navFormData, label: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-800"
                      placeholder="e.g., Men, Eastern Wear, Kurtas"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL/Href *
                    </label>
                    <input
                      type="text"
                      value={navFormData.href}
                      onChange={(e) =>
                        setNavFormData({ ...navFormData, href: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-800"
                      placeholder="e.g., /collections/mens-kurtas"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                    >
                      {editingNavId ? "Update" : "Add"} Item
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelNavForm}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                  {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                </form>
              </div>
            )}

            {navLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading navigation items...</p>
              </div>
            ) : navigationItems.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600">No navigation items. Click "Seed Default Navigation" to load the default menu structure!</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Label</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">URL</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Level</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {navigationItems.map((item) => {
                      const indent = "  ".repeat(item.level - 1);
                      const parentItem = item.parentId
                        ? navigationItems.find((n) => n._id === item.parentId)
                        : null;
                      return (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">
                            <span style={{ paddingLeft: `${(item.level - 1) * 20}px` }}>
                              {item.level > 1 && "↳ "}{item.label}
                            </span>
                            {parentItem && (
                              <div className="text-xs text-gray-500 mt-1" style={{ paddingLeft: `${(item.level - 1) * 20}px` }}>
                                Parent: {parentItem.label}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.href}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <span className={`px-2 py-1 rounded text-xs ${
                              item.level === 1 ? "bg-blue-100 text-blue-800" :
                              item.level === 2 ? "bg-green-100 text-green-800" :
                              "bg-purple-100 text-purple-800"
                            }`}>
                              Level {item.level}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.order || 0}</td>
                          <td className="px-6 py-4 text-sm flex gap-2">
                            <button
                              onClick={() => handleEditNavigation(item)}
                              className="text-blue-600 hover:text-blue-800 transition p-1"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteNavigation(item._id)}
                              className="text-red-600 hover:text-red-800 transition p-1"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div>
            {ordersLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600">No orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            order.status === "processing" ? "bg-blue-100 text-blue-800" :
                            order.status === "shipped" ? "bg-purple-100 text-purple-800" :
                            order.status === "delivered" ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete Order"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Customer</h4>
                        <p className="text-sm text-gray-600">{order.customer.name}</p>
                        <p className="text-sm text-gray-600">{order.customer.email}</p>
                        <p className="text-sm text-gray-600">{order.customer.phone}</p>
                        <p className="text-sm text-gray-600 mt-1">{order.customer.address}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Payment</h4>
                        <p className="text-sm text-gray-600">
                          Method: <span className="font-medium">{order.paymentMethod.toUpperCase()}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Status: <span className={`font-medium ${order.paymentStatus === "paid" ? "text-green-600" : "text-red-600"}`}>
                            {order.paymentStatus.toUpperCase()}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div>
                              <span className="text-gray-800">{item.name}</span>
                              <span className="text-gray-500 ml-2">x{item.quantity}</span>
                            </div>
                            <span className="text-gray-800 font-medium">
                              PKR {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t mt-4 pt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-gray-800">PKR {order.subtotal.toFixed(2)}</span>
                      </div>
                      {order.shipping > 0 && (
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="text-gray-800">PKR {order.shipping.toFixed(2)}</span>
                        </div>
                      )}
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Discount:</span>
                          <span className="text-red-600">-PKR {order.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg mt-2">
                        <span className="text-gray-800">Total:</span>
                        <span className="text-red-600">PKR {order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="border-t mt-4 pt-4">
                        <h4 className="font-semibold text-gray-700 mb-1">Notes</h4>
                        <p className="text-sm text-gray-600">{order.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COUPONS TAB */}
        {activeTab === "coupons" && (
          <div>
            {showCouponForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {editingCouponId ? "Edit Coupon" : "Add Coupon"}
                </h2>
                <form onSubmit={handleAddCoupon} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coupon Code *
                      </label>
                      <input
                        type="text"
                        value={couponFormData.code}
                        onChange={(e) =>
                          setCouponFormData({ ...couponFormData, code: e.target.value.toUpperCase() })
                        }
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        placeholder="e.g., SAVE20"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Type *
                      </label>
                      <select
                        value={couponFormData.discountType}
                        onChange={(e) =>
                          setCouponFormData({
                            ...couponFormData,
                            discountType: e.target.value as "percentage" | "fixed",
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (PKR)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Value *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={couponFormData.discountValue}
                        onChange={(e) =>
                          setCouponFormData({ ...couponFormData, discountValue: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        placeholder="e.g., 20"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Order Value (PKR)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={couponFormData.minOrderValue}
                        onChange={(e) =>
                          setCouponFormData({ ...couponFormData, minOrderValue: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Discount (PKR)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={couponFormData.maxDiscount}
                        onChange={(e) =>
                          setCouponFormData({ ...couponFormData, maxDiscount: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Usage Limit
                      </label>
                      <input
                        type="number"
                        value={couponFormData.usageLimit}
                        onChange={(e) =>
                          setCouponFormData({ ...couponFormData, usageLimit: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        placeholder="Unlimited"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        value={couponFormData.expiryDate}
                        onChange={(e) =>
                          setCouponFormData({ ...couponFormData, expiryDate: e.target.value })
                        }
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={couponFormData.isActive}
                          onChange={(e) =>
                            setCouponFormData({ ...couponFormData, isActive: e.target.checked })
                          }
                          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      {editingCouponId ? "Update" : "Create"} Coupon
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelCouponForm}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                  {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                </form>
              </div>
            )}

            {!showCouponForm && (
              <button
                onClick={() => setShowCouponForm(true)}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition mb-6"
              >
                <Plus size={20} />
                Add Coupon
              </button>
            )}

            {couponsLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading coupons...</p>
              </div>
            ) : coupons.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600">No coupons yet. Add one to get started!</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Discount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Min Order</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Usage</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Expiry</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {coupons.map((coupon) => (
                      <tr key={coupon._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono font-bold text-gray-800">
                          {coupon.code}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `PKR ${coupon.discountValue}`}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          PKR {coupon.minOrderValue}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {coupon.usedCount} / {coupon.usageLimit || "∞"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {coupon.expiryDate
                            ? new Date(coupon.expiryDate).toLocaleDateString()
                            : "No expiry"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              coupon.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {coupon.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => handleEditCoupon(coupon)}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(coupon._id)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
