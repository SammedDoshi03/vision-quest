# Project 02: High-Performance Retail E-Commerce Platform

> Inspired by: H&M, Zara, The Souled Store, ASOS  
> Focus: Fast Visual Discovery, Faceted Filtering, Size Guides, Inventory Reservation, Multi-Currency Checkout, Order Lifecycles.

---

## 1. Domain Overview & High-Level Concept

Modern apparel & lifestyle e-commerce demands instant perceived performance: sub-100ms image caching, fluid lookbooks, real-time inventory reservation, and friction-free localized checkouts supporting multi-currency and split-second mobile payment rails.

```
                      ┌──────────────────────────────────────────────┐
                      │          React Native Retail Client          │
                      │  Lookbooks  │  Catalog  │  Cart  │  Checkout │
                      └──────────────────────┬───────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │              Mobile BFF Gateway              │
                      │  - Catalog Aggregator  │  Inventory Lock     │
                      │  - Dynamic Pricing     │  Coupon Engine      │
                      └──────────────┬───────────────────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐
│   Catalog & Search │    │ Cart & Reservation │    │ Payment & Checkout │
│ (Elastic/Algolia)  │    │  (Redis + MongoDB) │    │(Stripe, Razorpay)  │
└────────────────────┘    └────────────────────┘    └────────────────────┘
```

---

## 2. Key Modules & Functional Scope

1. **Visual Catalog & Lookbooks:**
   - Infinite feed of curated collections, lookbook carousels with "Shop The Look" pin overlays.
   - Dynamic faceted filter engine (Size, Color, Material, Fit, Price Range, In-Stock Only).
2. **Product Detail Page (PDP):**
   - High-resolution media viewer with pinch-to-zoom, 360-spin viewer, and size guide drawer.
   - SKU variant selector (Size × Color) with real-time stock alert ("Only 2 left in Size M!").
3. **Cart & Inventory Reservation:**
   - 15-minute temporary inventory hold lock (`inventory_locks` in Redis) to prevent overselling during flash sales.
   - Coupon & Promo Engine (percentage, flat, threshold BOGO).
4. **Pincode & Shipping Serviceability:**
   - Real-time courier API integration (Delivery ETA estimate by zip/pincode).
5. **Universal Multi-Currency Checkout:**
   - Address book with geolocation autofill.
   - Multi-currency currency switcher (INR, USD, EUR, GBP, AED) with dynamic foreign exchange and tax/GST computation.
6. **Order Lifecycle & Tracking:**
   - Visual step-progress timeline (`PLACED` → `CONFIRMED` → `PACKED` → `SHIPPED` → `OUT_FOR_DELIVERY` → `DELIVERED`).
   - Self-service Returns/Exchange workflow with camera photo upload for damaged items.

---

## 3. Data Schema & DTO Definitions

```typescript
export interface ProductSKUDTO {
  sku: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: { name: string; hex: string };
  stockQuantity: number;
  barcode: string;
  weightGrams: number;
}

export interface ProductDetailDTO {
  id: string;
  title: string;
  brand: string;
  description: string;
  category: { id: string; slug: string; path: string[] };
  pricing: {
    baseCurrency: string; // "USD", "INR"
    originalPrice: number;
    discountPrice?: number;
    taxRatePercentage: number;
  };
  skus: ProductSKUDTO[];
  images: { id: string; url: string; blurhash: string; isPrimary: boolean }[];
  sizeChart: { headers: string[]; rows: Record<string, string>[] };
  attributes: { material: string; fit: string; careInstructions: string[] };
  badges: ('NEW_DROP' | 'BESTSELLER' | 'LIMITED_EDITION')[];
  rating: { score: number; reviewCount: number };
}

export interface CartItemDTO {
  cartItemId: string;
  productId: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  title: string;
  size: string;
  color: string;
  thumbnailUrl: string;
  reservedUntil: string; // ISO DateTime
}

export interface OrderTrackingDTO {
  orderId: string;
  trackingNumber: string;
  courierPartner: string;
  currentStatus: 'PLACED' | 'CONFIRMED' | 'PACKED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  estimatedDeliveryDate: string;
  statusHistory: { status: string; timestamp: string; location?: string; message: string }[];
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  pricingSummary: {
    subtotal: number;
    tax: number;
    shippingFee: number;
    discount: number;
    totalAmount: number;
    currency: string;
  };
}
```

---

## 4. UI Kit Components Required

| Component | Functionality |
|---|---|
| `ProductCard` | Image with blurhash, discount badge, quick-add bottom sheet trigger, wishlist heart toggle. |
| `LookbookHotspot` | Interactive tappable dot overlay on fashion lifestyle photography linking to PDP. |
| `SizeGuideDrawer` | SlideUpPanel containing interactive measurement converter (cm/inches) and fit recommendations. |
| `InventoryReservationBar` | Sticky countdown timer ("Item reserved for 12:45 minutes") creating urgency. |
| `OrderTimelineStepper` | Vertical step progress tracking live package delivery milestones. |
| `CurrencySelector` | Modal sheet to switch currency and country with automatic price recalculation. |

---

## 5. Service Contracts

```typescript
export interface ICatalogService {
  searchProducts(query: { q?: string; categoryId?: string; sizes?: string[]; minPrice?: number; maxPrice?: number; page: number }): Promise<{ items: ProductDetailDTO[]; total: number }>;
  getProductBySlug(slug: string): Promise<ProductDetailDTO>;
}

export interface ICartService {
  addToCart(productId: string, sku: string, quantity: number): Promise<{ cartItemId: string; expiresAt: string }>;
  applyCoupon(code: string): Promise<{ discountAmount: number; valid: boolean }>;
  reserveInventory(cartId: string): Promise<{ reservationId: string; lockExpiry: string }>;
}

export interface ICheckoutService {
  createOrder(cartId: string, addressId: string, paymentMethod: string): Promise<{ orderId: string; paymentSessionPayload: unknown }>;
  trackOrder(orderId: string): Promise<OrderTrackingDTO>;
}
```
