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

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  platformRole?: PlatformRole;
  createdAt: string;
}

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
  coverUrl: string;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  defaultLocale: LocaleCode;
  isPublished: boolean;
  plan: PlanTier;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantMember {
  restaurantId: string;
  userId: string;
  email: string;
  fullName: string;
  role: RestaurantRole;
  createdAt: string;
}

export interface Branch {
  id: string;
  restaurantId: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
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
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantDomain {
  id: string;
  restaurantId: string;
  hostname: string;
  isVerified: boolean;
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
  createdAt: string;
}

export interface PasswordResetRecord {
  token: string;
  email: string;
  expiresAt: string;
}

export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  defaultCnameTarget: string;
  allowSelfServiceOrdering: boolean;
  defaultCurrency: string;
}

export interface PlatformStore {
  users: UserAccount[];
  restaurants: Restaurant[];
  members: RestaurantMember[];
  branches: Branch[];
  categories: MenuCategory[];
  products: Product[];
  domains: RestaurantDomain[];
  qrCodes: QrCodeRecord[];
  orders: Order[];
  passwordResets: PasswordResetRecord[];
  nextOrderNumber: number;
  settings: PlatformSettings;
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
