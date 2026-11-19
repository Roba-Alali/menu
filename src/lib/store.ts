import crypto from "crypto";
import fs from "fs";
import path from "path";
import type {
  Branch,
  MenuCategory,
  Order,
  OrderItem,
  OrderStatus,
  PlanTier,
  PlatformStore,
  Product,
  PublicUser,
  QrCodeRecord,
  Restaurant,
  RestaurantBundle,
  RestaurantDomain,
  RestaurantMember,
  RestaurantRole,
  TenantStatus,
  UserAccount,
} from "./types";

const STORE_FILE = path.join("/tmp", "qlub-platform-store.json");

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, keyHex] = storedHash.split(":");
  if (!salt || !keyHex) return false;
  const keyBuf = Buffer.from(keyHex, "hex");
  const derived = crypto.scryptSync(password, salt, 64);
  if (keyBuf.length !== derived.length) return false;
  return crypto.timingSafeEqual(keyBuf, derived);
}

export function toPublicUser(user: UserAccount): PublicUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    platformRole: user.platformRole,
  };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "restaurant";
}

function createInitialStore(): PlatformStore {
  const now = new Date().toISOString();
  const ownerId = "usr-platform-owner";
  const supportId = "usr-platform-support";
  const houseOwnerId = "usr-house-admin";
  const oliveOwnerId = "usr-olive-admin";
  const roastOwnerId = "usr-roast-admin";

  const houseId = "rest-the-house";
  const oliveId = "rest-olive-garden";
  const roastId = "rest-roast-co";

  const users: UserAccount[] = [
    {
      id: ownerId,
      email: "owner@qlub.app",
      fullName: "Tariq Al-Mansoor",
      passwordHash: hashPassword("QlubOwner2026!"),
      platformRole: "owner",
      createdAt: now,
    },
    {
      id: supportId,
      email: "support@qlub.app",
      fullName: "Lina Haddad",
      passwordHash: hashPassword("QlubSupport2026!"),
      platformRole: "support",
      createdAt: now,
    },
    {
      id: houseOwnerId,
      email: "house@thehouse.com",
      fullName: "Noura Al-Faisal",
      passwordHash: hashPassword("HouseMenu2026!"),
      createdAt: now,
    },
    {
      id: oliveOwnerId,
      email: "olive@olivegarden.com",
      fullName: "Sami Khoury",
      passwordHash: hashPassword("OliveMenu2026!"),
      createdAt: now,
    },
    {
      id: roastOwnerId,
      email: "roast@roastco.com",
      fullName: "Omar Al-Zahrani",
      passwordHash: hashPassword("RoastMenu2026!"),
      createdAt: now,
    },
  ];

  const restaurants: Restaurant[] = [
    {
      id: houseId,
      name: "The House",
      nameAr: "ذا هاوس",
      slug: "the-house",
      description: "Seasonal ingredients, wood-fired craft, and moments made around the table.",
      descriptionAr: "مكونات موسمية، طهي مدروس، ولحظات تُصنع حول المائدة.",
      logoText: "H",
      coverUrl: "/images/restaurant_hero_interior.jpg",
      primaryColor: "#c8a66a",
      secondaryColor: "#111515",
      currency: "SAR",
      defaultLocale: "en",
      isPublished: true,
      plan: "Growth",
      status: "Active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: oliveId,
      name: "Olive Garden Café",
      nameAr: "مقهى أوليف جاردن",
      slug: "olive-garden",
      description: "Mediterranean small plates, artisan sourdough, and botanical infusions.",
      descriptionAr: "أطباق متوسطية خفيفة، خبز الساوردو الحرفي، ومشروبات نباتية.",
      logoText: "O",
      coverUrl: "/images/restaurant_hero_interior.jpg",
      primaryColor: "#8ea879",
      secondaryColor: "#111613",
      currency: "SAR",
      defaultLocale: "en",
      isPublished: true,
      plan: "Starter",
      status: "Active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: roastId,
      name: "Roast & Co.",
      nameAr: "روست أند كو",
      slug: "roast-co",
      description: "Single-origin espresso bar and plated evening pastries.",
      descriptionAr: "قهوة مختصة أحادية المصدر ومعجنات مسائية فاخرة.",
      logoText: "R",
      coverUrl: "/images/restaurant_hero_interior.jpg",
      primaryColor: "#d3915a",
      secondaryColor: "#15110e",
      currency: "AED",
      defaultLocale: "en",
      isPublished: false,
      plan: "Starter",
      status: "Setup",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const members: RestaurantMember[] = [
    {
      restaurantId: houseId,
      userId: houseOwnerId,
      email: "house@thehouse.com",
      fullName: "Noura Al-Faisal",
      role: "admin",
      createdAt: now,
    },
    {
      restaurantId: oliveId,
      userId: oliveOwnerId,
      email: "olive@olivegarden.com",
      fullName: "Sami Khoury",
      role: "admin",
      createdAt: now,
    },
    {
      restaurantId: roastId,
      userId: roastOwnerId,
      email: "roast@roastco.com",
      fullName: "Omar Al-Zahrani",
      role: "admin",
      createdAt: now,
    },
  ];

  const branches: Branch[] = [
    {
      id: "br-house-olaya",
      restaurantId: houseId,
      name: "Riyadh · Olaya Flagship",
      address: "Tahlia Street, Olaya District, Riyadh",
      phone: "+966 11 450 9200",
      isActive: true,
      createdAt: now,
    },
    {
      id: "br-house-jeddah",
      restaurantId: houseId,
      name: "Jeddah · Corniche Terrace",
      address: "North Corniche Road, Jeddah",
      phone: "+966 12 610 4800",
      isActive: true,
      createdAt: now,
    },
    {
      id: "br-olive-main",
      restaurantId: oliveId,
      name: "Al Khobar · Waterfront",
      address: "Prince Faisal Bin Fahd Road, Al Khobar",
      phone: "+966 13 882 1140",
      isActive: true,
      createdAt: now,
    },
    {
      id: "br-roast-main",
      restaurantId: roastId,
      name: "Dubai · DIFC Gate",
      address: "Gate Village 04, DIFC, Dubai",
      phone: "+971 4 388 2210",
      isActive: true,
      createdAt: now,
    },
  ];

  const categories: MenuCategory[] = [
    {
      id: "cat-house-starters",
      restaurantId: houseId,
      name: "Starters",
      nameAr: "المقبلات",
      description: "Cold & warm plates crafted to begin the table.",
      sortOrder: 1,
      isActive: true,
      createdAt: now,
    },
    {
      id: "cat-house-signature",
      restaurantId: houseId,
      name: "Signature",
      nameAr: "أطباقنا المميزة",
      description: "House-made pasta and chef signature courses.",
      sortOrder: 2,
      isActive: true,
      createdAt: now,
    },
    {
      id: "cat-house-mains",
      restaurantId: houseId,
      name: "Mains",
      nameAr: "الأطباق الرئيسية",
      description: "Charcoal-grilled seafood and prime cuts.",
      sortOrder: 3,
      isActive: true,
      createdAt: now,
    },
    {
      id: "cat-house-desserts",
      restaurantId: houseId,
      name: "Desserts",
      nameAr: "الحلويات",
      description: "Artisanal pastry and plated finishes.",
      sortOrder: 4,
      isActive: true,
      createdAt: now,
    },
    {
      id: "cat-olive-plates",
      restaurantId: oliveId,
      name: "Mediterranean Plates",
      nameAr: "أطباق متوسطية",
      description: "Fresh seasonal salads and artisanal breads.",
      sortOrder: 1,
      isActive: true,
      createdAt: now,
    },
    {
      id: "cat-olive-desserts",
      restaurantId: oliveId,
      name: "Sweets & Café",
      nameAr: "حلويات وقهوة",
      description: "Layered pastries and specialty pours.",
      sortOrder: 2,
      isActive: true,
      createdAt: now,
    },
    {
      id: "cat-roast-pastry",
      restaurantId: roastId,
      name: "Artisan Pastry",
      nameAr: "معجنات حرفية",
      description: "Morning laminated pastry and signature desserts.",
      sortOrder: 1,
      isActive: true,
      createdAt: now,
    },
  ];

  const products: Product[] = [
    {
      id: "prod-house-burrata",
      restaurantId: houseId,
      categoryId: "cat-house-starters",
      name: "Burrata & heirloom tomato",
      nameAr: "بوراتا وطماطم إرلوم",
      description: "Fresh Pugliese burrata, emerald basil oil, and charred sourdough.",
      descriptionAr: "جبنة بوراتا طازجة مع زيت الريحان وخبز الساوردو المحمص.",
      imageUrl: "/images/dish_burrata_tomato.jpg",
      price: 54,
      compareAtPrice: null,
      isAvailable: true,
      isFeatured: false,
      sortOrder: 1,
      allergens: ["Dairy", "Gluten"],
      options: [
        {
          id: "opt-burrata-bread",
          name: "Bread pairing",
          isRequired: false,
          minSelect: 0,
          maxSelect: 1,
          values: [
            { id: "val-sourdough", name: "Extra grilled sourdough", priceDelta: 8 },
            { id: "val-glutenfree", name: "Seeded gluten-free crisps", priceDelta: 10 },
          ],
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "prod-house-truffle",
      restaurantId: houseId,
      categoryId: "cat-house-signature",
      name: "Truffle tagliatelle",
      nameAr: "تالياتيلي بالكمأة السوداء",
      description: "Handmade egg ribbon pasta, wild mushroom emulsion, 24-month parmesan.",
      descriptionAr: "باستا طازجة يدوية الصنع مع الفطر البري وجبنة البارميزان المعتقة.",
      imageUrl: "/images/dish_truffle_pasta.jpg",
      price: 68,
      compareAtPrice: 76,
      isAvailable: true,
      isFeatured: true,
      sortOrder: 2,
      allergens: ["Dairy", "Gluten", "Egg"],
      options: [
        {
          id: "opt-truffle-size",
          name: "Portion",
          isRequired: true,
          minSelect: 1,
          maxSelect: 1,
          values: [
            { id: "val-reg", name: "Regular", priceDelta: 0 },
            { id: "val-share", name: "Sharing table size", priceDelta: 34 },
          ],
        },
        {
          id: "opt-truffle-add",
          name: "Enhancements",
          isRequired: false,
          minSelect: 0,
          maxSelect: 2,
          values: [
            { id: "val-shaved", name: "Fresh shaved black truffle (3g)", priceDelta: 28 },
            { id: "val-parm", name: "Aged parmesan crisp", priceDelta: 10 },
          ],
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "prod-house-salmon",
      restaurantId: houseId,
      categoryId: "cat-house-mains",
      name: "Charcoal grilled salmon",
      nameAr: "سلمون مشوي على الفحم",
      description: "Wild Atlantic fillet glazed with herb butter, charred broccolini, Meyer lemon.",
      descriptionAr: "فيليه سلمون بري مشوي مع زبدة الأعشاب والخضار الموسمية.",
      imageUrl: "/images/dish_grilled_salmon.jpg",
      price: 92,
      compareAtPrice: null,
      isAvailable: true,
      isFeatured: true,
      sortOrder: 3,
      allergens: ["Fish", "Dairy"],
      options: [
        {
          id: "opt-salmon-cook",
          name: "Preparation",
          isRequired: true,
          minSelect: 1,
          maxSelect: 1,
          values: [
            { id: "val-med", name: "Medium (Recommended)", priceDelta: 0 },
            { id: "val-well", name: "Well done", priceDelta: 0 },
          ],
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "prod-house-pistachio",
      restaurantId: houseId,
      categoryId: "cat-house-desserts",
      name: "Pistachio cloud",
      nameAr: "سحابة الفستق",
      description: "Caramelized puff pastry layers, whipped pistachio cream, roasted Sicilian pistachios.",
      descriptionAr: "رقائق باستري مقرمشة محشوة بكريمة الفستق الغنية والفستق المحمص.",
      imageUrl: "/images/dish_pistachio_dessert.jpg",
      price: 42,
      compareAtPrice: null,
      isAvailable: true,
      isFeatured: false,
      sortOrder: 4,
      allergens: ["Dairy", "Gluten", "Tree Nuts"],
      options: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "prod-olive-burrata",
      restaurantId: oliveId,
      categoryId: "cat-olive-plates",
      name: "Heirloom tomato & burrata",
      nameAr: "بوراتا والطماطم الموسمية",
      description: "Cold-pressed olive oil, basil leaves, wood-fired country toast.",
      descriptionAr: "زيت زيتون بكر مع أوراق الريحان وخبز محمص.",
      imageUrl: "/images/dish_burrata_tomato.jpg",
      price: 48,
      compareAtPrice: null,
      isAvailable: true,
      isFeatured: true,
      sortOrder: 1,
      allergens: ["Dairy", "Gluten"],
      options: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "prod-olive-pistachio",
      restaurantId: oliveId,
      categoryId: "cat-olive-desserts",
      name: "Pistachio mille-feuille",
      nameAr: "ميل فوي الفستق",
      description: "Flaky butter pastry with lightly sweetened pistachio mousseline.",
      descriptionAr: "طبقات باستري مقرمشة مع كريمة الفستق الناعمة.",
      imageUrl: "/images/dish_pistachio_dessert.jpg",
      price: 38,
      compareAtPrice: null,
      isAvailable: true,
      isFeatured: false,
      sortOrder: 2,
      allergens: ["Dairy", "Gluten", "Tree Nuts"],
      options: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "prod-roast-pistachio",
      restaurantId: roastId,
      categoryId: "cat-roast-pastry",
      name: "Roasted pistachio feuilleté",
      nameAr: "فويتي الفستق المحمص",
      description: "Paired with single-origin pour-over or cortado.",
      descriptionAr: "تُقدم مع القهوة المختصة أو الكورتادو.",
      imageUrl: "/images/dish_pistachio_dessert.jpg",
      price: 36,
      compareAtPrice: null,
      isAvailable: true,
      isFeatured: true,
      sortOrder: 1,
      allergens: ["Dairy", "Gluten", "Tree Nuts"],
      options: [],
      createdAt: now,
      updatedAt: now,
    },
  ];

  const domains: RestaurantDomain[] = [
    {
      id: "dom-house-1",
      restaurantId: houseId,
      hostname: "thehouse.example.com",
      isVerified: true,
      createdAt: now,
    },
    {
      id: "dom-olive-1",
      restaurantId: oliveId,
      hostname: "olive.example.com",
      isVerified: true,
      createdAt: now,
    },
    {
      id: "dom-roast-1",
      restaurantId: roastId,
      hostname: "roast.example.com",
      isVerified: false,
      createdAt: now,
    },
  ];

  const qrCodes: QrCodeRecord[] = [
    {
      id: "qr-house-main",
      restaurantId: houseId,
      branchId: "br-house-olaya",
      label: "Olaya · Table 04",
      targetPath: "/r/the-house?branch=br-house-olaya&table=04",
      token: "th-olaya-t04",
      isActive: true,
      createdAt: now,
    },
    {
      id: "qr-house-terrace",
      restaurantId: houseId,
      branchId: "br-house-jeddah",
      label: "Jeddah · Terrace 11",
      targetPath: "/r/the-house?branch=br-house-jeddah&table=11",
      token: "th-jeddah-t11",
      isActive: true,
      createdAt: now,
    },
    {
      id: "qr-olive-main",
      restaurantId: oliveId,
      branchId: "br-olive-main",
      label: "Waterfront · Main Menu",
      targetPath: "/r/olive-garden?branch=br-olive-main",
      token: "og-main-menu",
      isActive: true,
      createdAt: now,
    },
  ];

  const orders: Order[] = [
    {
      id: "ord-1001",
      restaurantId: houseId,
      branchId: "br-house-olaya",
      orderNumber: 1001,
      customerName: "Faisal Al-Harbi",
      customerPhone: "+966 55 312 8890",
      tableLabel: "Table 04",
      orderType: "dine_in",
      status: "preparing",
      currency: "SAR",
      subtotal: 202,
      total: 202,
      notes: "No garlic on the side greens",
      items: [
        {
          id: "oi-1",
          productId: "prod-house-truffle",
          productNameSnapshot: "Truffle tagliatelle",
          quantity: 1,
          unitPrice: 68,
          optionsSnapshot: [{ optionName: "Portion", valueName: "Regular", priceDelta: 0 }],
        },
        {
          id: "oi-2",
          productId: "prod-house-salmon",
          productNameSnapshot: "Charcoal grilled salmon",
          quantity: 1,
          unitPrice: 92,
          optionsSnapshot: [{ optionName: "Preparation", valueName: "Medium (Recommended)", priceDelta: 0 }],
        },
        {
          id: "oi-3",
          productId: "prod-house-pistachio",
          productNameSnapshot: "Pistachio cloud",
          quantity: 1,
          unitPrice: 42,
          optionsSnapshot: [],
        },
      ],
      createdAt: new Date(Date.now() - 18 * 60_000).toISOString(),
    },
    {
      id: "ord-1002",
      restaurantId: houseId,
      branchId: "br-house-jeddah",
      orderNumber: 1002,
      customerName: "Reem Al-Qahtani",
      customerPhone: "+966 50 944 1201",
      tableLabel: "Pickup",
      orderType: "pickup",
      status: "pending",
      currency: "SAR",
      subtotal: 122,
      total: 122,
      notes: "Arrive in 15 mins",
      items: [
        {
          id: "oi-4",
          productId: "prod-house-burrata",
          productNameSnapshot: "Burrata & heirloom tomato",
          quantity: 1,
          unitPrice: 54,
          optionsSnapshot: [],
        },
        {
          id: "oi-5",
          productId: "prod-house-truffle",
          productNameSnapshot: "Truffle tagliatelle",
          quantity: 1,
          unitPrice: 68,
          optionsSnapshot: [],
        },
      ],
      createdAt: new Date(Date.now() - 6 * 60_000).toISOString(),
    },
    {
      id: "ord-1003",
      restaurantId: oliveId,
      branchId: "br-olive-main",
      orderNumber: 1003,
      customerName: "Yousef Salem",
      customerPhone: "+966 54 700 3319",
      tableLabel: "Table 02",
      orderType: "dine_in",
      status: "completed",
      currency: "SAR",
      subtotal: 86,
      total: 86,
      notes: "",
      items: [
        {
          id: "oi-6",
          productId: "prod-olive-burrata",
          productNameSnapshot: "Heirloom tomato & burrata",
          quantity: 1,
          unitPrice: 48,
          optionsSnapshot: [],
        },
        {
          id: "oi-7",
          productId: "prod-olive-pistachio",
          productNameSnapshot: "Pistachio mille-feuille",
          quantity: 1,
          unitPrice: 38,
          optionsSnapshot: [],
        },
      ],
      createdAt: new Date(Date.now() - 95 * 60_000).toISOString(),
    },
  ];

  return {
    users,
    restaurants,
    members,
    branches,
    categories,
    products,
    domains,
    qrCodes,
    orders,
    passwordResets: [],
    nextOrderNumber: 1004,
    settings: {
      platformName: "QLUB Platform",
      supportEmail: "support@qlub.app",
      defaultCnameTarget: "menus.qlub.app",
      allowSelfServiceOrdering: true,
      defaultCurrency: "SAR",
    },
  };
}

const globalForStore = globalThis as unknown as { __qlubStore?: PlatformStore };

export function getStore(): PlatformStore {
  if (globalForStore.__qlubStore) {
    return globalForStore.__qlubStore;
  }
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, "utf-8");
      const parsed = JSON.parse(raw) as PlatformStore;
      if (parsed && Array.isArray(parsed.restaurants) && Array.isArray(parsed.users)) {
        globalForStore.__qlubStore = parsed;
        return parsed;
      }
    }
  } catch {
    // Fallback to clean seed
  }
  const initial = createInitialStore();
  globalForStore.__qlubStore = initial;
  persistStore(initial);
  return initial;
}

export function persistStore(store: PlatformStore): void {
  globalForStore.__qlubStore = store;
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // In-memory store remains active if /tmp is unavailable
  }
}

export function getRestaurantBundle(slug: string): RestaurantBundle | null {
  const store = getStore();
  const restaurant = store.restaurants.find((r) => r.slug === slug);
  if (!restaurant) return null;
  return {
    restaurant,
    branches: store.branches.filter((b) => b.restaurantId === restaurant.id),
    categories: store.categories
      .filter((c) => c.restaurantId === restaurant.id)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    products: store.products
      .filter((p) => p.restaurantId === restaurant.id)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    domains: store.domains.filter((d) => d.restaurantId === restaurant.id),
    qrCodes: store.qrCodes.filter((q) => q.restaurantId === restaurant.id),
    members: store.members.filter((m) => m.restaurantId === restaurant.id),
    orders: store.orders
      .filter((o) => o.restaurantId === restaurant.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  };
}

export function getUserMemberships(userId: string): Array<RestaurantMember & { restaurantSlug: string; restaurantName: string }> {
  const store = getStore();
  return store.members
    .filter((m) => m.userId === userId)
    .map((m) => {
      const rest = store.restaurants.find((r) => r.id === m.restaurantId);
      return {
        ...m,
        restaurantSlug: rest?.slug ?? "",
        restaurantName: rest?.name ?? "Restaurant",
      };
    })
    .filter((m) => Boolean(m.restaurantSlug));
}

export function createRestaurantWithOwner(input: {
  name: string;
  nameAr?: string;
  slug?: string;
  description?: string;
  primaryColor?: string;
  secondaryColor?: string;
  currency?: string;
  defaultLocale?: "en" | "ar";
  plan?: PlanTier;
  status?: TenantStatus;
  ownerName: string;
  ownerEmail: string;
  ownerPassword?: string;
  branchName?: string;
  customDomain?: string;
}): {
  restaurant: Restaurant;
  ownerEmail: string;
  temporaryPassword: string | null;
  dashboardPath: string;
  publicMenuPath: string;
} {
  const store = getStore();
  const now = new Date().toISOString();

  const baseSlug = slugify(input.slug || input.name);
  let finalSlug = baseSlug;
  let counter = 2;
  while (store.restaurants.some((r) => r.slug === finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const restaurantId = `rest-${crypto.randomUUID().slice(0, 8)}`;
  const restaurant: Restaurant = {
    id: restaurantId,
    name: input.name.trim(),
    nameAr: input.nameAr?.trim() || input.name.trim(),
    slug: finalSlug,
    description:
      input.description?.trim() ||
      "Curated seasonal kitchen, crafted dishes, and table-ready hospitality.",
    descriptionAr: "مطبخ موسمي متجدد وأطباق مختارة بعناية.",
    logoText: input.name.trim().charAt(0).toUpperCase() || "Q",
    coverUrl: "/images/restaurant_hero_interior.jpg",
    primaryColor: input.primaryColor || "#c8a66a",
    secondaryColor: input.secondaryColor || "#111515",
    currency: input.currency || "SAR",
    defaultLocale: input.defaultLocale || "en",
    isPublished: input.status === "Active",
    plan: input.plan || "Starter",
    status: input.status || "Setup",
    createdAt: now,
    updatedAt: now,
  };
  store.restaurants.unshift(restaurant);

  // Branch provisioning
  const branchId = `br-${crypto.randomUUID().slice(0, 8)}`;
  store.branches.push({
    id: branchId,
    restaurantId,
    name: input.branchName?.trim() || "Main Branch",
    address: "Primary location",
    phone: "",
    isActive: true,
    createdAt: now,
  });

  // Starter categories
  const starterCategories: Array<{ name: string; nameAr: string; description: string }> = [
    { name: "Starters", nameAr: "المقبلات", description: "Opening plates & small bites." },
    { name: "Mains", nameAr: "الأطباق الرئيسية", description: "Signature kitchen courses." },
    { name: "Desserts", nameAr: "الحلويات", description: "Sweet finishes & coffee pairings." },
  ];
  const createdCategoryIds: string[] = [];
  starterCategories.forEach((cat, idx) => {
    const cid = `cat-${crypto.randomUUID().slice(0, 8)}`;
    createdCategoryIds.push(cid);
    store.categories.push({
      id: cid,
      restaurantId,
      name: cat.name,
      nameAr: cat.nameAr,
      description: cat.description,
      sortOrder: idx + 1,
      isActive: true,
      createdAt: now,
    });
  });

  // Starter sample dish so the new owner immediately sees a working menu preview
  store.products.push({
    id: `prod-${crypto.randomUUID().slice(0, 8)}`,
    restaurantId,
    categoryId: createdCategoryIds[1],
    name: "Signature chef dish",
    nameAr: "طبق الشيف المميز",
    description: "Customizable starter item — edit price, photo, and options in your menu editor.",
    descriptionAr: "طبق ترحيبي قابل للتعديل من محرر القائمة.",
    imageUrl: "/images/dish_truffle_pasta.jpg",
    price: 64,
    compareAtPrice: null,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 1,
    allergens: [],
    options: [],
    createdAt: now,
    updatedAt: now,
  });

  // Default QR code
  store.qrCodes.push({
    id: `qr-${crypto.randomUUID().slice(0, 8)}`,
    restaurantId,
    branchId,
    label: "Main Menu QR",
    targetPath: `/r/${finalSlug}?branch=${branchId}`,
    token: crypto.randomBytes(6).toString("hex"),
    isActive: true,
    createdAt: now,
  });

  // Optional custom domain
  if (input.customDomain?.trim()) {
    store.domains.push({
      id: `dom-${crypto.randomUUID().slice(0, 8)}`,
      restaurantId,
      hostname: input.customDomain.trim().toLowerCase(),
      isVerified: false,
      createdAt: now,
    });
  }

  // Provision or link owner user
  const normalizedEmail = input.ownerEmail.trim().toLowerCase();
  let user = store.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  let temporaryPassword: string | null = null;
  if (!user) {
    temporaryPassword = input.ownerPassword?.trim() || `Qlub-${crypto.randomBytes(3).toString("hex")}!`;
    user = {
      id: `usr-${crypto.randomUUID().slice(0, 8)}`,
      email: normalizedEmail,
      fullName: input.ownerName.trim() || "Restaurant Owner",
      passwordHash: hashPassword(temporaryPassword),
      createdAt: now,
    };
    store.users.push(user);
  }

  const alreadyMember = store.members.some(
    (m) => m.restaurantId === restaurantId && m.userId === user!.id
  );
  if (!alreadyMember) {
    store.members.push({
      restaurantId,
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: "admin",
      createdAt: now,
    });
  }

  persistStore(store);

  return {
    restaurant,
    ownerEmail: user.email,
    temporaryPassword,
    dashboardPath: `/dashboard/${finalSlug}`,
    publicMenuPath: `/r/${finalSlug}`,
  };
}

export function createValidatedOrder(input: {
  restaurantId: string;
  branchId?: string | null;
  customerName: string;
  customerPhone: string;
  tableLabel?: string;
  orderType: "dine_in" | "pickup";
  notes?: string;
  items: Array<{
    productId: string;
    quantity: number;
    selectedOptionValueIds?: string[];
  }>;
}): Order {
  const store = getStore();
  const restaurant = store.restaurants.find((r) => r.id === input.restaurantId);
  if (!restaurant) throw new Error("Restaurant not found.");
  if (!input.items.length) throw new Error("Cart cannot be empty.");

  const orderItems: OrderItem[] = [];
  let subtotal = 0;

  for (const item of input.items) {
    const product = store.products.find(
      (p) => p.id === item.productId && p.restaurantId === restaurant.id
    );
    if (!product || !product.isAvailable) {
      throw new Error("One or more items are unavailable.");
    }
    const qty = Math.max(1, Math.min(50, Math.floor(Number(item.quantity) || 1)));
    const selectedIds = new Set(item.selectedOptionValueIds ?? []);
    const optionsSnapshot: OrderItem["optionsSnapshot"] = [];
    let deltaSum = 0;

    for (const opt of product.options) {
      const picked = opt.values.filter((v) => selectedIds.has(v.id));
      if (opt.isRequired && picked.length < Math.max(1, opt.minSelect)) {
        // Auto-select first option if client omitted required option
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
      id: `oi-${crypto.randomUUID().slice(0, 8)}`,
      productId: product.id,
      productNameSnapshot: product.name,
      quantity: qty,
      unitPrice,
      optionsSnapshot,
    });
  }

  subtotal = Number(subtotal.toFixed(2));
  const order: Order = {
    id: `ord-${crypto.randomUUID().slice(0, 8)}`,
    restaurantId: restaurant.id,
    branchId: input.branchId || null,
    orderNumber: store.nextOrderNumber++,
    customerName: input.customerName.trim() || "Guest",
    customerPhone: input.customerPhone.trim(),
    tableLabel: input.tableLabel?.trim() || (input.orderType === "pickup" ? "Pickup" : "Table"),
    orderType: input.orderType,
    status: "pending",
    currency: restaurant.currency,
    subtotal,
    total: subtotal,
    notes: input.notes?.trim() || "",
    items: orderItems,
    createdAt: new Date().toISOString(),
  };

  store.orders.unshift(order);
  persistStore(store);
  return order;
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Order | null {
  const store = getStore();
  const order = store.orders.find((o) => o.id === orderId);
  if (!order) return null;
  order.status = status;
  persistStore(store);
  return order;
}

export function canUserAccessRestaurant(
  user: PublicUser | null,
  restaurantId: string,
  allowedRoles?: RestaurantRole[]
): boolean {
  if (!user) return false;
  if (user.platformRole === "owner" || user.platformRole === "support") return true;
  const store = getStore();
  const membership = store.members.find(
    (m) => m.restaurantId === restaurantId && m.userId === user.id
  );
  if (!membership) return false;
  if (!allowedRoles) return true;
  return allowedRoles.includes(membership.role);
}
