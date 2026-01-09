// app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit, Plus, LogOut } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: "",
    category: "men",
    price: "",
    description: "",
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: null as string | null,
  });
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  // PRODUCT HANDLERS
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const categoryToUse = selectedSubCategory || selectedMainCategory;
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
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setProductFormData({ name: "", category: "men", price: "", description: "" });
        setEditingProductId(null);
        setShowProductForm(false);
        setSelectedMainCategory("");
        setSelectedSubCategory("");
        await fetchProducts();
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
      description: product.description || "",
    });
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
    setProductFormData({ name: "", category: "men", price: "", description: "" });
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
        setCategoryFormData({ name: "", slug: "", description: "" });
        setEditingCategoryId(null);
        setShowCategoryForm(false);
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
    });
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
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
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-medium transition ${
              activeTab === "products"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 font-medium transition ${
              activeTab === "categories"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Categories
          </button>
        </div>

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
                        Category
                      </label>
                      <select
                        value={selectedMainCategory}
                        onChange={(e) => {
                          setSelectedMainCategory(e.target.value);
                          setSelectedSubCategory("");
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

                    {selectedMainCategory && subCategories.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sub Category
                        </label>
                        <select
                          value={selectedSubCategory}
                          onChange={(e) => setSelectedSubCategory(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50 text-gray-800"
                        >
                          <option value="">Select Sub Category</option>
                          {subCategories.map((cat) => (
                            <option key={cat._id} value={cat.slug}>
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

                  <div className="flex gap-3">
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
                              parentId: mainCategories[0]?._id || "",
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
                        {mainCategories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
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
      </div>
    </div>
  );
}
