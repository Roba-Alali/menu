"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, onSnapshot } from "firebase/firestore";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Globe,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Palette,
  Plus,
  QrCode,
  ShoppingBag,
  Trash2,
  Upload,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import DishImage from "@/components/DishImage";
import { useAuth } from "@/components/AuthProvider";
import {
  isValidLogoUrl,
  processDishImageFile,
  processLogoFile,
} from "@/lib/logo-upload";
import { db } from "@/lib/firebase";
import {
  OperationType,
  handleFirestoreError,
  safeTimestampToIso,
} from "@/lib/firestore-errors";
import {
  addBranchInFirestore,
  addCategoryInFirestore,
  addDomainInFirestore,
  addRestaurantMemberInFirestore,
  createQrCodeInFirestore,
  deleteBranchInFirestore,
  deleteCategoryInFirestore,
  deleteDomainInFirestore,
  deleteProductInFirestore,
  deleteQrCodeInFirestore,
  removeRestaurantMemberInFirestore,
  saveProductInFirestore,
  saveRestaurantBrandInFirestore,
  toggleCategoryActiveInFirestore,
  toggleProductAvailabilityInFirestore,
  updateOrderStatusInFirestore,
  verifyDomainInFirestore,
} from "@/lib/firestore-service";
import type {
  Branch,
  LocaleCode,
  MenuCategory,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductOption,
  PublicUser,
  QrCodeRecord,
  Restaurant,
  RestaurantBundle,
  RestaurantDomain,
  RestaurantMember,
  RestaurantRole,
} from "@/lib/types";

type DashTab =
  | "overview"
  | "brand"
  | "menu"
  | "branches"
  | "orders"
  | "settings";

const GALLERY_PRESETS = [
  { label: "Truffle pasta", url: "/images/dish_truffle_pasta.jpg" },
  { label: "Grilled salmon", url: "/images/dish_grilled_salmon.jpg" },
  { label: "Burrata & tomato", url: "/images/dish_burrata_tomato.jpg" },
  { label: "Pistachio pastry", url: "/images/dish_pistachio_dessert.jpg" },
];

const ORDER_NEXT: Partial<Record<OrderStatus, { label: string; next: OrderStatus }>> = {
  pending: { label: "Accept order", next: "accepted" },
  accepted: { label: "Start preparing", next: "preparing" },
  preparing: { label: "Mark ready", next: "ready" },
  ready: { label: "Complete", next: "completed" },
};

export default function RestaurantDashboard({
  initialBundle,
  currentUser,
  cnameTarget,
  onRefresh,
}: {
  initialBundle: RestaurantBundle;
  currentUser: PublicUser;
  cnameTarget: string;
  onRefresh: () => Promise<void>;
}) {
  const router = useRouter();
  const { signOutUser } = useAuth();
  const [tab, setTab] = useState<DashTab>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [restaurant, setRestaurant] = useState<Restaurant>(initialBundle.restaurant);
  const [branches, setBranches] = useState<Branch[]>(initialBundle.branches);
  const [categories, setCategories] = useState<MenuCategory[]>(
    initialBundle.categories
  );
  const [products, setProducts] = useState<Product[]>(initialBundle.products);
  const [domains, setDomains] = useState<RestaurantDomain[]>(initialBundle.domains);
  const [qrCodes, setQrCodes] = useState<QrCodeRecord[]>(initialBundle.qrCodes);
  const [members, setMembers] = useState<RestaurantMember[]>(initialBundle.members);
  const [orders, setOrders] = useState<Order[]>(initialBundle.orders);

  const [copied, setCopied] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  // Brand editor state
  const [brandSaving, setBrandSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState("");
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [previewLocale, setPreviewLocale] = useState<LocaleCode>(
    initialBundle.restaurant.defaultLocale
  );

  // Category modal/form
  const [catForm, setCatForm] = useState({ name: "", nameAr: "", description: "" });
  const [catSaving, setCatSaving] = useState(false);

  // Product modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productSaving, setProductSaving] = useState(false);
  const [dishImageUploading, setDishImageUploading] = useState(false);
  const [dishImageError, setDishImageError] = useState("");
  const dishImageInputRef = useRef<HTMLInputElement | null>(null);
  const [productFilterCat, setProductFilterCat] = useState<string>("all");
  const [prodForm, setProdForm] = useState<{
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    categoryId: string;
    price: string;
    compareAtPrice: string;
    imageUrl: string;
    isAvailable: boolean;
    isFeatured: boolean;
    allergensText: string;
    options: ProductOption[];
  }>({
    name: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    categoryId: initialBundle.categories[0]?.id || "",
    price: "55",
    compareAtPrice: "",
    imageUrl: "/images/dish_truffle_pasta.jpg",
    isAvailable: true,
    isFeatured: false,
    allergensText: "",
    options: [],
  });

  // Branch & QR forms
  const [branchForm, setBranchForm] = useState({ name: "", address: "", phone: "" });
  const [qrForm, setQrForm] = useState({
    label: "",
    branchId: initialBundle.branches[0]?.id || "",
    tableNumber: "",
  });

  // Order filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<"all" | OrderStatus>("all");

  // Domain & member forms
  const [domainInput, setDomainInput] = useState("");
  const [domainError, setDomainError] = useState("");
  const [memberForm, setMemberForm] = useState({
    fullName: "",
    email: "",
    role: "manager" as RestaurantRole,
  });
  const [memberInviteResult, setMemberInviteResult] = useState("");

  const isPlatformAdmin =
    currentUser.platformRole === "owner" || currentUser.platformRole === "support";

  const origin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }

  function copyValue(key: string, val: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(val);
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  }

  async function refreshBundle() {
    await onRefresh();
  }

  useEffect(() => {
    setRestaurant(initialBundle.restaurant);
    setBranches(initialBundle.branches || []);
    setCategories(initialBundle.categories || []);
    setProducts(initialBundle.products || []);
    setDomains(initialBundle.domains || []);
    setQrCodes(initialBundle.qrCodes || []);
    setMembers(initialBundle.members || []);
    setOrders(initialBundle.orders || []);
  }, [initialBundle]);

  // Real-time orders stream for live kitchen updates
  useEffect(() => {
    const ordersPath = `restaurants/${initialBundle.restaurant.slug}/orders`;
    const unsub = onSnapshot(
      collection(db, "restaurants", initialBundle.restaurant.slug, "orders"),
      (snap) => {
        const liveOrders: Order[] = snap.docs
          .map((d) => {
            const data = d.data() as Record<string, unknown>;
            return {
              id: String(data.id || d.id),
              restaurantId: String(data.restaurantId || ""),
              branchId: data.branchId ? String(data.branchId) : null,
              orderNumber: Number(data.orderNumber ?? 1001),
              customerName: String(data.customerName || "Guest"),
              customerPhone: String(data.customerPhone || ""),
              tableLabel: String(data.tableLabel || "Table 01"),
              orderType: (data.orderType === "pickup" ? "pickup" : "dine_in") as
                | "dine_in"
                | "pickup",
              status: (data.status || "pending") as OrderStatus,
              currency: String(data.currency || "SAR"),
              subtotal: Number(data.subtotal ?? 0),
              total: Number(data.total ?? 0),
              notes: String(data.notes || ""),
              items: Array.isArray(data.items)
                ? (data.items as OrderItem[])
                : [],
              ownerUid: String(data.ownerUid || ""),
              createdAt: safeTimestampToIso(data.createdAt),
              updatedAt: safeTimestampToIso(data.updatedAt),
            };
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        setOrders(liveOrders);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, ordersPath);
      }
    );
    return () => unsub();
  }, [initialBundle.restaurant.slug]);

  async function handleLogoFileSelected(file: File | undefined) {
    if (!file) return;
    setLogoError("");
    setLogoUploading(true);
    try {
      const processed = await processLogoFile(file);
      setRestaurant((prev) => ({ ...prev, logoUrl: processed.dataUrl }));
      await saveRestaurantBrandInFirestore(
        restaurant.slug,
        { logoUrl: processed.dataUrl },
        initialBundle.restaurant.isPublished
      );
      await refreshBundle();
      showToast("Client logo uploaded and saved to menu.");
    } catch (err) {
      setLogoError(
        err instanceof Error ? err.message : "Could not upload this logo."
      );
    } finally {
      setLogoUploading(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
    }
  }

  async function handleRemoveLogo() {
    setLogoError("");
    setLogoUploading(true);
    try {
      setRestaurant((prev) => ({ ...prev, logoUrl: "" }));
      await saveRestaurantBrandInFirestore(
        restaurant.slug,
        { logoUrl: "" },
        initialBundle.restaurant.isPublished
      );
      await refreshBundle();
      showToast("Logo removed. Showing monogram badge.");
    } catch (err) {
      setLogoError(
        err instanceof Error ? err.message : "Could not remove logo."
      );
    } finally {
      setLogoUploading(false);
    }
  }

  async function handleSaveBrand(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const trimmedLogoUrl = (restaurant.logoUrl || "").trim();
    if (!isValidLogoUrl(trimmedLogoUrl)) {
      setLogoError(
        "Logo URL must start with https://, http://, /, or be an uploaded image."
      );
      return;
    }
    setLogoError("");
    setBrandSaving(true);
    try {
      await saveRestaurantBrandInFirestore(
        restaurant.slug,
        {
          name: restaurant.name,
          nameAr: restaurant.nameAr,
          description: restaurant.description,
          descriptionAr: restaurant.descriptionAr,
          logoText: restaurant.logoText,
          logoUrl: trimmedLogoUrl,
          coverUrl: restaurant.coverUrl,
          primaryColor: restaurant.primaryColor,
          secondaryColor: restaurant.secondaryColor,
          currency: restaurant.currency,
          defaultLocale: restaurant.defaultLocale,
          isPublished: restaurant.isPublished,
        },
        initialBundle.restaurant.isPublished
      );
      await refreshBundle();
      showToast("Brand & storefront settings saved to Firestore.");
    } finally {
      setBrandSaving(false);
    }
  }

  async function togglePublished() {
    const nextPub = !restaurant.isPublished;
    await saveRestaurantBrandInFirestore(
      restaurant.slug,
      { isPublished: nextPub },
      restaurant.isPublished
    );
    await refreshBundle();
    showToast(nextPub ? "Menu is now published live." : "Menu moved to draft.");
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    setCatSaving(true);
    try {
      await addCategoryInFirestore(restaurant.slug, restaurant, {
        ...catForm,
        sortOrder: categories.length + 1,
      });
      setCatForm({ name: "", nameAr: "", description: "" });
      await refreshBundle();
      showToast("Category added.");
    } finally {
      setCatSaving(false);
    }
  }

  async function handleToggleCategory(cat: MenuCategory) {
    await toggleCategoryActiveInFirestore(
      restaurant.slug,
      cat.id,
      !cat.isActive
    );
    await refreshBundle();
  }

  async function handleDeleteCategory(id: string) {
    await deleteCategoryInFirestore(restaurant.slug, id);
    await refreshBundle();
  }

  function openNewProductModal() {
    setEditingProductId(null);
    setProdForm({
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      categoryId: categories[0]?.id || "",
      price: "45",
      compareAtPrice: "",
      imageUrl: "/images/dish_truffle_pasta.jpg",
      isAvailable: true,
      isFeatured: false,
      allergensText: "",
      options: [],
    });
    setProductModalOpen(true);
  }

  function openEditProductModal(p: Product) {
    setEditingProductId(p.id);
    setProdForm({
      name: p.name,
      nameAr: p.nameAr,
      description: p.description,
      descriptionAr: p.descriptionAr,
      categoryId: p.categoryId || "",
      price: String(p.price),
      compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : "",
      imageUrl: p.imageUrl,
      isAvailable: p.isAvailable,
      isFeatured: p.isFeatured,
      allergensText: p.allergens.join(", "),
      options: p.options.map((o) => ({
        ...o,
        values: o.values.map((v) => ({ ...v })),
      })),
    });
    setProductModalOpen(true);
  }

  function addOptionGroupToForm() {
    setProdForm((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          id: `opt-${Date.now()}`,
          name: "Extras",
          isRequired: false,
          minSelect: 0,
          maxSelect: 2,
          values: [{ id: `val-${Date.now()}`, name: "Add-on", priceDelta: 10 }],
        },
      ],
    }));
  }

  async function handleDishImageSelected(file: File | undefined) {
    if (!file) return;
    setDishImageError("");
    setDishImageUploading(true);
    try {
      const processed = await processDishImageFile(file);
      setProdForm((prev) => ({ ...prev, imageUrl: processed.dataUrl }));
    } catch (err) {
      setDishImageError(
        err instanceof Error ? err.message : "Could not process dish photo."
      );
    } finally {
      setDishImageUploading(false);
      if (dishImageInputRef.current) {
        dishImageInputRef.current.value = "";
      }
    }
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidLogoUrl(prodForm.imageUrl)) {
      setDishImageError(
        "Dish image must start with https://, http://, /, or be an uploaded photo."
      );
      return;
    }
    setDishImageError("");
    setProductSaving(true);
    try {
      await saveProductInFirestore(restaurant.slug, restaurant, {
        id: editingProductId || undefined,
        categoryId: prodForm.categoryId || null,
        name: prodForm.name,
        nameAr: prodForm.nameAr,
        description: prodForm.description,
        descriptionAr: prodForm.descriptionAr,
        imageUrl: prodForm.imageUrl,
        price: Number(prodForm.price) || 0,
        compareAtPrice: prodForm.compareAtPrice
          ? Number(prodForm.compareAtPrice)
          : null,
        isAvailable: prodForm.isAvailable,
        isFeatured: prodForm.isFeatured,
        sortOrder: editingProductId
          ? products.find((p) => p.id === editingProductId)?.sortOrder || 1
          : products.length + 1,
        allergens: prodForm.allergensText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        options: prodForm.options,
      });
      setProductModalOpen(false);
      await refreshBundle();
      showToast(editingProductId ? "Dish updated." : "Dish added to menu.");
    } finally {
      setProductSaving(false);
    }
  }

  async function handleToggleAvailability(p: Product) {
    await toggleProductAvailabilityInFirestore(
      restaurant.slug,
      p.id,
      !p.isAvailable
    );
    await refreshBundle();
  }

  async function handleDeleteProduct(id: string) {
    await deleteProductInFirestore(restaurant.slug, id);
    await refreshBundle();
  }

  async function handleAddBranch(e: React.FormEvent) {
    e.preventDefault();
    if (!branchForm.name.trim()) return;
    await addBranchInFirestore(restaurant.slug, restaurant, branchForm);
    setBranchForm({ name: "", address: "", phone: "" });
    await refreshBundle();
    showToast("Branch added.");
  }

  async function handleDeleteBranch(id: string) {
    await deleteBranchInFirestore(restaurant.slug, id);
    await refreshBundle();
  }

  async function handleCreateQr(e: React.FormEvent) {
    e.preventDefault();
    if (!qrForm.label.trim()) return;
    await createQrCodeInFirestore(restaurant.slug, restaurant, {
      label: qrForm.label,
      branchId: qrForm.branchId || null,
      tableNumber: qrForm.tableNumber,
    });
    setQrForm({ label: "", branchId: branches[0]?.id || "", tableNumber: "" });
    await refreshBundle();
    showToast("QR code generated.");
  }

  async function handleDeleteQr(id: string) {
    await deleteQrCodeInFirestore(restaurant.slug, id);
    await refreshBundle();
  }

  async function handleUpdateOrderStatus(orderId: string, status: OrderStatus) {
    await updateOrderStatusInFirestore(restaurant.slug, orderId, status);
    showToast(`Order marked ${status}.`);
  }

  async function handleAddDomain(e: React.FormEvent) {
    e.preventDefault();
    if (!domainInput.trim()) return;
    setDomainError("");
    try {
      await addDomainInFirestore(restaurant.slug, restaurant, domainInput);
      setDomainInput("");
      await refreshBundle();
      showToast("Custom domain added.");
    } catch (err) {
      setDomainError(
        err instanceof Error ? err.message : "Could not add custom domain."
      );
    }
  }

  async function handleVerifyDomain(id: string) {
    await verifyDomainInFirestore(restaurant.slug, id);
    await refreshBundle();
    showToast("Domain verified.");
  }

  async function handleDeleteDomain(id: string) {
    await deleteDomainInFirestore(restaurant.slug, id);
    await refreshBundle();
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    const member = await addRestaurantMemberInFirestore(
      restaurant.slug,
      restaurant,
      memberForm
    );
    setMemberInviteResult(
      `Invited ${member.email} (${member.role}) — access unlocks automatically when they sign in with Google.`
    );
    setMemberForm({ fullName: "", email: "", role: "manager" });
    await refreshBundle();
  }

  async function handleRemoveMember(memberDocId: string) {
    await removeRestaurantMemberInFirestore(restaurant.slug, memberDocId);
    await refreshBundle();
  }

  async function handleLogout() {
    await signOutUser();
    router.push("/login");
  }

  const filteredProducts = useMemo(() => {
    if (productFilterCat === "all") return products;
    return products.filter((p) => p.categoryId === productFilterCat);
  }, [products, productFilterCat]);

  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === "all") return orders;
    return orders.filter((o) => o.status === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  const totalOrderRevenue = useMemo(
    () =>
      orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + o.total, 0),
    [orders]
  );

  const navItems: Array<{ id: DashTab; label: string; icon: typeof LayoutDashboard }> = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "brand", label: "Brand & theme", icon: Palette },
    { id: "menu", label: "Menu & catalog", icon: UtensilsCrossed },
    { id: "branches", label: "Branches & QR", icon: QrCode },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "settings", label: "Domains & team", icon: Users },
  ];

  return (
    <main className="min-h-screen bg-[#090b0b]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-[#252d2b] bg-[#0d1010] p-6 md:flex">
        <div>
          <div className="flex items-center gap-3">
            <BrandLogo
              logoUrl={restaurant.logoUrl}
              logoText={restaurant.logoText}
              alt={restaurant.name}
              accentColor={restaurant.primaryColor}
              size="md"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{restaurant.name}</p>
              <p className="font-mono-num muted truncate text-[11px]">
                /{restaurant.slug}
              </p>
            </div>
          </div>

          <nav className="mt-9 space-y-1.5">
            {navItems.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                    active
                      ? "bg-[#242b28] font-medium text-[#f5f5f1]"
                      : "text-[#aab4af] hover:bg-[#171d1b] hover:text-[#f5f5f1]"
                  }`}
                >
                  <Icon
                    size={17}
                    style={active ? { color: restaurant.primaryColor } : undefined}
                  />
                  <span className="whitespace-nowrap">{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 border-t border-[#252d2b] pt-5">
          {isPlatformAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 text-xs font-medium text-[#c8a66a] hover:underline"
            >
              <ArrowLeft size={13} /> Back to Super Admin
            </Link>
          )}
          <div>
            <p className="truncate text-xs font-medium text-[#f5f5f1]">
              {currentUser.fullName}
            </p>
            <p className="muted truncate text-[11px]">{currentUser.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg border border-[#252d2b] px-3 py-2 text-xs text-[#aab4af] hover:border-[#c8a66a] hover:text-[#f5f5f1]"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 md:hidden"
            onClick={() => setMobileNavOpen(false)}
          >
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-64 flex-col justify-between border-r border-[#252d2b] bg-[#0d1010] p-6"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{restaurant.name}</span>
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen(false)}
                    aria-label="Close menu"
                  >
                    <X size={18} />
                  </button>
                </div>
                <nav className="mt-8 space-y-1.5">
                  {navItems.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setTab(id);
                        setMobileNavOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${
                        tab === id
                          ? "bg-[#242b28] font-medium text-white"
                          : "text-[#aab4af]"
                      }`}
                    >
                      <Icon size={17} />
                      <span>{label}</span>
                    </button>
                  ))}
                </nav>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs text-[#aab4af]"
              >
                <LogOut size={14} /> Sign out
              </button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="md:ml-64">
        <header className="flex h-20 items-center justify-between gap-4 border-b border-[#252d2b] px-6 md:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="rounded-lg border border-[#252d2b] p-2 md:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div>
              <p className="text-sm font-medium">{restaurant.name} workspace</p>
              <p className="muted text-xs">
                {restaurant.plan} plan · {restaurant.currency} ·{" "}
                {restaurant.isPublished ? "Published live" : "Draft mode"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void togglePublished()}
              className={`whitespace-nowrap shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                restaurant.isPublished
                  ? "border-[#2e4c3d] bg-[#13221b] text-[#86efac]"
                  : "border-[#c8a66a] text-[#e5c991]"
              }`}
            >
              {restaurant.isPublished ? "Live · Click to unpublish" : "Publish menu"}
            </button>
            <Link
              href={`/r/${restaurant.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-full bg-[#c8a66a] px-5 py-2 text-xs font-semibold text-[#10110e]"
            >
              View public menu <ExternalLink size={13} />
            </Link>
          </div>
        </header>

        {toast && (
          <div className="border-b border-[#2e4c3d] bg-[#13221b] px-6 py-2.5 text-xs text-[#cde6d7] md:px-10">
            {toast}
          </div>
        )}

        <div className="p-6 md:p-10">
          {/* OVERVIEW TAB */}
          {tab === "overview" && (
            <div>
              <p className="gold text-xs font-medium tracking-[0.2em]">
                RESTAURANT OVERVIEW
              </p>
              <h1 className="font-display mt-2 text-4xl font-semibold">
                {restaurant.name}
              </h1>
              <p className="muted mt-1.5 max-w-2xl text-sm">
                {restaurant.description}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="panel p-5">
                  <span className="muted text-xs">Menu products</span>
                  <p className="tabular-nums mt-3 text-3xl font-semibold">
                    {products.length}
                  </p>
                  <p className="muted mt-1 text-xs">
                    Across {categories.filter((c) => c.isActive).length} active categories
                  </p>
                </div>
                <div className="panel p-5">
                  <span className="muted text-xs">Branches & QR</span>
                  <p className="tabular-nums mt-3 text-3xl font-semibold">
                    {branches.length}
                  </p>
                  <p className="muted mt-1 text-xs">
                    {qrCodes.length} scannable QR entry points
                  </p>
                </div>
                <div className="panel p-5">
                  <span className="muted text-xs">Total orders</span>
                  <p className="tabular-nums mt-3 text-3xl font-semibold">
                    {orders.length}
                  </p>
                  <p className="muted mt-1 text-xs">
                    {orders.filter((o) => o.status === "pending").length} pending review
                  </p>
                </div>
                <div className="panel p-5">
                  <span className="muted text-xs">Order revenue</span>
                  <p className="tabular-nums mt-3 text-3xl font-semibold">
                    {totalOrderRevenue.toLocaleString()} {restaurant.currency}
                  </p>
                  <p className="muted mt-1 text-xs">Excludes cancelled orders</p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="panel p-6">
                  <h2 className="font-medium">Launch checklist</h2>
                  <p className="muted mt-1 text-xs">
                    Complete these steps to launch your digital menu to guests.
                  </p>

                  <div className="mt-5 space-y-3">
                    {[
                      {
                        done: Boolean(restaurant.primaryColor && restaurant.description),
                        title: "Customize visual identity & colors",
                        action: () => setTab("brand"),
                        cta: "Open brand editor",
                      },
                      {
                        done: products.length > 0 && categories.length > 0,
                        title: "Add menu categories & dishes",
                        action: () => setTab("menu"),
                        cta: "Manage menu",
                      },
                      {
                        done: qrCodes.length > 0,
                        title: "Generate table or branch QR codes",
                        action: () => setTab("branches"),
                        cta: "View QR codes",
                      },
                      {
                        done: restaurant.isPublished,
                        title: "Publish storefront live to customers",
                        action: () => void togglePublished(),
                        cta: restaurant.isPublished ? "Published" : "Publish now",
                      },
                    ].map((step) => (
                      <div
                        key={step.title}
                        className="flex items-center justify-between gap-4 rounded-xl border border-[#252d2b] bg-[#0d1010] px-4 py-3.5"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2
                            size={17}
                            className={
                              step.done ? "text-[#86efac]" : "text-[#4e5854]"
                            }
                          />
                          <span className="text-sm">{step.title}</span>
                        </div>
                        <button
                          type="button"
                          onClick={step.action}
                          className="whitespace-nowrap shrink-0 text-xs font-medium text-[#c8a66a] hover:underline"
                        >
                          {step.cta}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="panel flex flex-col justify-between p-6">
                  <div>
                    <h2 className="font-medium">Shareable storefront link</h2>
                    <p className="muted mt-1 text-xs">
                      Guests can scan a QR code or open this URL directly on any
                      device.
                    </p>
                    <div className="mt-4 space-y-2.5">
                      <div className="flex items-center justify-between gap-2 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3.5 py-3">
                        <span className="font-mono-num truncate text-xs text-[#f5f5f1]">
                          {origin}/r/{restaurant.slug}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyValue("pub", `${origin}/r/${restaurant.slug}`)
                          }
                          className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 text-xs font-medium text-[#c8a66a]"
                        >
                          {copied === "pub" ? <Check size={13} /> : <Copy size={13} />}
                          Copy
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-2 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3.5 py-2.5">
                        <span className="font-mono-num truncate text-xs text-[#aab4af]">
                          https://{restaurant.slug}.qlub.app
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyValue("sub", `https://${restaurant.slug}.qlub.app`)
                          }
                          className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 text-xs font-medium text-[#c8a66a]"
                        >
                          {copied === "sub" ? <Check size={13} /> : <Copy size={13} />}
                          Subdomain
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setTab("brand")}
                      className="rounded-full bg-[#c8a66a] px-5 py-2.5 text-xs font-semibold text-[#10110e]"
                    >
                      Edit brand & colors
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab("menu")}
                      className="rounded-full border border-[#39413e] px-5 py-2.5 text-xs font-medium"
                    >
                      Add dishes
                    </button>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* BRAND & VISUAL EDITOR TAB */}
          {tab === "brand" && (
            <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <form onSubmit={handleSaveBrand} className="panel space-y-5 p-6">
                <div>
                  <p className="gold text-xs font-medium tracking-[0.2em]">
                    VISUAL IDENTITY EDITOR
                  </p>
                  <h2 className="font-display mt-2 text-3xl font-semibold">
                    Brand & localization
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                      Restaurant name (EN)
                    </label>
                    <input
                      type="text"
                      value={restaurant.name}
                      onChange={(e) =>
                        setRestaurant({ ...restaurant, name: e.target.value })
                      }
                      className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                      Restaurant name (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={restaurant.nameAr}
                      onChange={(e) =>
                        setRestaurant({ ...restaurant, nameAr: e.target.value })
                      }
                      className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                    Tagline / story (EN)
                  </label>
                  <textarea
                    rows={2}
                    value={restaurant.description}
                    onChange={(e) =>
                      setRestaurant({ ...restaurant, description: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#252d2b] bg-[#0d1010] p-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                    Tagline / story (AR)
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={restaurant.descriptionAr}
                    onChange={(e) =>
                      setRestaurant({
                        ...restaurant,
                        descriptionAr: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#252d2b] bg-[#0d1010] p-3 text-sm"
                  />
                </div>

                {/* Client Logo Uploader */}
                <div className="rounded-2xl border border-[#252d2b] bg-[#0d1010] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <BrandLogo
                        logoUrl={restaurant.logoUrl}
                        logoText={restaurant.logoText}
                        alt={restaurant.name}
                        accentColor={restaurant.primaryColor}
                        size="lg"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#f5f5f1]">
                          Client menu logo
                        </p>
                        <p className="muted mt-0.5 text-[11px]">
                          Shown in your public menu header, storefront hero, and QR views. PNG, JPG, WebP, or SVG.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                        className="hidden"
                        onChange={(e) =>
                          void handleLogoFileSelected(e.target.files?.[0])
                        }
                      />
                      <button
                        type="button"
                        disabled={logoUploading}
                        onClick={() => logoInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#c8a66a] bg-[#1a1812] px-4 py-2 text-xs font-semibold text-[#e5c991] transition-colors hover:bg-[#c8a66a] hover:text-[#10110e] disabled:opacity-50"
                      >
                        {logoUploading ? (
                          <>
                            <ImagePlus size={13} />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={13} />
                            {restaurant.logoUrl ? "Replace logo" : "Upload logo"}
                          </>
                        )}
                      </button>
                      {restaurant.logoUrl && (
                        <button
                          type="button"
                          disabled={logoUploading}
                          onClick={() => void handleRemoveLogo()}
                          className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-[#252d2b] px-3.5 py-2 text-xs text-[#aab4af] hover:border-red-400/50 hover:text-red-300"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 border-t border-[#252d2b]/70 pt-3">
                    <label className="mb-1 block text-[11px] font-medium text-[#9aa6a1]">
                      Or paste an external logo URL (https://...)
                    </label>
                    <input
                      type="text"
                      value={
                        restaurant.logoUrl?.startsWith("data:")
                          ? ""
                          : restaurant.logoUrl || ""
                      }
                      onChange={(e) => {
                        setLogoError("");
                        setRestaurant({ ...restaurant, logoUrl: e.target.value });
                      }}
                      placeholder={
                        restaurant.logoUrl?.startsWith("data:")
                          ? "Uploaded logo image active (click Replace logo or Remove above)"
                          : "https://cdn.example.com/client-logo.png"
                      }
                      className="font-mono-num h-9 w-full rounded-xl border border-[#252d2b] bg-[#111515] px-3 text-xs text-[#f5f5f1]"
                    />
                  </div>

                  {logoError && (
                    <p className="mt-2 text-xs text-red-300" role="alert">
                      {logoError}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                      Fallback monogram (1-2 chars)
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      value={restaurant.logoText}
                      onChange={(e) =>
                        setRestaurant({ ...restaurant, logoText: e.target.value })
                      }
                      className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-center text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                      Accent color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={restaurant.primaryColor}
                        onChange={(e) =>
                          setRestaurant({
                            ...restaurant,
                            primaryColor: e.target.value,
                          })
                        }
                        className="h-10 w-12 cursor-pointer rounded-xl border border-[#252d2b] bg-[#0d1010] p-1"
                      />
                      <input
                        type="text"
                        value={restaurant.primaryColor}
                        onChange={(e) =>
                          setRestaurant({
                            ...restaurant,
                            primaryColor: e.target.value,
                          })
                        }
                        className="font-mono-num h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-2.5 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                      Surface background
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={restaurant.secondaryColor}
                        onChange={(e) =>
                          setRestaurant({
                            ...restaurant,
                            secondaryColor: e.target.value,
                          })
                        }
                        className="h-10 w-12 cursor-pointer rounded-xl border border-[#252d2b] bg-[#0d1010] p-1"
                      />
                      <input
                        type="text"
                        value={restaurant.secondaryColor}
                        onChange={(e) =>
                          setRestaurant({
                            ...restaurant,
                            secondaryColor: e.target.value,
                          })
                        }
                        className="font-mono-num h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-2.5 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                      Currency
                    </label>
                    <select
                      value={restaurant.currency}
                      onChange={(e) =>
                        setRestaurant({ ...restaurant, currency: e.target.value })
                      }
                      className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-sm"
                    >
                      <option value="SAR">SAR</option>
                      <option value="AED">AED</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#aab4af]">
                      Default menu language
                    </label>
                    <select
                      value={restaurant.defaultLocale}
                      onChange={(e) => {
                        const loc = e.target.value as LocaleCode;
                        setRestaurant({ ...restaurant, defaultLocale: loc });
                        setPreviewLocale(loc);
                      }}
                      className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-sm"
                    >
                      <option value="en">English (LTR)</option>
                      <option value="ar">Arabic (RTL)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#252d2b] pt-4">
                  <label className="flex cursor-pointer items-center gap-2.5 text-xs">
                    <input
                      type="checkbox"
                      checked={restaurant.isPublished}
                      onChange={(e) =>
                        setRestaurant({
                          ...restaurant,
                          isPublished: e.target.checked,
                        })
                      }
                      className="h-4 w-4 accent-[#c8a66a]"
                    />
                    <span>Published and visible to public guests</span>
                  </label>
                  <button
                    type="submit"
                    disabled={brandSaving}
                    className="rounded-full bg-[#c8a66a] px-6 py-2.5 text-xs font-semibold text-[#10110e]"
                  >
                    {brandSaving ? "Saving..." : "Save brand changes"}
                  </button>
                </div>
              </form>

              {/* LIVE SIDE-BY-SIDE PREVIEW */}
              <div className="panel p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-medium tracking-[0.16em] text-[#aab4af]">
                    LIVE STOREFRONT PREVIEW
                  </span>
                  <div className="flex items-center gap-1 rounded-lg bg-[#0d1010] p-1">
                    {(["en", "ar"] as const).map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setPreviewLocale(loc)}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                          previewLocale === loc
                            ? "bg-[#242b28] text-white"
                            : "text-[#9aa6a1]"
                        }`}
                      >
                        {loc.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  dir={previewLocale === "ar" ? "rtl" : "ltr"}
                  className="mx-auto max-w-sm overflow-hidden rounded-[26px] border border-[#2d3532] p-5 transition-colors"
                  style={{ backgroundColor: restaurant.secondaryColor }}
                >
                  <div className="text-center">
                    <BrandLogo
                      logoUrl={restaurant.logoUrl}
                      logoText={restaurant.logoText}
                      alt={restaurant.name}
                      accentColor={restaurant.primaryColor}
                      size="preview"
                      className="mx-auto"
                    />
                    <p
                      className="mt-3 text-[10px] font-medium tracking-[0.25em]"
                      style={{ color: restaurant.primaryColor }}
                    >
                      {(previewLocale === "ar"
                        ? restaurant.nameAr || restaurant.name
                        : restaurant.name
                      ).toUpperCase()}
                    </p>
                    <h3 className="font-display mt-2 text-2xl font-semibold text-[#f5f5f1]">
                      {previewLocale === "ar"
                        ? "مائدة تستحق المشاركة."
                        : "A table worth sharing."}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-[#9aa6a1]">
                      {previewLocale === "ar"
                        ? restaurant.descriptionAr || restaurant.description
                        : restaurant.description}
                    </p>
                  </div>

                  <div className="mt-5 space-y-2.5">
                    {products.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0c100f] p-2.5"
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                          <DishImage
                            src={item.imageUrl}
                            alt={item.name}
                            accentColor={restaurant.primaryColor}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-[#f5f5f1]">
                            {previewLocale === "ar"
                              ? item.nameAr || item.name
                              : item.name}
                          </p>
                          <p
                            className="tabular-nums mt-1 text-xs font-medium"
                            style={{ color: restaurant.primaryColor }}
                          >
                            {item.price} {restaurant.currency}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MENU & CATALOG TAB */}
          {tab === "menu" && (
            <div className="space-y-8">
              {/* Categories Panel */}
              <section className="panel p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="gold text-xs font-medium tracking-[0.2em]">
                      MENU STRUCTURE
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">Categories</h2>
                  </div>
                </div>

                <form
                  onSubmit={handleAddCategory}
                  className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_1.2fr_auto]"
                >
                  <input
                    type="text"
                    required
                    placeholder="Category name (EN)"
                    value={catForm.name}
                    onChange={(e) =>
                      setCatForm({ ...catForm, name: e.target.value })
                    }
                    className="h-10 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="الاسم بالعربية"
                    value={catForm.nameAr}
                    onChange={(e) =>
                      setCatForm({ ...catForm, nameAr: e.target.value })
                    }
                    className="h-10 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Short description"
                    value={catForm.description}
                    onChange={(e) =>
                      setCatForm({ ...catForm, description: e.target.value })
                    }
                    className="h-10 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                  />
                  <button
                    type="submit"
                    disabled={catSaving}
                    className="h-10 whitespace-nowrap rounded-full bg-[#c8a66a] px-5 text-xs font-semibold text-[#10110e]"
                  >
                    + Add category
                  </button>
                </form>

                <div className="mt-5 divide-y divide-[#252d2b]">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
                    >
                      <div>
                        <span className="font-medium">{cat.name}</span>
                        {cat.nameAr && (
                          <span className="muted ml-2 text-xs">
                            · {cat.nameAr}
                          </span>
                        )}
                        {cat.description && (
                          <p className="muted mt-0.5 text-xs">{cat.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <button
                          type="button"
                          onClick={() => void handleToggleCategory(cat)}
                          className={
                            cat.isActive ? "text-[#86efac]" : "text-[#e5c991]"
                          }
                        >
                          {cat.isActive ? "Active" : "Hidden"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteCategory(cat.id)}
                          aria-label={`Delete ${cat.name}`}
                          className="text-[#9aa6a1] hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Products Panel */}
              <section className="panel p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Dishes & products</h2>
                    <p className="muted mt-1 text-xs">
                      Manage pricing, imagery, availability, and custom modifier
                      groups.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={productFilterCat}
                      onChange={(e) => setProductFilterCat(e.target.value)}
                      className="h-10 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                    >
                      <option value="all">All categories</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={openNewProductModal}
                      className="inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#c8a66a] px-5 text-xs font-semibold text-[#10110e]"
                    >
                      <Plus size={14} /> Add dish
                    </button>
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="mt-6 rounded-xl border border-[#252d2b] bg-[#0d1010] p-8 text-center">
                    <p className="text-sm font-medium">No dishes in this view.</p>
                    <button
                      type="button"
                      onClick={openNewProductModal}
                      className="mt-3 rounded-full bg-[#c8a66a] px-5 py-2 text-xs font-semibold text-[#10110e]"
                    >
                      Add your first dish
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {filteredProducts.map((p) => {
                      const cat = categories.find((c) => c.id === p.categoryId);
                      return (
                        <div
                          key={p.id}
                          className="flex gap-4 rounded-xl border border-[#252d2b] bg-[#0d1010] p-3.5"
                        >
                          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                            <DishImage
                              src={p.imageUrl}
                              alt={p.name}
                              accentColor={restaurant.primaryColor}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <p className="truncate text-sm font-medium">
                                  {p.name}
                                </p>
                                <span className="tabular-nums shrink-0 text-xs font-semibold text-[#c8a66a]">
                                  {p.price} {restaurant.currency}
                                </span>
                              </div>
                              <p className="muted mt-0.5 text-[11px]">
                                {cat?.name || "Uncategorized"} ·{" "}
                                {p.options.length} option group(s)
                              </p>
                              <p className="muted mt-1 line-clamp-1 text-xs">
                                {p.description}
                              </p>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-xs">
                              <button
                                type="button"
                                onClick={() => void handleToggleAvailability(p)}
                                className={
                                  p.isAvailable
                                    ? "text-[#86efac]"
                                    : "text-[#e5c991]"
                                }
                              >
                                {p.isAvailable ? "Available" : "Sold out"}
                              </button>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => openEditProductModal(p)}
                                  className="text-[#c8a66a] hover:underline"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void handleDeleteProduct(p.id)}
                                  aria-label={`Delete ${p.name}`}
                                  className="text-[#9aa6a1] hover:text-red-400"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* BRANCHES & QR TAB */}
          {tab === "branches" && (
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <section className="panel p-6">
                <p className="gold text-xs font-medium tracking-[0.2em]">
                  LOCATIONS
                </p>
                <h2 className="mt-1 text-xl font-semibold">Branches</h2>

                <form onSubmit={handleAddBranch} className="mt-5 space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Branch name (e.g. Riyadh · Diplomatic Quarter)"
                    value={branchForm.name}
                    onChange={(e) =>
                      setBranchForm({ ...branchForm, name: e.target.value })
                    }
                    className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Address"
                      value={branchForm.address}
                      onChange={(e) =>
                        setBranchForm({ ...branchForm, address: e.target.value })
                      }
                      className="h-10 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      value={branchForm.phone}
                      onChange={(e) =>
                        setBranchForm({ ...branchForm, phone: e.target.value })
                      }
                      className="h-10 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-10 rounded-full bg-[#c8a66a] px-5 text-xs font-semibold text-[#10110e]"
                  >
                    + Add branch
                  </button>
                </form>

                <div className="mt-6 space-y-3">
                  {branches.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-[#252d2b] bg-[#0d1010] p-4"
                    >
                      <div className="flex items-start gap-2.5">
                        <MapPin size={15} className="gold mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{b.name}</p>
                          <p className="muted mt-0.5 text-xs">
                            {b.address || "No address listed"}
                          </p>
                          {b.phone && (
                            <p className="font-mono-num muted mt-0.5 text-xs">
                              {b.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleDeleteBranch(b.id)}
                        aria-label={`Delete ${b.name}`}
                        className="text-[#9aa6a1] hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel p-6">
                <p className="gold text-xs font-medium tracking-[0.2em]">
                  DYNAMIC TABLE QR
                </p>
                <h2 className="mt-1 text-xl font-semibold">QR codes</h2>

                <form
                  onSubmit={handleCreateQr}
                  className="mt-5 grid gap-3 sm:grid-cols-3"
                >
                  <input
                    type="text"
                    required
                    placeholder="Label (e.g. Table 08)"
                    value={qrForm.label}
                    onChange={(e) =>
                      setQrForm({ ...qrForm, label: e.target.value })
                    }
                    className="h-10 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                  />
                  <select
                    value={qrForm.branchId}
                    onChange={(e) =>
                      setQrForm({ ...qrForm, branchId: e.target.value })
                    }
                    className="h-10 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                  >
                    <option value="">All branches</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Table # (optional)"
                    value={qrForm.tableNumber}
                    onChange={(e) =>
                      setQrForm({ ...qrForm, tableNumber: e.target.value })
                    }
                    className="h-10 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                  />
                  <button
                    type="submit"
                    className="h-10 rounded-full bg-[#c8a66a] px-5 text-xs font-semibold text-[#10110e] sm:col-span-3 sm:w-fit"
                  >
                    + Generate scannable QR
                  </button>
                </form>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {qrCodes.map((qr) => {
                    const targetUrl = `${origin}${qr.targetPath}`;
                    const qrSvgEndpoint = `/api/qr?data=${encodeURIComponent(
                      targetUrl
                    )}`;
                    return (
                      <div
                        key={qr.id}
                        className="flex flex-col justify-between rounded-xl border border-[#252d2b] bg-[#0d1010] p-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">{qr.label}</p>
                            <p className="font-mono-num muted mt-0.5 text-[11px]">
                              {qr.targetPath}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => void handleDeleteQr(qr.id)}
                            aria-label={`Delete ${qr.label}`}
                            className="text-[#9aa6a1] hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="my-4 flex justify-center rounded-xl bg-[#f5f5f1] p-3">
                          <img
                            src={qrSvgEndpoint}
                            alt={`QR code for ${qr.label}`}
                            referrerPolicy="no-referrer"
                            className="h-32 w-32"
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <button
                            type="button"
                            onClick={() => copyValue(qr.id, targetUrl)}
                            className="inline-flex items-center gap-1 text-[#c8a66a]"
                          >
                            {copied === qr.id ? (
                              <Check size={13} />
                            ) : (
                              <Copy size={13} />
                            )}
                            Copy URL
                          </button>
                          <a
                            href={qrSvgEndpoint}
                            download={`${restaurant.slug}-${qr.token}.svg`}
                            className="inline-flex items-center gap-1 text-[#aab4af] hover:text-white"
                          >
                            <Download size={13} /> SVG
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {/* ORDERS TAB */}
          {tab === "orders" && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="gold text-xs font-medium tracking-[0.2em]">
                    LIVE KITCHEN & PICKUP
                  </p>
                  <h2 className="font-display mt-2 text-3xl font-semibold">
                    Orders queue
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[#252d2b] bg-[#111515] p-1">
                  {(
                    [
                      "all",
                      "pending",
                      "accepted",
                      "preparing",
                      "ready",
                      "completed",
                    ] as const
                  ).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderStatusFilter(st)}
                      className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium capitalize ${
                        orderStatusFilter === st
                          ? "bg-[#242b28] text-white"
                          : "text-[#9aa6a1]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="panel mt-6 p-10 text-center">
                  <p className="text-sm font-medium">No orders in this status.</p>
                  <p className="muted mt-1 text-xs">
                    Orders submitted from your public menu appear here
                    immediately.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {filteredOrders.map((ord) => {
                    const nextStep = ORDER_NEXT[ord.status];
                    return (
                      <div key={ord.id} className="panel p-5">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#252d2b] pb-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono-num text-sm font-semibold text-[#c8a66a]">
                                #{ord.orderNumber}
                              </span>
                              <span className="text-sm font-medium">
                                {ord.customerName}
                              </span>
                              <span className="muted text-xs">
                                · {ord.tableLabel} ·{" "}
                                {ord.orderType === "dine_in"
                                  ? "Dine-in"
                                  : "Pickup"}
                              </span>
                            </div>
                            {ord.customerPhone && (
                              <p className="font-mono-num muted mt-1 text-xs">
                                {ord.customerPhone}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="tabular-nums text-base font-semibold">
                              {ord.total} {ord.currency}
                            </span>
                            <span className="rounded-lg border border-[#252d2b] bg-[#0d1010] px-3 py-1 text-xs capitalize text-[#e5c991]">
                              {ord.status}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                          <ul className="space-y-1.5 text-xs">
                            {ord.items.map((item) => (
                              <li key={item.id}>
                                <span className="font-medium text-[#f5f5f1]">
                                  {item.quantity}× {item.productNameSnapshot}
                                </span>
                                {item.optionsSnapshot.length > 0 && (
                                  <span className="muted ml-2">
                                    (
                                    {item.optionsSnapshot
                                      .map((o) => o.valueName)
                                      .join(", ")}
                                    )
                                  </span>
                                )}
                              </li>
                            ))}
                            {ord.notes && (
                              <li className="muted pt-1">Note: {ord.notes}</li>
                            )}
                          </ul>

                          <div className="flex items-center gap-2">
                            {nextStep && (
                              <button
                                type="button"
                                onClick={() =>
                                  void handleUpdateOrderStatus(
                                    ord.id,
                                    nextStep.next
                                  )
                                }
                                className="rounded-full bg-[#c8a66a] px-4 py-2 text-xs font-semibold text-[#10110e]"
                              >
                                {nextStep.label}
                              </button>
                            )}
                            {ord.status !== "cancelled" &&
                              ord.status !== "completed" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    void handleUpdateOrderStatus(
                                      ord.id,
                                      "cancelled"
                                    )
                                  }
                                  className="rounded-full border border-[#39413e] px-4 py-2 text-xs text-[#aab4af] hover:text-red-300"
                                >
                                  Cancel
                                </button>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* DOMAINS & TEAM TAB */}
          {tab === "settings" && (
            <div className="grid gap-8 lg:grid-cols-2">
              <section className="panel p-6">
                <p className="gold text-xs font-medium tracking-[0.2em]">
                  WHITE-LABEL HOSTNAME
                </p>
                <h2 className="mt-1 text-xl font-semibold">Custom domains</h2>
                <p className="muted mt-1 text-xs leading-5">
                  Point a CNAME record from your domain to{" "}
                  <span className="font-mono-num text-[#f5f5f1]">
                    {cnameTarget}
                  </span>{" "}
                  and verify routing below.
                </p>

                <div className="mt-4 rounded-xl border border-[#252d2b] bg-[#0d1010] p-3.5 text-xs">
                  <span className="muted">Built-in white-label subdomain</span>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <span className="font-mono-num text-[#f5f5f1]">
                      {restaurant.slug}.qlub.app
                    </span>
                    <Link
                      href={`/r/${restaurant.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[#c8a66a] hover:underline"
                    >
                      Open storefront <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>

                <form onSubmit={handleAddDomain} className="mt-5 flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="menu.yourbrand.com"
                    value={domainInput}
                    onChange={(e) => {
                      setDomainError("");
                      setDomainInput(e.target.value);
                    }}
                    className="font-mono-num h-10 flex-1 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                  />
                  <button
                    type="submit"
                    className="h-10 whitespace-nowrap rounded-full bg-[#c8a66a] px-5 text-xs font-semibold text-[#10110e]"
                  >
                    Add domain
                  </button>
                </form>

                {domainError && (
                  <p className="mt-2 text-xs text-red-300" role="alert">
                    {domainError}
                  </p>
                )}

                <div className="mt-5 divide-y divide-[#252d2b]">
                  {domains.map((d) => (
                    <div
                      key={d.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="gold" />
                        <span className="font-mono-num">{d.hostname}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/site/${encodeURIComponent(d.hostname)}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[#aab4af] hover:text-[#f5f5f1]"
                        >
                          Preview <ExternalLink size={11} />
                        </Link>
                        {d.isVerified ? (
                          <span className="text-[#86efac]">Verified</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void handleVerifyDomain(d.id)}
                            className="text-[#c8a66a] hover:underline"
                          >
                            Verify DNS
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => void handleDeleteDomain(d.id)}
                          aria-label={`Remove ${d.hostname}`}
                          className="text-[#9aa6a1] hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel p-6">
                <p className="gold text-xs font-medium tracking-[0.2em]">
                  STAFF ACCESS
                </p>
                <h2 className="mt-1 text-xl font-semibold">Team & roles</h2>

                <form onSubmit={handleAddMember} className="mt-5 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      required
                      placeholder="Staff name"
                      value={memberForm.fullName}
                      onChange={(e) =>
                        setMemberForm({ ...memberForm, fullName: e.target.value })
                      }
                      className="h-10 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                    />
                    <input
                      type="email"
                      required
                      placeholder="staff@restaurant.com"
                      value={memberForm.email}
                      onChange={(e) =>
                        setMemberForm({ ...memberForm, email: e.target.value })
                      }
                      className="h-10 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={memberForm.role}
                      onChange={(e) =>
                        setMemberForm({
                          ...memberForm,
                          role: e.target.value as RestaurantRole,
                        })
                      }
                      className="h-10 rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="editor">Editor</option>
                      <option value="staff">Staff</option>
                    </select>
                    <button
                      type="submit"
                      className="h-10 rounded-full bg-[#c8a66a] px-5 text-xs font-semibold text-[#10110e]"
                    >
                      Invite staff
                    </button>
                  </div>
                  {memberInviteResult && (
                    <p className="font-mono-num text-xs text-[#86efac]">
                      {memberInviteResult}
                    </p>
                  )}
                </form>

                <div className="mt-5 divide-y divide-[#252d2b]">
                  {members.map((m) => (
                    <div
                      key={m.id || m.userId}
                      className="flex items-center justify-between gap-3 py-3 text-xs"
                    >
                      <div>
                        <p className="font-medium text-[#f5f5f1]">
                          {m.fullName}
                        </p>
                        <p className="muted">{m.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="capitalize text-[#c8a66a]">
                          {m.role}
                        </span>
                        <button
                          type="button"
                          onClick={() => void handleRemoveMember(m.id || m.userId)}
                          aria-label={`Remove ${m.fullName}`}
                          className="text-[#9aa6a1] hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* PRODUCT CREATE / EDIT MODAL */}
      <AnimatePresence>
        {productModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="panel max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between border-b border-[#252d2b] pb-4">
                <h2 className="font-display text-2xl font-semibold">
                  {editingProductId ? "Edit dish" : "Add menu dish"}
                </h2>
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-[#aab4af]">
                      Dish name (EN) *
                    </label>
                    <input
                      type="text"
                      required
                      value={prodForm.name}
                      onChange={(e) =>
                        setProdForm({ ...prodForm, name: e.target.value })
                      }
                      className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[#aab4af]">
                      Dish name (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={prodForm.nameAr}
                      onChange={(e) =>
                        setProdForm({ ...prodForm, nameAr: e.target.value })
                      }
                      className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs text-[#aab4af]">
                      Category
                    </label>
                    <select
                      value={prodForm.categoryId}
                      onChange={(e) =>
                        setProdForm({ ...prodForm, categoryId: e.target.value })
                      }
                      className="h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                    >
                      <option value="">Uncategorized</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[#aab4af]">
                      Price ({restaurant.currency}) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      required
                      value={prodForm.price}
                      onChange={(e) =>
                        setProdForm({ ...prodForm, price: e.target.value })
                      }
                      className="tabular-nums h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[#aab4af]">
                      Compare-at price
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={prodForm.compareAtPrice}
                      onChange={(e) =>
                        setProdForm({
                          ...prodForm,
                          compareAtPrice: e.target.value,
                        })
                      }
                      className="tabular-nums h-10 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-[#aab4af]">
                      Description (EN)
                    </label>
                    <textarea
                      rows={2}
                      value={prodForm.description}
                      onChange={(e) =>
                        setProdForm({ ...prodForm, description: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#252d2b] bg-[#0d1010] p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[#aab4af]">
                      Description (AR)
                    </label>
                    <textarea
                      rows={2}
                      dir="rtl"
                      value={prodForm.descriptionAr}
                      onChange={(e) =>
                        setProdForm({
                          ...prodForm,
                          descriptionAr: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-[#252d2b] bg-[#0d1010] p-2.5 text-xs"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-[#252d2b] bg-[#0d1010] p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#252d2b]">
                        <DishImage
                          src={prodForm.imageUrl}
                          alt={prodForm.name || "Dish photo"}
                          accentColor={restaurant.primaryColor}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#f5f5f1]">
                          Dish photo
                        </label>
                        <p className="muted text-[11px]">
                          Upload from device, pick a preset, or paste an image URL.
                        </p>
                      </div>
                    </div>
                    <div>
                      <input
                        ref={dishImageInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) =>
                          void handleDishImageSelected(e.target.files?.[0])
                        }
                      />
                      <button
                        type="button"
                        disabled={dishImageUploading}
                        onClick={() => dishImageInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#c8a66a] bg-[#1a1812] px-4 py-1.5 text-xs font-semibold text-[#e5c991] transition-colors hover:bg-[#c8a66a] hover:text-[#10110e] disabled:opacity-50"
                      >
                        <Upload size={12} />
                        {dishImageUploading ? "Processing..." : "Upload photo"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {GALLERY_PRESETS.map((g) => (
                      <button
                        key={g.url}
                        type="button"
                        onClick={() => {
                          setDishImageError("");
                          setProdForm({ ...prodForm, imageUrl: g.url });
                        }}
                        className={`rounded-lg border px-2.5 py-1 text-[11px] ${
                          prodForm.imageUrl === g.url
                            ? "border-[#c8a66a] text-[#c8a66a]"
                            : "border-[#252d2b] text-[#9aa6a1]"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={
                      prodForm.imageUrl.startsWith("data:")
                        ? ""
                        : prodForm.imageUrl
                    }
                    onChange={(e) => {
                      setDishImageError("");
                      setProdForm({ ...prodForm, imageUrl: e.target.value });
                    }}
                    placeholder={
                      prodForm.imageUrl.startsWith("data:")
                        ? "Uploaded dish photo active (upload a new file or pick a preset above to replace)"
                        : "https://... or /images/..."
                    }
                    className="font-mono-num mt-2 h-9 w-full rounded-xl border border-[#252d2b] bg-[#111515] px-3 text-xs"
                  />
                  {dishImageError && (
                    <p className="mt-1.5 text-xs text-red-300" role="alert">
                      {dishImageError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs text-[#aab4af]">
                    Allergens (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Dairy, Gluten, Tree Nuts"
                    value={prodForm.allergensText}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, allergensText: e.target.value })
                    }
                    className="h-9 w-full rounded-xl border border-[#252d2b] bg-[#0d1010] px-3 text-xs"
                  />
                </div>

                <div className="border-t border-[#252d2b] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#aab4af]">
                      Modifiers & option groups
                    </span>
                    <button
                      type="button"
                      onClick={addOptionGroupToForm}
                      className="text-xs font-medium text-[#c8a66a]"
                    >
                      + Add option group
                    </button>
                  </div>
                  {prodForm.options.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {prodForm.options.map((opt, idx) => (
                        <div
                          key={opt.id}
                          className="rounded-xl border border-[#252d2b] bg-[#0d1010] p-3 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={opt.name}
                              onChange={(e) => {
                                const next = [...prodForm.options];
                                next[idx].name = e.target.value;
                                setProdForm({ ...prodForm, options: next });
                              }}
                              className="h-8 rounded-lg border border-[#252d2b] bg-[#111515] px-2.5 text-xs font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setProdForm({
                                  ...prodForm,
                                  options: prodForm.options.filter(
                                    (_, i) => i !== idx
                                  ),
                                });
                              }}
                              className="text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="mt-2 space-y-2">
                            {opt.values.map((val, vIdx) => (
                              <div
                                key={val.id}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="text"
                                  value={val.name}
                                  onChange={(e) => {
                                    const next = [...prodForm.options];
                                    next[idx].values[vIdx].name = e.target.value;
                                    setProdForm({ ...prodForm, options: next });
                                  }}
                                  placeholder="Choice label"
                                  className="h-8 flex-1 rounded-lg border border-[#252d2b] bg-[#111515] px-2.5 text-xs"
                                />
                                <input
                                  type="number"
                                  step="0.5"
                                  value={val.priceDelta}
                                  onChange={(e) => {
                                    const next = [...prodForm.options];
                                    next[idx].values[vIdx].priceDelta =
                                      Number(e.target.value) || 0;
                                    setProdForm({ ...prodForm, options: next });
                                  }}
                                  placeholder="+Price"
                                  className="tabular-nums h-8 w-24 rounded-lg border border-[#252d2b] bg-[#111515] px-2.5 text-xs"
                                />
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...prodForm.options];
                                next[idx].values.push({
                                  id: `val-${Date.now()}`,
                                  name: "Option",
                                  priceDelta: 0,
                                });
                                setProdForm({ ...prodForm, options: next });
                              }}
                              className="text-[11px] text-[#c8a66a]"
                            >
                              + Add choice
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#252d2b] pt-4">
                  <div className="flex items-center gap-5 text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={prodForm.isAvailable}
                        onChange={(e) =>
                          setProdForm({
                            ...prodForm,
                            isAvailable: e.target.checked,
                          })
                        }
                        className="accent-[#c8a66a]"
                      />
                      <span>Available</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={prodForm.isFeatured}
                        onChange={(e) =>
                          setProdForm({
                            ...prodForm,
                            isFeatured: e.target.checked,
                          })
                        }
                        className="accent-[#c8a66a]"
                      />
                      <span>Featured dish</span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setProductModalOpen(false)}
                      className="rounded-full border border-[#39413e] px-5 py-2 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={productSaving}
                      className="rounded-full bg-[#c8a66a] px-6 py-2 text-xs font-semibold text-[#10110e]"
                    >
                      {productSaving ? "Saving..." : "Save dish"}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
