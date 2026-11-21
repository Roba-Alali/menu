export type PlatformRole = "owner" | "support";
export type RestaurantRole = "admin" | "manager" | "editor" | "staff";
export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";
export type PlanTier = "Starter" | "Growth" | "Enterprise";
export type TenantStatus = "Active" | "Setup" | "Suspended";
export type LocaleCode = "en" | "ar";

export interface PublicUser {
  id: string;
  email: string;
  fullName: string;
  platformRole?: PlatformRole;
}

export interface Restaurant {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  logoText: string;
  logoUrl?: string;
  coverUrl: string;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  defaultLocale: LocaleCode;
  isPublished: boolean;
  plan: PlanTier;
  status: TenantStatus;
  ownerUid?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantMember {
  id?: string;
  restaurantId: string;
  userId: string;
  email: string;
  fullName: string;
  role: RestaurantRole;
  claimedFromId?: string;
  createdAt: string;
}

export interface Branch {
  id: string;
  restaurantId: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  isPublic?: boolean;
  ownerUid?: string;
  createdAt: string;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  nameAr: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  isPublic?: boolean;
  ownerUid?: string;
  createdAt: string;
}

export interface ProductOptionValue {
  id: string;
  name: string;
  priceDelta: number;
}

export interface ProductOption {
  id: string;
  name: string;
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  values: ProductOptionValue[];
}

export interface Product {
  id: string;
  restaurantId: string;
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
  isPublic?: boolean;
  ownerUid?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantDomain {
  id: string;
  restaurantId: string;
  hostname: string;
  isVerified: boolean;
  ownerUid?: string;
  createdAt: string;
}

export interface QrCodeRecord {
  id: string;
  restaurantId: string;
  branchId: string | null;
  label: string;
  targetPath: string;
  token: string;
  isActive: boolean;
  ownerUid?: string;
  createdAt: string;
}

export interface OrderOptionSnapshot {
  optionName: string;
  valueName: string;
  priceDelta: number;
}

export interface OrderItem {
  id: string;
  productId: string | null;
  productNameSnapshot: string;
  quantity: number;
  unitPrice: number;
  optionsSnapshot: OrderOptionSnapshot[];
}

export interface Order {
  id: string;
  restaurantId: string;
  branchId: string | null;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  tableLabel: string;
  orderType: "dine_in" | "pickup";
  status: OrderStatus;
  currency: string;
  subtotal: number;
  total: number;
  notes: string;
  items: OrderItem[];
  ownerUid?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  defaultCnameTarget: string;
  allowSelfServiceOrdering: boolean;
  defaultCurrency: string;
  updatedAt?: string;
}

export interface RestaurantBundle {
  restaurant: Restaurant;
  branches: Branch[];
  categories: MenuCategory[];
  products: Product[];
  domains: RestaurantDomain[];
  qrCodes: QrCodeRecord[];
  members: RestaurantMember[];
  orders: Order[];
}

export type SubscriptionRequestStatus = "pending" | "approved" | "rejected";

export interface SubscriptionRequest {
  id: string;
  restaurantName: string;
  restaurantNameAr: string;
  preferredSlug: string;
  ownerName: string;
  ownerEmail: string;
  phone: string;
  city: string;
  branchCount: number;
  plan: PlanTier;
  currency: string;
  primaryColor: string;
  logoUrl: string;
  notes: string;
  status: SubscriptionRequestStatus;
  provisionedSlug: string;
  createdAt: string;
  updatedAt: string;
}
