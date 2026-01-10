"use client";

import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Container } from "@/components/layout/Container";

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
  sizes?: string[];
  sizeChart?: string;
}

interface Review {
  _id: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  visitorName: string;
  createdAt: string;
}

interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
}

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cart & Favorites state
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [visitorId, setVisitorId] = useState("");

  // Image zoom state
  const [isImageHovered, setIsImageHovered] = useState(false);

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
    visitorName: "",
    visitorEmail: "",
  });

  // Initialize visitorId (UUID stored in localStorage)
  useEffect(() => {
    const stored = localStorage.getItem("visitorId");
    if (stored) {
      setVisitorId(stored);
    } else {
      const newId = crypto.randomUUID();
      localStorage.setItem("visitorId", newId);
      setVisitorId(newId);
    }
  }, []);

  // Get slug from params
  useEffect(() => {
    (async () => {
      const p = await params;
      setSlug(p.slug);
    })();
  }, [params]);

  // Fetch product and reviews
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/slug?slug=${slug}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError("Product not found");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Fetch reviews
  useEffect(() => {
    if (!product?._id) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?productId=${product._id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    };

    fetchReviews();
  }, [product?._id]);

  // Add to cart
  const handleAddToCart = async () => {
    if (product?.sizes?.length && !selectedSize) {
      setError("Please select a size");
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          productId: product?._id,
          quantity,
          size: selectedSize || null,
        }),
      });

      if (res.ok) {
        setError("");
        alert("Added to cart!");
        setQuantity(1);
        setSelectedSize("");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add to cart");
      }
    } catch (err) {
      setError("Failed to add to cart");
    }
  };

  // Add to favorites
  const handleToggleFavorite = async () => {
    if (!visitorId || !product?._id) return;

    try {
      if (isFavorite) {
        const res = await fetch(
          `/api/favorites?visitorId=${visitorId}&productId=${product._id}`,
          { method: "DELETE" }
        );
        if (res.ok) setIsFavorite(false);
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, productId: product._id }),
        });
        if (res.ok) {
          setIsFavorite(true);
        } else {
          const data = await res.json();
          if (data.error?.includes("Already in favorites")) {
            setIsFavorite(true);
          }
        }
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  // Submit review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?._id) return;

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          ...reviewForm,
          rating: Number(reviewForm.rating),
        }),
      });

      if (res.ok) {
        setReviewForm({
          rating: 5,
          title: "",
          comment: "",
          visitorName: "",
          visitorEmail: "",
        });
        setShowReviewForm(false);
        // Refresh reviews
        const reviewRes = await fetch(`/api/reviews?productId=${product._id}`);
        if (reviewRes.ok) {
          const data = await reviewRes.json();
          setReviews(data);
        }
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error || "Product not found"}</p>
      </div>
    );
  }

  const discountedPrice = product.salePrice || product.price;
  const originalPrice = product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <div className="min-h-screen bg-white">
      <Container>
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="flex items-center justify-center overflow-hidden rounded-lg">
            {product.image ? (
              <div
                className="w-full h-96 rounded-lg bg-cover bg-center border-2 border-red-200 cursor-zoom-in transition-transform duration-300"
                style={{
                  backgroundImage: `url(${product.image})`,
                  transform: isImageHovered ? "scale(1.2)" : "scale(1)",
                }}
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
              />
            ) : (
              <div className="w-full h-96 rounded-lg bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center border-2 border-red-200">
                <p className="text-gray-500">No image</p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>
              {product.sku && (
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-red-600">
                  PKR {discountedPrice.toLocaleString()}
                </div>
                {hasDiscount && (
                  <>
                    <div className="text-lg text-gray-500 line-through">
                      PKR {originalPrice.toLocaleString()}
                    </div>
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {product.discount}% OFF
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-600">
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition ${
                        selectedSize === size
                          ? "border-red-600 bg-red-50 text-red-600"
                          : "border-gray-300 bg-white text-gray-800 hover:border-red-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {product.sizeChart && (
                  <a
                    href={product.sizeChart}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    📏 View Size Chart
                  </a>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 px-3 py-2 border-2 border-gray-300 rounded-lg text-center"
                  min="1"
                />
                <button
                  onClick={() =>
                    setQuantity(quantity + 1)
                  }
                  className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  +
                </button>
                {product.quantity && (
                  <p className="text-sm text-gray-600 ml-4">
                    {product.quantity} in stock
                  </p>
                )}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`px-6 py-3 rounded-lg font-semibold border-2 transition ${
                  isFavorite
                    ? "bg-red-50 border-red-600 text-red-600"
                    : "bg-white border-gray-300 text-gray-800 hover:border-red-300"
                }`}
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 py-12 border-t-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Customer Reviews ({reviews.length})
          </h2>

          {/* Review Form */}
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="mb-8 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Write a Review
            </button>
          ) : (
            <form
              onSubmit={handleSubmitReview}
              className="mb-8 bg-gray-50 p-6 rounded-lg border-2 border-gray-200 space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="text-2xl transition"
                    >
                      <Star
                        size={24}
                        fill={star <= reviewForm.rating ? "currentColor" : "none"}
                        className={
                          star <= reviewForm.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Review Title
                </label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, title: e.target.value })
                  }
                  placeholder="e.g., Great quality!"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Review Comment
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={reviewForm.visitorName}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, visitorName: e.target.value })
                  }
                  placeholder="Your name (optional)"
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
                <input
                  type="email"
                  value={reviewForm.visitorEmail}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, visitorEmail: e.target.value })
                  }
                  placeholder="Your email (optional)"
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-50 rounded-lg p-4 border-l-4 border-yellow-500"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {review.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        by {review.visitorName} •{" "}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          fill={
                            star <= review.rating
                              ? "currentColor"
                              : "none"
                          }
                          className={
                            star <= review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
