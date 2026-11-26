import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  DEFAULT_PLATFORM_SETTINGS,
  getStarterBundle,
  getStarterSeedDataset,
} from "./demo-fallback";
import { OperationType, handleFirestoreError, safeTimestampToIso } from "./firestore-errors";
import type {
  Branch,
  LocaleCode,
  MenuCategory,
  Order,
  OrderItem,
  OrderStatus,
  PlanTier,
  PlatformRole,
  PlatformSettings,
  Product,
  ProductOption,
  PublicUser,
  QrCodeRecord,
  Restaurant,
  RestaurantBundle,
  RestaurantDomain,
  RestaurantMember,
  RestaurantRole,
  SubscriptionRequest,
  SubscriptionRequestStatus,
  TenantStatus,
  VoiceAgentVoice,
} from "./types";

function makeId(prefix: string): string {
  const raw =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 10)
      : Math.random().toString(36).slice(2, 12);
  return `${prefix}-${raw}`;
}

export function slugify(input: string): string {
  const cleaned = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return (cleaned || "restaurant").slice(0, 90);
}

function clamp(val: string | undefined | null, max: number, fallback = ""): string {
  return (val ?? fallback).trim().slice(0, max);
}

export function normalizeDomainHost(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .split(":")[0]
    .replace(/[^a-z0-9.\-]/g, "")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 200);
}

function mapRestaurant(id: string, data: Record<string, unknown>): Restaurant {
  return {
    id: String(data.id || id),
    name: String(data.name || ""),
    nameAr: String(data.nameAr || ""),
    slug: String(data.slug || id),
    description: String(data.description || ""),
    descriptionAr: String(data.descriptionAr || ""),
    logoText: String(data.logoText || "Q"),
    logoUrl: typeof data.logoUrl === "string" ? data.logoUrl : "",
    coverUrl: String(data.coverUrl || "/images/restaurant_hero_interior.jpg"),
    primaryColor: String(data.primaryColor || "#c8a66a"),
    secondaryColor: String(data.secondaryColor || "#111515"),
    currency: String(data.currency || "SAR"),
    defaultLocale: (data.defaultLocale === "ar" ? "ar" : "en") as LocaleCode,
    isPublished: Boolean(data.isPublished),
    voiceAgentEnabled: data.voiceAgentEnabled !== false,
    voiceAgentVoice: (
      ["Kore", "Charon", "Puck", "Fenrir", "Zephyr"].includes(
        String(data.voiceAgentVoice || "")
      )
        ? String(data.voiceAgentVoice)
        : "Kore"
    ) as VoiceAgentVoice,
    plan: (["Starter", "Growth", "Enterprise"].includes(String(data.plan))
      ? String(data.plan)
      : "Starter") as PlanTier,
    status: (["Active", "Setup", "Suspended"].includes(String(data.status))
      ? String(data.status)
      : "Setup") as TenantStatus,
    ownerUid: String(data.ownerUid || ""),
    createdAt: safeTimestampToIso(data.createdAt),
    updatedAt: safeTimestampToIso(data.updatedAt),
  };
}

function mapBranch(id: string, data: Record<string, unknown>): Branch {
  return {
    id: String(data.id || id),
    restaurantId: String(data.restaurantId || ""),
    name: String(data.name || ""),
    address: String(data.address || ""),
    phone: String(data.phone || ""),
    isActive: Boolean(data.isActive),
    isPublic: Boolean(data.isPublic),
    ownerUid: String(data.ownerUid || ""),
    createdAt: safeTimestampToIso(data.createdAt),
  };
}

function mapCategory(id: string, data: Record<string, unknown>): MenuCategory {
  return {
    id: String(data.id || id),
    restaurantId: String(data.restaurantId || ""),
    name: String(data.name || ""),
    nameAr: String(data.nameAr || ""),
    description: String(data.description || ""),
    sortOrder: Number(data.sortOrder ?? 1),
    isActive: Boolean(data.isActive),
    isPublic: Boolean(data.isPublic),
    ownerUid: String(data.ownerUid || ""),
    createdAt: safeTimestampToIso(data.createdAt),
  };
}

function mapProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id: String(data.id || id),
    restaurantId: String(data.restaurantId || ""),
    categoryId: data.categoryId ? String(data.categoryId) : null,
    name: String(data.name || ""),
    nameAr: String(data.nameAr || ""),
    description: String(data.description || ""),
    descriptionAr: String(data.descriptionAr || ""),
    imageUrl: String(data.imageUrl || "/images/dish_truffle_pasta.jpg"),
    price: Number(data.price ?? 0),
    compareAtPrice:
      typeof data.compareAtPrice === "number" ? data.compareAtPrice : null,
    isAvailable: Boolean(data.isAvailable),
    isFeatured: Boolean(data.isFeatured),
    sortOrder: Number(data.sortOrder ?? 1),
    allergens: Array.isArray(data.allergens)
      ? data.allergens.map(String)
      : [],
    options: Array.isArray(data.options)
      ? (data.options as ProductOption[])
      : [],
    isPublic: Boolean(data.isPublic),
    ownerUid: String(data.ownerUid || ""),
    createdAt: safeTimestampToIso(data.createdAt),
    updatedAt: safeTimestampToIso(data.updatedAt),
  };
}

function mapDomain(id: string, data: Record<string, unknown>): RestaurantDomain {
  return {
    id: String(data.id || id),
    restaurantId: String(data.restaurantId || ""),
    hostname: String(data.hostname || ""),
    isVerified: Boolean(data.isVerified),
    ownerUid: String(data.ownerUid || ""),
    createdAt: safeTimestampToIso(data.createdAt),
  };
}

function mapQrCode(id: string, data: Record<string, unknown>): QrCodeRecord {
  return {
    id: String(data.id || id),
    restaurantId: String(data.restaurantId || ""),
    branchId: data.branchId ? String(data.branchId) : null,
    label: String(data.label || ""),
    targetPath: String(data.targetPath || ""),
    token: String(data.token || ""),
    isActive: Boolean(data.isActive),
    ownerUid: String(data.ownerUid || ""),
    createdAt: safeTimestampToIso(data.createdAt),
  };
}

function mapMember(id: string, data: Record<string, unknown>): RestaurantMember {
  return {
    id,
    restaurantId: String(data.restaurantId || ""),
    userId: String(data.userId || id),
    email: String(data.email || ""),
    fullName: String(data.fullName || ""),
    role: (data.role || "staff") as RestaurantRole,
    claimedFromId: data.claimedFromId ? String(data.claimedFromId) : undefined,
    createdAt: safeTimestampToIso(data.createdAt),
  };
}

function mapOrder(id: string, data: Record<string, unknown>): Order {
  return {
    id: String(data.id || id),
    restaurantId: String(data.restaurantId || ""),
    branchId: data.branchId ? String(data.branchId) : null,
    orderNumber: Number(data.orderNumber ?? 1001),
    customerName: String(data.customerName || "Guest"),
    customerPhone: String(data.customerPhone || ""),
    tableLabel: String(data.tableLabel || "Table 01"),
    orderType: data.orderType === "pickup" ? "pickup" : "dine_in",
    status: (data.status || "pending") as OrderStatus,
    currency: String(data.currency || "SAR"),
    subtotal: Number(data.subtotal ?? 0),
    total: Number(data.total ?? 0),
    notes: String(data.notes || ""),
    items: Array.isArray(data.items) ? (data.items as OrderItem[]) : [],
    ownerUid: String(data.ownerUid || ""),
    createdAt: safeTimestampToIso(data.createdAt),
    updatedAt: safeTimestampToIso(data.updatedAt),
  };
}

function mapSubscriptionRequest(
  id: string,
  data: Record<string, unknown>
): SubscriptionRequest {
  return {
    id: String(data.id || id),
    restaurantName: String(data.restaurantName || ""),
    restaurantNameAr: String(data.restaurantNameAr || ""),
    preferredSlug: String(data.preferredSlug || ""),
    ownerName: String(data.ownerName || ""),
    ownerEmail: String(data.ownerEmail || ""),
    phone: String(data.phone || ""),
    city: String(data.city || ""),
    branchCount: Number(data.branchCount ?? 1),
    plan: (["Starter", "Growth", "Enterprise"].includes(String(data.plan))
      ? String(data.plan)
      : "Growth") as PlanTier,
    currency: String(data.currency || "SAR"),
    primaryColor: String(data.primaryColor || "#c8a66a"),
    logoUrl: typeof data.logoUrl === "string" ? data.logoUrl : "",
    notes: String(data.notes || ""),
    status: (["pending", "approved", "rejected"].includes(String(data.status))
      ? String(data.status)
      : "pending") as SubscriptionRequestStatus,
    provisionedSlug: String(data.provisionedSlug || ""),
    createdAt: safeTimestampToIso(data.createdAt),
    updatedAt: safeTimestampToIso(data.updatedAt),
  };
}

// ============================================================
// PUBLIC LANDING & PUBLIC MENU QUERIES
// ============================================================

export interface LandingPreviewTenant {
  restaurant: Restaurant;
  sampleItems: Array<{
    name: string;
    category: string;
    price: number;
    imageUrl: string;
  }>;
}

export async function fetchLandingPreviewData(): Promise<{
  tenants: LandingPreviewTenant[];
  restaurantCount: number;
  productCount: number;
}> {
  try {
    const restSnap = await getDocs(
      query(collection(db, "restaurants"), where("isPublished", "==", true))
    );
    if (restSnap.empty) {
      const seed = getStarterSeedDataset();
      const tenants = seed.restaurants.slice(0, 3).map((restaurant) => ({
        restaurant,
        sampleItems: seed.products
          .filter((p) => p.restaurantId === restaurant.id)
          .slice(0, 2)
          .map((p) => ({
            name: p.name,
            category:
              seed.categories.find((c) => c.id === p.categoryId)?.name ||
              "Menu",
            price: p.price,
            imageUrl: p.imageUrl,
          })),
      }));
      return {
        tenants,
        restaurantCount: seed.restaurants.length,
        productCount: seed.products.length,
      };
    }

    const restaurants = restSnap.docs.map((d) =>
      mapRestaurant(d.id, d.data() as Record<string, unknown>)
    );
    let totalProducts = 0;
    const tenants = await Promise.all(
      restaurants.slice(0, 3).map(async (restaurant) => {
        const [catsSnap, prodsSnap] = await Promise.all([
          getDocs(
            query(
              collection(db, "restaurants", restaurant.slug, "categories"),
              where("isPublic", "==", true)
            )
          ),
          getDocs(
            query(
              collection(db, "restaurants", restaurant.slug, "products"),
              where("isPublic", "==", true)
            )
          ),
        ]);
        totalProducts += prodsSnap.size;
        const cats = catsSnap.docs.map((d) =>
          mapCategory(d.id, d.data() as Record<string, unknown>)
        );
        const prods = prodsSnap.docs
          .map((d) => mapProduct(d.id, d.data() as Record<string, unknown>))
          .sort((a, b) => a.sortOrder - b.sortOrder);

        return {
          restaurant,
          sampleItems: prods.slice(0, 2).map((p) => ({
            name: p.name,
            category:
              cats.find((c) => c.id === p.categoryId)?.name || "Menu",
            price: p.price,
            imageUrl: p.imageUrl,
          })),
        };
      })
    );

    return {
      tenants,
      restaurantCount: restaurants.length,
      productCount: Math.max(totalProducts, 1),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "restaurants");
  }
}

export async function fetchPublicRestaurantMenu(
  slug: string,
  hasSignedInUser: boolean
): Promise<{
  restaurant: Restaurant;
  branches: Branch[];
  categories: MenuCategory[];
  products: Product[];
  isFallbackPreview: boolean;
} | null> {
  try {
    let restaurant: Restaurant | null = null;
    let canReadUnpublished = false;

    if (hasSignedInUser) {
      try {
        const direct = await getDoc(doc(db, "restaurants", slug));
        if (direct.exists()) {
          restaurant = mapRestaurant(
            direct.id,
            direct.data() as Record<string, unknown>
          );
          canReadUnpublished = !restaurant.isPublished;
        }
      } catch {
        // Signed-in user isn't admin/member of an unpublished restaurant; try public query
      }
    }

    if (!restaurant) {
      const pubSnap = await getDocs(
        query(
          collection(db, "restaurants"),
          where("slug", "==", slug),
          where("isPublished", "==", true)
        )
      );
      if (!pubSnap.empty) {
        const d = pubSnap.docs[0];
        restaurant = mapRestaurant(d.id, d.data() as Record<string, unknown>);
      }
    }

    if (!restaurant) {
      // Serve built-in sample menu (al-nakheel) immediately or starter fallback if DB is unseeded
      const starter = getStarterBundle(slug);
      if (starter) {
        if (slug === "al-nakheel") {
          return {
            restaurant: starter.restaurant,
            branches: starter.branches.filter((b) => b.isActive),
            categories: starter.categories,
            products: starter.products,
            isFallbackPreview: true,
          };
        }
        const anyPublished = await getDocs(
          query(collection(db, "restaurants"), where("isPublished", "==", true))
        );
        if (anyPublished.empty) {
          return {
            restaurant: starter.restaurant,
            branches: starter.branches.filter((b) => b.isActive),
            categories: starter.categories,
            products: starter.products,
            isFallbackPreview: true,
          };
        }
      }
      return null;
    }

    const branchesQ = canReadUnpublished
      ? collection(db, "restaurants", slug, "branches")
      : query(
          collection(db, "restaurants", slug, "branches"),
          where("isPublic", "==", true)
        );
    const catsQ = canReadUnpublished
      ? collection(db, "restaurants", slug, "categories")
      : query(
          collection(db, "restaurants", slug, "categories"),
          where("isPublic", "==", true)
        );
    const prodsQ = canReadUnpublished
      ? collection(db, "restaurants", slug, "products")
      : query(
          collection(db, "restaurants", slug, "products"),
          where("isPublic", "==", true)
        );

    const [branchesSnap, catsSnap, prodsSnap] = await Promise.all([
      getDocs(branchesQ),
      getDocs(catsQ),
      getDocs(prodsQ),
    ]);

    return {
      restaurant,
      branches: branchesSnap.docs
        .map((d) => mapBranch(d.id, d.data() as Record<string, unknown>))
        .filter((b) => b.isActive),
      categories: catsSnap.docs
        .map((d) => mapCategory(d.id, d.data() as Record<string, unknown>))
        .sort((a, b) => a.sortOrder - b.sortOrder),
      products: prodsSnap.docs
        .map((d) => mapProduct(d.id, d.data() as Record<string, unknown>))
        .sort((a, b) => a.sortOrder - b.sortOrder),
      isFallbackPreview: false,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `restaurants/${slug}`);
  }
}

export async function fetchPublicRestaurantByDomain(
  hostname: string,
  hasSignedInUser: boolean
): Promise<{
  restaurant: Restaurant;
  branches: Branch[];
  categories: MenuCategory[];
  products: Product[];
  isFallbackPreview: boolean;
  hostname: string;
  isVerified: boolean;
} | null> {
  const normalized = normalizeDomainHost(hostname);
  if (!normalized || normalized.length < 3) return null;

  try {
    const routeSnap = await getDoc(doc(db, "domainRoutes", normalized));
    if (!routeSnap.exists()) {
      return null;
    }
    const routeData = routeSnap.data() as Record<string, unknown>;
    const slug = String(routeData.slug || "");
    const isVerified = Boolean(routeData.isVerified);
    if (!slug) return null;
    if (!isVerified && !hasSignedInUser) return null;

    const menu = await fetchPublicRestaurantMenu(slug, hasSignedInUser);
    if (!menu) return null;

    return {
      ...menu,
      hostname: normalized,
      isVerified,
    };
  } catch {
    return null;
  }
}

export async function placePublicOrderInFirestore(input: {
  restaurant: Restaurant;
  products: Product[];
  branchId: string | null;
  customerName: string;
  customerPhone: string;
  tableLabel: string;
  orderType: "dine_in" | "pickup";
  notes: string;
  items: Array<{
    productId: string;
    quantity: number;
    selectedOptionValueIds: string[];
  }>;
}): Promise<Order> {
  const { restaurant, products } = input;
  if (!restaurant.isPublished) {
    throw new Error("Ordering is disabled while the menu is in draft mode.");
  }
  if (!input.items.length) {
    throw new Error("Your order bag is empty.");
  }

  const orderItems: OrderItem[] = [];
  let subtotal = 0;

  for (const item of input.items.slice(0, 50)) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || !product.isAvailable) {
      throw new Error("One or more items are currently unavailable.");
    }
    const qty = Math.max(1, Math.min(50, Math.floor(Number(item.quantity) || 1)));
    const selectedSet = new Set(item.selectedOptionValueIds || []);
    const optionsSnapshot: OrderItem["optionsSnapshot"] = [];
    let deltaSum = 0;

    for (const opt of product.options) {
      const picked = opt.values.filter((v) => selectedSet.has(v.id));
      if (opt.isRequired && picked.length < Math.max(1, opt.minSelect)) {
        if (opt.values.length > 0) {
          const fallback = opt.values[0];
          optionsSnapshot.push({
            optionName: opt.name,
            valueName: fallback.name,
            priceDelta: fallback.priceDelta,
          });
          deltaSum += fallback.priceDelta;
        }
      } else {
        for (const v of picked) {
          optionsSnapshot.push({
            optionName: opt.name,
            valueName: v.name,
            priceDelta: v.priceDelta,
          });
          deltaSum += v.priceDelta;
        }
      }
    }

    const unitPrice = Number((product.price + deltaSum).toFixed(2));
    subtotal += unitPrice * qty;
    orderItems.push({
      id: makeId("oi"),
      productId: product.id,
      productNameSnapshot: clamp(product.name, 140, "Dish"),
      quantity: qty,
      unitPrice,
      optionsSnapshot,
    });
  }

  subtotal = Number(subtotal.toFixed(2));
  const orderId = makeId("ord");
  const orderNumber = Math.floor(1000 + (Date.now() % 899999));
  const ownerUid = restaurant.ownerUid || "";
  const customerName = clamp(input.customerName, 120, "Guest") || "Guest";
  const customerPhone = clamp(input.customerPhone, 40, "");
  const tableLabel =
    clamp(
      input.tableLabel,
      60,
      input.orderType === "pickup" ? "Pickup" : "Table 01"
    ) || "Table 01";
  const notes = clamp(input.notes, 400, "");
  const currency = ["SAR", "AED", "USD", "EUR"].includes(restaurant.currency)
    ? restaurant.currency
    : "SAR";

  const payload = {
    id: orderId,
    restaurantId: restaurant.id,
    branchId: input.branchId || null,
    orderNumber,
    customerName,
    customerPhone,
    tableLabel,
    orderType: input.orderType,
    status: "pending",
    currency,
    subtotal,
    total: subtotal,
    notes,
    items: orderItems,
    ownerUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const path = `restaurants/${restaurant.slug}/orders/${orderId}`;
  try {
    await setDoc(doc(db, "restaurants", restaurant.slug, "orders", orderId), payload);
    return {
      ...payload,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function submitSubscriptionRequestInFirestore(input: {
  restaurantName: string;
  restaurantNameAr?: string;
  preferredSlug?: string;
  ownerName: string;
  ownerEmail: string;
  phone: string;
  city?: string;
  branchCount?: number;
  plan?: PlanTier;
  currency?: string;
  primaryColor?: string;
  logoUrl?: string;
  notes?: string;
}): Promise<SubscriptionRequest> {
  const id = makeId("req");
  const cleanRestaurantName = clamp(input.restaurantName, 120);
  const cleanOwnerName = clamp(input.ownerName, 120);
  const cleanEmail = clamp(input.ownerEmail.toLowerCase(), 200);
  const cleanPhone = clamp(input.phone, 40);

  if (!cleanRestaurantName || !cleanOwnerName || !cleanEmail.includes("@") || cleanPhone.length < 3) {
    throw new Error(
      "Please complete restaurant name, owner full name, valid email, and phone number."
    );
  }

  const preferredSlug = slugify(input.preferredSlug || cleanRestaurantName);
  const plan: PlanTier = ["Starter", "Growth", "Enterprise"].includes(
    input.plan || "Growth"
  )
    ? (input.plan as PlanTier)
    : "Growth";
  const currency = ["SAR", "AED", "USD", "EUR"].includes(
    input.currency || "SAR"
  )
    ? (input.currency as string)
    : "SAR";
  const branchCount = Math.max(
    1,
    Math.min(500, Math.floor(Number(input.branchCount) || 1))
  );
  const nowIso = new Date().toISOString();

  const payload = {
    id,
    restaurantName: cleanRestaurantName,
    restaurantNameAr: clamp(input.restaurantNameAr, 120),
    preferredSlug,
    ownerName: cleanOwnerName,
    ownerEmail: cleanEmail,
    phone: cleanPhone,
    city: clamp(input.city, 100),
    branchCount,
    plan,
    currency,
    primaryColor: clamp(input.primaryColor, 20, "#c8a66a"),
    logoUrl: clamp(input.logoUrl, 200000),
    notes: clamp(input.notes, 600),
    status: "pending" as const,
    provisionedSlug: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, "subscriptionRequests", id), payload);
    return {
      ...payload,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.CREATE,
      `subscriptionRequests/${id}`
    );
  }
}

// ============================================================
// SUPER ADMIN OPERATIONS
// ============================================================

export async function seedInitialDemoDataIfEmpty(
  adminUid: string
): Promise<boolean> {
  try {
    const existingSnap = await getDocs(collection(db, "restaurants"));
    if (!existingSnap.empty) {
      return false;
    }

    // Ensure default platformSettings exist
    const settingsRef = doc(db, "platformSettings", "default");
    const settingsSnap = await getDoc(settingsRef);
    if (!settingsSnap.exists()) {
      await setDoc(settingsRef, {
        ...DEFAULT_PLATFORM_SETTINGS,
        updatedAt: serverTimestamp(),
      });
    }

    const seed = getStarterSeedDataset();
    for (const rest of seed.restaurants) {
      // Step 1: Write parent restaurant doc FIRST so subcollection exists() rule passes
      await setDoc(doc(db, "restaurants", rest.slug), {
        id: rest.id,
        name: clamp(rest.name, 120),
        nameAr: clamp(rest.nameAr, 120),
        slug: rest.slug,
        description: clamp(rest.description, 500),
        descriptionAr: clamp(rest.descriptionAr, 500),
        logoText: clamp(rest.logoText, 4, "Q") || "Q",
        logoUrl: clamp(rest.logoUrl, 200000),
        coverUrl: clamp(rest.coverUrl, 500),
        primaryColor: clamp(rest.primaryColor, 20, "#c8a66a"),
        secondaryColor: clamp(rest.secondaryColor, 20, "#111515"),
        currency: rest.currency,
        defaultLocale: rest.defaultLocale,
        isPublished: rest.isPublished,
        voiceAgentEnabled: rest.voiceAgentEnabled !== false,
        voiceAgentVoice: rest.voiceAgentVoice || "Kore",
        plan: rest.plan,
        status: rest.status,
        ownerUid: adminUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Step 2: Commit subcollections in a batch after parent exists
      const batch = writeBatch(db);
      for (const br of seed.branches.filter((b) => b.restaurantId === rest.id)) {
        batch.set(doc(db, "restaurants", rest.slug, "branches", br.id), {
          id: br.id,
          restaurantId: rest.id,
          name: clamp(br.name, 120),
          address: clamp(br.address, 300),
          phone: clamp(br.phone, 40),
          isActive: br.isActive,
          isPublic: rest.isPublished,
          ownerUid: adminUid,
          createdAt: serverTimestamp(),
        });
      }
      for (const cat of seed.categories.filter((c) => c.restaurantId === rest.id)) {
        batch.set(doc(db, "restaurants", rest.slug, "categories", cat.id), {
          id: cat.id,
          restaurantId: rest.id,
          name: clamp(cat.name, 120),
          nameAr: clamp(cat.nameAr, 120),
          description: clamp(cat.description, 300),
          sortOrder: cat.sortOrder,
          isActive: cat.isActive,
          isPublic: rest.isPublished,
          ownerUid: adminUid,
          createdAt: serverTimestamp(),
        });
      }
      for (const prod of seed.products.filter((p) => p.restaurantId === rest.id)) {
        batch.set(doc(db, "restaurants", rest.slug, "products", prod.id), {
          id: prod.id,
          restaurantId: rest.id,
          categoryId: prod.categoryId,
          name: clamp(prod.name, 140),
          nameAr: clamp(prod.nameAr, 140),
          description: clamp(prod.description, 500),
          descriptionAr: clamp(prod.descriptionAr, 500),
          imageUrl: clamp(prod.imageUrl, 500),
          price: prod.price,
          compareAtPrice: prod.compareAtPrice,
          isAvailable: prod.isAvailable,
          isFeatured: prod.isFeatured,
          sortOrder: prod.sortOrder,
          allergens: prod.allergens.slice(0, 15),
          options: prod.options.slice(0, 15),
          isPublic: rest.isPublished,
          ownerUid: adminUid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      for (const dom of seed.domains.filter((d) => d.restaurantId === rest.id)) {
        const cleanHost = normalizeDomainHost(dom.hostname);
        batch.set(doc(db, "restaurants", rest.slug, "domains", dom.id), {
          id: dom.id,
          restaurantId: rest.id,
          hostname: cleanHost,
          isVerified: dom.isVerified,
          ownerUid: adminUid,
          createdAt: serverTimestamp(),
        });
        if (cleanHost.length >= 3) {
          batch.set(doc(db, "domainRoutes", cleanHost), {
            hostname: cleanHost,
            restaurantId: rest.id,
            slug: rest.slug,
            isVerified: dom.isVerified,
            ownerUid: adminUid,
            updatedAt: serverTimestamp(),
          });
        }
      }
      for (const qr of seed.qrCodes.filter((q) => q.restaurantId === rest.id)) {
        batch.set(doc(db, "restaurants", rest.slug, "qrCodes", qr.id), {
          id: qr.id,
          restaurantId: rest.id,
          branchId: qr.branchId,
          label: clamp(qr.label, 120),
          targetPath: clamp(qr.targetPath, 300),
          token: clamp(qr.token, 120),
          isActive: qr.isActive,
          ownerUid: adminUid,
          createdAt: serverTimestamp(),
        });
      }
      for (const mem of seed.members.filter((m) => m.restaurantId === rest.id)) {
        const mId = mem.id || makeId("inv");
        batch.set(doc(db, "restaurants", rest.slug, "members", mId), {
          restaurantId: rest.id,
          userId: mem.userId,
          email: clamp(mem.email.toLowerCase(), 200),
          fullName: clamp(mem.fullName, 120),
          role: mem.role,
          createdAt: serverTimestamp(),
        });
      }
      if (rest.isPublished) {
        for (const ord of seed.orders.filter((o) => o.restaurantId === rest.id)) {
          batch.set(doc(db, "restaurants", rest.slug, "orders", ord.id), {
            id: ord.id,
            restaurantId: rest.id,
            branchId: ord.branchId,
            orderNumber: ord.orderNumber,
            customerName: clamp(ord.customerName, 120),
            customerPhone: clamp(ord.customerPhone, 40),
            tableLabel: clamp(ord.tableLabel, 60),
            orderType: ord.orderType,
            status: ord.status,
            currency: ord.currency,
            subtotal: ord.subtotal,
            total: ord.total,
            notes: clamp(ord.notes, 400),
            items: ord.items,
            ownerUid: adminUid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      }
      await batch.commit();
    }
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "restaurants");
  }
}

export interface SuperAdminPayload {
  restaurants: Array<
    Restaurant & {
      productCount: number;
      branchCount: number;
      orderCount: number;
      revenue: number;
      primaryDomain: string;
      domainVerified: boolean;
      ownerEmail: string;
    }
  >;
  platformUsers: PublicUser[];
  allMembers: Array<{
    restaurantId: string;
    userId: string;
    email: string;
    fullName: string;
    role: string;
    restaurantName: string;
    restaurantSlug: string;
  }>;
  subscriptionRequests: SubscriptionRequest[];
  settings: PlatformSettings;
  stats: {
    totalRestaurants: number;
    publishedMenus: number;
    totalOrders: number;
    totalProducts: number;
    totalRevenue: number;
    pendingRequests: number;
  };
}

export async function fetchSuperAdminPlatformData(): Promise<SuperAdminPayload> {
  try {
    const [restSnap, adminsSnap, settingsSnap, reqSnap] = await Promise.all([
      getDocs(collection(db, "restaurants")),
      getDocs(collection(db, "platformAdmins")),
      getDoc(doc(db, "platformSettings", "default")),
      getDocs(collection(db, "subscriptionRequests")),
    ]);

    const rawSettings = settingsSnap.exists() ? settingsSnap.data() : null;
    const rawName = String(rawSettings?.platformName || "");
    const rawEmail = String(rawSettings?.supportEmail || "");
    const rawCname = String(rawSettings?.defaultCnameTarget || "");

    const settings: PlatformSettings = rawSettings
      ? {
          platformName:
            !rawName || /qlub/i.test(rawName)
              ? DEFAULT_PLATFORM_SETTINGS.platformName
              : rawName,
          supportEmail:
            !rawEmail || /qlub\.app/i.test(rawEmail)
              ? DEFAULT_PLATFORM_SETTINGS.supportEmail
              : rawEmail,
          defaultCnameTarget:
            !rawCname || /qlub\.app/i.test(rawCname)
              ? DEFAULT_PLATFORM_SETTINGS.defaultCnameTarget
              : rawCname,
          allowSelfServiceOrdering: Boolean(
            rawSettings.allowSelfServiceOrdering ?? true
          ),
          defaultCurrency: String(
            rawSettings.defaultCurrency ||
              DEFAULT_PLATFORM_SETTINGS.defaultCurrency
          ),
        }
      : DEFAULT_PLATFORM_SETTINGS;

    const platformUsers: PublicUser[] = adminsSnap.docs.map((d) => {
      const data = d.data();
      return {
        id: String(data.uid || d.id),
        email: String(data.email || ""),
        fullName: String(data.fullName || "Operator"),
        platformRole: (data.platformRole || "support") as PlatformRole,
      };
    });

    const rawRestaurants = restSnap.docs
      .map((d) => mapRestaurant(d.id, d.data() as Record<string, unknown>))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    let totalOrders = 0;
    let totalProducts = 0;
    let totalRevenue = 0;
    const allMembers: SuperAdminPayload["allMembers"] = [];

    const restaurants = await Promise.all(
      rawRestaurants.map(async (r) => {
        const [prodsSnap, brSnap, domSnap, ordSnap, memSnap] =
          await Promise.all([
            getDocs(collection(db, "restaurants", r.slug, "products")),
            getDocs(collection(db, "restaurants", r.slug, "branches")),
            getDocs(collection(db, "restaurants", r.slug, "domains")),
            getDocs(collection(db, "restaurants", r.slug, "orders")),
            getDocs(collection(db, "restaurants", r.slug, "members")),
          ]);

        const orders = ordSnap.docs.map((d) =>
          mapOrder(d.id, d.data() as Record<string, unknown>)
        );
        const domains = domSnap.docs.map((d) =>
          mapDomain(d.id, d.data() as Record<string, unknown>)
        );
        const members = memSnap.docs.map((d) =>
          mapMember(d.id, d.data() as Record<string, unknown>)
        );

        const restRev = orders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + o.total, 0);

        totalOrders += orders.length;
        totalProducts += prodsSnap.size;
        totalRevenue += restRev;

        for (const m of members) {
          allMembers.push({
            restaurantId: r.id,
            userId: m.userId,
            email: m.email,
            fullName: m.fullName,
            role: m.role,
            restaurantName: r.name,
            restaurantSlug: r.slug,
          });
        }

        return {
          ...r,
          productCount: prodsSnap.size,
          branchCount: brSnap.size,
          orderCount: orders.length,
          revenue: Number(restRev.toFixed(2)),
          primaryDomain: domains[0]?.hostname || `${r.slug}.viral.app`,
          domainVerified: domains[0]?.isVerified ?? false,
          ownerEmail:
            members.find((m) => m.role === "admin")?.email ||
            members[0]?.email ||
            "—",
        };
      })
    );

    const subscriptionRequests = reqSnap.docs
      .map((d) =>
        mapSubscriptionRequest(d.id, d.data() as Record<string, unknown>)
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return {
      restaurants,
      platformUsers,
      allMembers,
      subscriptionRequests,
      settings,
      stats: {
        totalRestaurants: restaurants.length,
        publishedMenus: restaurants.filter((r) => r.isPublished).length,
        totalOrders,
        totalProducts,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        pendingRequests: subscriptionRequests.filter(
          (req) => req.status === "pending"
        ).length,
      },
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "restaurants");
  }
}

export async function updateSubscriptionRequestStatusInFirestore(
  requestId: string,
  status: SubscriptionRequestStatus,
  provisionedSlug = ""
): Promise<void> {
  try {
    await updateDoc(doc(db, "subscriptionRequests", requestId), {
      status,
      provisionedSlug: clamp(provisionedSlug, 100),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.UPDATE,
      `subscriptionRequests/${requestId}`
    );
  }
}

export async function provisionRestaurantInFirestore(
  input: {
    name: string;
    nameAr?: string;
    slug?: string;
    description?: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    currency?: string;
    defaultLocale?: LocaleCode;
    plan?: PlanTier;
    status?: TenantStatus;
    ownerName: string;
    ownerEmail: string;
    branchName?: string;
    customDomain?: string;
  },
  adminUid: string
): Promise<{
  restaurant: Restaurant;
  ownerEmail: string;
  dashboardPath: string;
  publicMenuPath: string;
}> {
  const baseSlug = slugify(input.slug || input.name);
  let finalSlug = baseSlug;
  let counter = 2;

  try {
    while (true) {
      const checkSnap = await getDoc(doc(db, "restaurants", finalSlug));
      if (!checkSnap.exists()) break;
      finalSlug = `${baseSlug}-${counter}`.slice(0, 100);
      counter += 1;
    }

    const isPublished = input.status === "Active";
    const status: TenantStatus = input.status || "Setup";
    const currency = ["SAR", "AED", "USD", "EUR"].includes(
      input.currency || "SAR"
    )
      ? (input.currency as string)
      : "SAR";
    const nowIso = new Date().toISOString();

    const restaurantDocData = {
      id: finalSlug,
      name: clamp(input.name, 120, "Restaurant"),
      nameAr: clamp(input.nameAr, 120, input.name),
      slug: finalSlug,
      description: clamp(
        input.description,
        500,
        "Curated seasonal kitchen, crafted dishes, and table-ready hospitality."
      ),
      descriptionAr: clamp(
        "مطبخ موسمي متجدد وأطباق مختارة بعناية.",
        500
      ),
      logoText: clamp(input.name.trim().charAt(0).toUpperCase(), 4, "Q") || "Q",
      logoUrl: clamp(input.logoUrl, 200000),
      coverUrl: "/images/restaurant_hero_interior.jpg",
      primaryColor: clamp(input.primaryColor, 20, "#c8a66a"),
      secondaryColor: clamp(input.secondaryColor, 20, "#111515"),
      currency,
      defaultLocale: input.defaultLocale === "ar" ? "ar" : "en",
      isPublished,
      voiceAgentEnabled: true,
      voiceAgentVoice: "Kore" as VoiceAgentVoice,
      plan: input.plan || "Starter",
      status,
      ownerUid: adminUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Parent doc must exist before subcollection batch writes
    await setDoc(doc(db, "restaurants", finalSlug), restaurantDocData);

    const batch = writeBatch(db);
    const branchId = makeId("br");
    batch.set(doc(db, "restaurants", finalSlug, "branches", branchId), {
      id: branchId,
      restaurantId: finalSlug,
      name: clamp(input.branchName, 120, "Main Branch"),
      address: "Primary location",
      phone: "",
      isActive: true,
      isPublic: isPublished,
      ownerUid: adminUid,
      createdAt: serverTimestamp(),
    });

    const starterCategories = [
      {
        name: "Starters",
        nameAr: "المقبلات",
        description: "Opening plates & small bites.",
      },
      {
        name: "Mains",
        nameAr: "الأطباق الرئيسية",
        description: "Signature kitchen courses.",
      },
      {
        name: "Desserts",
        nameAr: "الحلويات",
        description: "Sweet finishes & coffee pairings.",
      },
    ];
    let secondCatId = "";
    starterCategories.forEach((cat, idx) => {
      const cid = makeId("cat");
      if (idx === 1) secondCatId = cid;
      batch.set(doc(db, "restaurants", finalSlug, "categories", cid), {
        id: cid,
        restaurantId: finalSlug,
        name: cat.name,
        nameAr: cat.nameAr,
        description: cat.description,
        sortOrder: idx + 1,
        isActive: true,
        isPublic: isPublished,
        ownerUid: adminUid,
        createdAt: serverTimestamp(),
      });
    });

    const prodId = makeId("prod");
    batch.set(doc(db, "restaurants", finalSlug, "products", prodId), {
      id: prodId,
      restaurantId: finalSlug,
      categoryId: secondCatId || null,
      name: "Signature chef dish",
      nameAr: "طبق الشيف المميز",
      description:
        "Customizable starter item — edit price, photo, and options in your menu editor.",
      descriptionAr: "طبق ترحيبي قابل للتعديل من محرر القائمة.",
      imageUrl: "/images/dish_truffle_pasta.jpg",
      price: 64,
      compareAtPrice: null,
      isAvailable: true,
      isFeatured: true,
      sortOrder: 1,
      allergens: [],
      options: [],
      isPublic: isPublished,
      ownerUid: adminUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const qrId = makeId("qr");
    batch.set(doc(db, "restaurants", finalSlug, "qrCodes", qrId), {
      id: qrId,
      restaurantId: finalSlug,
      branchId,
      label: "Main Menu QR",
      targetPath: `/r/${finalSlug}?branch=${branchId}`,
      token: makeId("tok"),
      isActive: true,
      ownerUid: adminUid,
      createdAt: serverTimestamp(),
    });

    if (input.customDomain?.trim()) {
      const cleanHost = normalizeDomainHost(input.customDomain);
      if (cleanHost.length >= 3) {
        const domId = makeId("dom");
        batch.set(doc(db, "restaurants", finalSlug, "domains", domId), {
          id: domId,
          restaurantId: finalSlug,
          hostname: cleanHost,
          isVerified: false,
          ownerUid: adminUid,
          createdAt: serverTimestamp(),
        });
        batch.set(doc(db, "domainRoutes", cleanHost), {
          hostname: cleanHost,
          restaurantId: finalSlug,
          slug: finalSlug,
          isVerified: false,
          ownerUid: adminUid,
          updatedAt: serverTimestamp(),
        });
      }
    }

    const normalizedEmail = clamp(input.ownerEmail.toLowerCase(), 200);
    const inviteId = makeId("inv");
    batch.set(doc(db, "restaurants", finalSlug, "members", inviteId), {
      restaurantId: finalSlug,
      userId: inviteId,
      email: normalizedEmail,
      fullName: clamp(input.ownerName, 120, "Restaurant Owner"),
      role: "admin",
      createdAt: serverTimestamp(),
    });

    await batch.commit();

    return {
      restaurant: {
        ...restaurantDocData,
        defaultLocale: restaurantDocData.defaultLocale as LocaleCode,
        plan: restaurantDocData.plan as PlanTier,
        createdAt: nowIso,
        updatedAt: nowIso,
      },
      ownerEmail: normalizedEmail,
      dashboardPath: `/dashboard/${finalSlug}`,
      publicMenuPath: `/r/${finalSlug}`,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `restaurants/${finalSlug}`);
  }
}

export async function syncRestaurantPublicVisibility(
  slug: string,
  isPublic: boolean
): Promise<void> {
  try {
    const [brSnap, catSnap, prodSnap] = await Promise.all([
      getDocs(collection(db, "restaurants", slug, "branches")),
      getDocs(collection(db, "restaurants", slug, "categories")),
      getDocs(collection(db, "restaurants", slug, "products")),
    ]);
    const batch = writeBatch(db);
    brSnap.docs.forEach((d) => batch.update(d.ref, { isPublic }));
    catSnap.docs.forEach((d) => batch.update(d.ref, { isPublic }));
    prodSnap.docs.forEach((d) =>
      batch.update(d.ref, { isPublic, updatedAt: serverTimestamp() })
    );
    await batch.commit();
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.UPDATE,
      `restaurants/${slug}`
    );
  }
}

export async function updateRestaurantAdmin(
  slug: string,
  patch: Partial<{
    isPublished: boolean;
    plan: PlanTier;
    status: TenantStatus;
  }>
): Promise<void> {
  try {
    await updateDoc(doc(db, "restaurants", slug), {
      ...patch,
      updatedAt: serverTimestamp(),
    });
    if (typeof patch.isPublished === "boolean") {
      await syncRestaurantPublicVisibility(slug, patch.isPublished);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `restaurants/${slug}`);
  }
}

export async function deleteRestaurantCascade(slug: string): Promise<void> {
  try {
    const domainsSnap = await getDocs(
      collection(db, "restaurants", slug, "domains")
    );
    for (const domDoc of domainsSnap.docs) {
      const host = normalizeDomainHost(String(domDoc.data().hostname || ""));
      if (host.length >= 3) {
        try {
          await deleteDoc(doc(db, "domainRoutes", host));
        } catch {
          // Ignore missing route doc
        }
      }
    }
    const subcollections = [
      "branches",
      "categories",
      "products",
      "qrCodes",
      "domains",
      "members",
      "orders",
    ];
    for (const sub of subcollections) {
      const snap = await getDocs(collection(db, "restaurants", slug, sub));
      if (!snap.empty) {
        const batch = writeBatch(db);
        snap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }
    }
    await deleteDoc(doc(db, "restaurants", slug));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `restaurants/${slug}`);
  }
}

export async function addPlatformOperator(input: {
  fullName: string;
  email: string;
  platformRole: PlatformRole;
}): Promise<void> {
  const normalizedEmail = clamp(input.email.toLowerCase(), 200);
  const fullName = clamp(input.fullName, 120, "Operator");
  try {
    let targetUid = makeId("adm");
    const usersSnap = await getDocs(
      query(collection(db, "users"), where("email", "==", normalizedEmail))
    );
    if (!usersSnap.empty) {
      targetUid = usersSnap.docs[0].id;
    }
    await setDoc(doc(db, "platformAdmins", targetUid), {
      uid: targetUid,
      email: normalizedEmail,
      fullName,
      platformRole: input.platformRole,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, "platformAdmins");
  }
}

export async function savePlatformSettingsInFirestore(
  settings: PlatformSettings
): Promise<void> {
  try {
    await setDoc(doc(db, "platformSettings", "default"), {
      platformName: clamp(settings.platformName, 120, "VIRAL Platform"),
      supportEmail: clamp(settings.supportEmail, 200, "support@viral.app"),
      defaultCnameTarget: clamp(
        settings.defaultCnameTarget,
        200,
        "menus.viral.app"
      ),
      allowSelfServiceOrdering: Boolean(settings.allowSelfServiceOrdering),
      defaultCurrency: ["SAR", "AED", "USD", "EUR"].includes(
        settings.defaultCurrency
      )
        ? settings.defaultCurrency
        : "SAR",
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.WRITE,
      "platformSettings/default"
    );
  }
}

// ============================================================
// CLIENT RESTAURANT DASHBOARD OPERATIONS
// ============================================================

export async function ensureMembershipAndLoadDashboard(
  slug: string,
  currentUser: PublicUser,
  isPlatformAdmin: boolean
): Promise<{
  bundle: RestaurantBundle | null;
  cnameTarget: string;
  accessDenied: boolean;
}> {
  try {
    // 1. If not platform admin, claim email-based invite if not already claimed under user.id
    if (!isPlatformAdmin) {
      try {
        const directMemberSnap = await getDoc(
          doc(db, "restaurants", slug, "members", currentUser.id)
        );
        if (!directMemberSnap.exists() && currentUser.email) {
          const inviteSnap = await getDocs(
            query(
              collection(db, "restaurants", slug, "members"),
              where("email", "==", currentUser.email.toLowerCase())
            )
          );
          if (!inviteSnap.empty) {
            const inviteDoc = inviteSnap.docs[0];
            const invData = inviteDoc.data();
            await setDoc(
              doc(db, "restaurants", slug, "members", currentUser.id),
              {
                restaurantId: String(invData.restaurantId || slug),
                userId: currentUser.id,
                email: currentUser.email.toLowerCase(),
                fullName: clamp(
                  String(invData.fullName || currentUser.fullName),
                  120,
                  "Member"
                ),
                role: (invData.role || "manager") as RestaurantRole,
                claimedFromId: inviteDoc.id,
                createdAt: serverTimestamp(),
              }
            );
          }
        }
      } catch {
        // Ignore claim error; subsequent getDoc determines access cleanly
      }
    }

    // 2. Fetch restaurant doc
    let restSnap;
    try {
      restSnap = await getDoc(doc(db, "restaurants", slug));
    } catch {
      return {
        bundle: null,
        cnameTarget: DEFAULT_PLATFORM_SETTINGS.defaultCnameTarget,
        accessDenied: true,
      };
    }

    if (!restSnap.exists()) {
      return {
        bundle: null,
        cnameTarget: DEFAULT_PLATFORM_SETTINGS.defaultCnameTarget,
        accessDenied: false,
      };
    }

    const restaurant = mapRestaurant(
      restSnap.id,
      restSnap.data() as Record<string, unknown>
    );

    // 3. Verify write authorization
    if (!isPlatformAdmin && restaurant.ownerUid !== currentUser.id) {
      const memSnap = await getDoc(
        doc(db, "restaurants", slug, "members", currentUser.id)
      );
      if (!memSnap.exists()) {
        return {
          bundle: null,
          cnameTarget: DEFAULT_PLATFORM_SETTINGS.defaultCnameTarget,
          accessDenied: true,
        };
      }
    }

    // 4. Load full bundle in parallel
    const [
      brSnap,
      catSnap,
      prodSnap,
      domSnap,
      qrSnap,
      memSnap,
      ordSnap,
      settingsSnap,
    ] = await Promise.all([
      getDocs(collection(db, "restaurants", slug, "branches")),
      getDocs(collection(db, "restaurants", slug, "categories")),
      getDocs(collection(db, "restaurants", slug, "products")),
      getDocs(collection(db, "restaurants", slug, "domains")),
      getDocs(collection(db, "restaurants", slug, "qrCodes")),
      getDocs(collection(db, "restaurants", slug, "members")),
      getDocs(collection(db, "restaurants", slug, "orders")),
      getDoc(doc(db, "platformSettings", "default")),
    ]);

    const rawCname = settingsSnap.exists()
      ? String(settingsSnap.data().defaultCnameTarget || "")
      : "";
    const cnameTarget =
      !rawCname || /qlub\.app/i.test(rawCname)
        ? DEFAULT_PLATFORM_SETTINGS.defaultCnameTarget
        : rawCname;

    return {
      accessDenied: false,
      cnameTarget,
      bundle: {
        restaurant,
        branches: brSnap.docs.map((d) =>
          mapBranch(d.id, d.data() as Record<string, unknown>)
        ),
        categories: catSnap.docs
          .map((d) => mapCategory(d.id, d.data() as Record<string, unknown>))
          .sort((a, b) => a.sortOrder - b.sortOrder),
        products: prodSnap.docs
          .map((d) => mapProduct(d.id, d.data() as Record<string, unknown>))
          .sort((a, b) => a.sortOrder - b.sortOrder),
        domains: domSnap.docs.map((d) =>
          mapDomain(d.id, d.data() as Record<string, unknown>)
        ),
        qrCodes: qrSnap.docs.map((d) =>
          mapQrCode(d.id, d.data() as Record<string, unknown>)
        ),
        members: memSnap.docs.map((d) =>
          mapMember(d.id, d.data() as Record<string, unknown>)
        ),
        orders: ordSnap.docs
          .map((d) => mapOrder(d.id, d.data() as Record<string, unknown>))
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
      },
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `restaurants/${slug}`);
  }
}

export async function saveRestaurantBrandInFirestore(
  slug: string,
  patch: Partial<Restaurant>,
  previousPublished?: boolean
): Promise<void> {
  try {
    const clean: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };
    if (patch.name !== undefined) clean.name = clamp(patch.name, 120, "Menu");
    if (patch.nameAr !== undefined) clean.nameAr = clamp(patch.nameAr, 120);
    if (patch.description !== undefined)
      clean.description = clamp(patch.description, 500);
    if (patch.descriptionAr !== undefined)
      clean.descriptionAr = clamp(patch.descriptionAr, 500);
    if (patch.logoText !== undefined)
      clean.logoText = clamp(patch.logoText, 4, "Q") || "Q";
    if (patch.logoUrl !== undefined)
      clean.logoUrl = clamp(patch.logoUrl, 200000);
    if (patch.coverUrl !== undefined)
      clean.coverUrl = clamp(patch.coverUrl, 500);
    if (patch.primaryColor !== undefined)
      clean.primaryColor = clamp(patch.primaryColor, 20, "#c8a66a");
    if (patch.secondaryColor !== undefined)
      clean.secondaryColor = clamp(patch.secondaryColor, 20, "#111515");
    if (patch.currency !== undefined)
      clean.currency = ["SAR", "AED", "USD", "EUR"].includes(patch.currency)
        ? patch.currency
        : "SAR";
    if (patch.defaultLocale !== undefined)
      clean.defaultLocale = patch.defaultLocale === "ar" ? "ar" : "en";
    if (patch.isPublished !== undefined) clean.isPublished = patch.isPublished;
    if (typeof patch.voiceAgentEnabled === "boolean") {
      clean.voiceAgentEnabled = patch.voiceAgentEnabled;
    }
    if (
      patch.voiceAgentVoice !== undefined &&
      ["Kore", "Charon", "Puck", "Fenrir", "Zephyr"].includes(
        patch.voiceAgentVoice
      )
    ) {
      clean.voiceAgentVoice = patch.voiceAgentVoice;
    }

    await updateDoc(doc(db, "restaurants", slug), clean);
    if (
      typeof patch.isPublished === "boolean" &&
      patch.isPublished !== previousPublished
    ) {
      await syncRestaurantPublicVisibility(slug, patch.isPublished);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `restaurants/${slug}`);
  }
}

export async function addCategoryInFirestore(
  slug: string,
  restaurant: Restaurant,
  input: { name: string; nameAr: string; description: string; sortOrder: number }
): Promise<void> {
  const id = makeId("cat");
  try {
    await setDoc(doc(db, "restaurants", slug, "categories", id), {
      id,
      restaurantId: restaurant.id,
      name: clamp(input.name, 120, "Category"),
      nameAr: clamp(input.nameAr, 120),
      description: clamp(input.description, 300),
      sortOrder: input.sortOrder,
      isActive: true,
      isPublic: restaurant.isPublished,
      ownerUid: restaurant.ownerUid || "",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.CREATE,
      `restaurants/${slug}/categories/${id}`
    );
  }
}

export async function toggleCategoryActiveInFirestore(
  slug: string,
  id: string,
  isActive: boolean
): Promise<void> {
  try {
    await updateDoc(doc(db, "restaurants", slug, "categories", id), {
      isActive,
    });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.UPDATE,
      `restaurants/${slug}/categories/${id}`
    );
  }
}

export async function deleteCategoryInFirestore(
  slug: string,
  id: string
): Promise<void> {
  try {
    await deleteDoc(doc(db, "restaurants", slug, "categories", id));
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.DELETE,
      `restaurants/${slug}/categories/${id}`
    );
  }
}

export async function saveProductInFirestore(
  slug: string,
  restaurant: Restaurant,
  input: {
    id?: string;
    categoryId: string | null;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    imageUrl: string;
    price: number;
    compareAtPrice: number | null;
    isAvailable: boolean;
    isFeatured: boolean;
    sortOrder: number;
    allergens: string[];
    options: ProductOption[];
  }
): Promise<void> {
  const id = input.id || makeId("prod");
  const isUpdate = Boolean(input.id);
  const path = `restaurants/${slug}/products/${id}`;
  try {
    const baseFields = {
      categoryId: input.categoryId || null,
      name: clamp(input.name, 140, "Dish"),
      nameAr: clamp(input.nameAr, 140),
      description: clamp(input.description, 500),
      descriptionAr: clamp(input.descriptionAr, 500),
      imageUrl: clamp(input.imageUrl, 200000, "/images/dish_truffle_pasta.jpg"),
      price: Math.max(0, Number(input.price) || 0),
      compareAtPrice:
        input.compareAtPrice !== null && input.compareAtPrice >= 0
          ? Number(input.compareAtPrice)
          : null,
      isAvailable: Boolean(input.isAvailable),
      isFeatured: Boolean(input.isFeatured),
      sortOrder: Number(input.sortOrder) || 1,
      allergens: input.allergens.slice(0, 15).map((s) => clamp(s, 40)),
      options: input.options.slice(0, 15),
      isPublic: restaurant.isPublished,
      ownerUid: restaurant.ownerUid || "",
      updatedAt: serverTimestamp(),
    };
    if (isUpdate) {
      await updateDoc(doc(db, "restaurants", slug, "products", id), baseFields);
    } else {
      await setDoc(doc(db, "restaurants", slug, "products", id), {
        id,
        restaurantId: restaurant.id,
        ...baseFields,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(
      error,
      isUpdate ? OperationType.UPDATE : OperationType.CREATE,
      path
    );
  }
}

export async function toggleProductAvailabilityInFirestore(
  slug: string,
  id: string,
  isAvailable: boolean
): Promise<void> {
  try {
    await updateDoc(doc(db, "restaurants", slug, "products", id), {
      isAvailable,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.UPDATE,
      `restaurants/${slug}/products/${id}`
    );
  }
}

export async function deleteProductInFirestore(
  slug: string,
  id: string
): Promise<void> {
  try {
    await deleteDoc(doc(db, "restaurants", slug, "products", id));
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.DELETE,
      `restaurants/${slug}/products/${id}`
    );
  }
}

export async function addBranchInFirestore(
  slug: string,
  restaurant: Restaurant,
  input: { name: string; address: string; phone: string }
): Promise<void> {
  const id = makeId("br");
  try {
    await setDoc(doc(db, "restaurants", slug, "branches", id), {
      id,
      restaurantId: restaurant.id,
      name: clamp(input.name, 120, "Branch"),
      address: clamp(input.address, 300),
      phone: clamp(input.phone, 40),
      isActive: true,
      isPublic: restaurant.isPublished,
      ownerUid: restaurant.ownerUid || "",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.CREATE,
      `restaurants/${slug}/branches/${id}`
    );
  }
}

export async function deleteBranchInFirestore(
  slug: string,
  id: string
): Promise<void> {
  try {
    await deleteDoc(doc(db, "restaurants", slug, "branches", id));
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.DELETE,
      `restaurants/${slug}/branches/${id}`
    );
  }
}

export async function createQrCodeInFirestore(
  slug: string,
  restaurant: Restaurant,
  input: { label: string; branchId: string | null; tableNumber: string }
): Promise<void> {
  const id = makeId("qr");
  const params = new URLSearchParams();
  if (input.branchId) params.set("branch", input.branchId);
  if (input.tableNumber.trim()) params.set("table", input.tableNumber.trim());
  const qs = params.toString();
  const targetPath = `/r/${slug}${qs ? `?${qs}` : ""}`;

  try {
    await setDoc(doc(db, "restaurants", slug, "qrCodes", id), {
      id,
      restaurantId: restaurant.id,
      branchId: input.branchId || null,
      label: clamp(input.label, 120, "Table QR"),
      targetPath: clamp(targetPath, 300),
      token: makeId("tok"),
      isActive: true,
      ownerUid: restaurant.ownerUid || "",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.CREATE,
      `restaurants/${slug}/qrCodes/${id}`
    );
  }
}

export async function deleteQrCodeInFirestore(
  slug: string,
  id: string
): Promise<void> {
  try {
    await deleteDoc(doc(db, "restaurants", slug, "qrCodes", id));
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.DELETE,
      `restaurants/${slug}/qrCodes/${id}`
    );
  }
}

export async function updateOrderStatusInFirestore(
  slug: string,
  orderId: string,
  status: OrderStatus
): Promise<void> {
  try {
    await updateDoc(doc(db, "restaurants", slug, "orders", orderId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.UPDATE,
      `restaurants/${slug}/orders/${orderId}`
    );
  }
}

export async function addDomainInFirestore(
  slug: string,
  restaurant: Restaurant,
  hostname: string
): Promise<void> {
  const id = makeId("dom");
  const cleanHost = normalizeDomainHost(hostname);
  if (cleanHost.length < 3) {
    throw new Error("Enter a valid domain hostname (e.g. menu.yourbrand.com).");
  }
  try {
    await setDoc(doc(db, "restaurants", slug, "domains", id), {
      id,
      restaurantId: restaurant.id,
      hostname: cleanHost,
      isVerified: false,
      ownerUid: restaurant.ownerUid || "",
      createdAt: serverTimestamp(),
    });
    await setDoc(doc(db, "domainRoutes", cleanHost), {
      hostname: cleanHost,
      restaurantId: restaurant.id,
      slug,
      isVerified: false,
      ownerUid: restaurant.ownerUid || "",
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.CREATE,
      `restaurants/${slug}/domains/${id}`
    );
  }
}

export async function verifyDomainInFirestore(
  slug: string,
  id: string
): Promise<void> {
  try {
    const domRef = doc(db, "restaurants", slug, "domains", id);
    const domSnap = await getDoc(domRef);
    await updateDoc(domRef, {
      isVerified: true,
    });
    if (domSnap.exists()) {
      const cleanHost = normalizeDomainHost(
        String(domSnap.data().hostname || "")
      );
      if (cleanHost.length >= 3) {
        const routeRef = doc(db, "domainRoutes", cleanHost);
        const routeSnap = await getDoc(routeRef);
        if (routeSnap.exists()) {
          await updateDoc(routeRef, {
            isVerified: true,
            updatedAt: serverTimestamp(),
          });
        } else {
          await setDoc(routeRef, {
            hostname: cleanHost,
            restaurantId: String(domSnap.data().restaurantId || slug),
            slug,
            isVerified: true,
            ownerUid: String(domSnap.data().ownerUid || ""),
            updatedAt: serverTimestamp(),
          });
        }
      }
    }
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.UPDATE,
      `restaurants/${slug}/domains/${id}`
    );
  }
}

export async function deleteDomainInFirestore(
  slug: string,
  id: string
): Promise<void> {
  try {
    const domRef = doc(db, "restaurants", slug, "domains", id);
    const domSnap = await getDoc(domRef);
    if (domSnap.exists()) {
      const cleanHost = normalizeDomainHost(
        String(domSnap.data().hostname || "")
      );
      if (cleanHost.length >= 3) {
        try {
          await deleteDoc(doc(db, "domainRoutes", cleanHost));
        } catch {
          // Ignore missing route doc
        }
      }
    }
    await deleteDoc(domRef);
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.DELETE,
      `restaurants/${slug}/domains/${id}`
    );
  }
}

export async function addRestaurantMemberInFirestore(
  slug: string,
  restaurant: Restaurant,
  input: { fullName: string; email: string; role: RestaurantRole }
): Promise<RestaurantMember> {
  const normalizedEmail = clamp(input.email.toLowerCase(), 200);
  const fullName = clamp(input.fullName, 120, "Staff Member");
  const memberId = makeId("inv");
  try {
    await setDoc(doc(db, "restaurants", slug, "members", memberId), {
      restaurantId: restaurant.id,
      userId: memberId,
      email: normalizedEmail,
      fullName,
      role: input.role,
      createdAt: serverTimestamp(),
    });
    return {
      id: memberId,
      restaurantId: restaurant.id,
      userId: memberId,
      email: normalizedEmail,
      fullName,
      role: input.role,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.CREATE,
      `restaurants/${slug}/members/${memberId}`
    );
  }
}

export async function removeRestaurantMemberInFirestore(
  slug: string,
  memberDocId: string
): Promise<void> {
  try {
    await deleteDoc(doc(db, "restaurants", slug, "members", memberDocId));
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.DELETE,
      `restaurants/${slug}/members/${memberDocId}`
    );
  }
}
