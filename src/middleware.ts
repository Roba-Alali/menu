import { NextRequest, NextResponse } from "next/server";

const IGNORED_PREFIXES = [
  "/_next",
  "/api",
  "/images",
  "/assets",
  "/favicon.ico",
  "/r",
  "/dashboard",
  "/admin",
  "/login",
  "/demo",
  "/forgot-password",
  "/site",
];

const RESERVED_SUBDOMAINS = new Set(["www", "app", "admin", "menus", "api"]);

function normalizeHost(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .split(":")[0];
}

function getConfiguredPlatformHosts(): Set<string> {
  const candidates = [
    process.env.PLATFORM_HOSTS || "",
    process.env.NEXT_PUBLIC_PLATFORM_HOST || "",
    process.env.VERCEL_URL || "",
    process.env.VERCEL_BRANCH_URL || "",
    process.env.VERCEL_PROJECT_PRODUCTION_URL || "",
  ];
  const hosts = new Set<string>([
    "localhost",
    "127.0.0.1",
    "::1",
    "viral.app",
    "www.viral.app",
    "menus.viral.app",
  ]);
  for (const entry of candidates) {
    for (const part of entry.split(",")) {
      const cleaned = normalizeHost(part);
      if (cleaned) hosts.add(cleaned);
    }
  }
  return hosts;
}

const PLATFORM_HOST_SUFFIXES = [
  ".run.app",
  ".vercel.app",
  ".web.app",
  ".firebaseapp.com",
  ".netlify.app",
  ".pages.dev",
  ".up.railway.app",
  ".onrender.com",
];

function isPlatformHost(hostname: string): boolean {
  const configured = getConfiguredPlatformHosts();
  if (configured.has(hostname)) return true;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return true;
  return PLATFORM_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
}

function extractHost(req: NextRequest): string {
  const raw =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  return normalizeHost(raw.split(",")[0] || "");
}

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (
    IGNORED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    ) ||
    pathname.includes(".") ||
    searchParams.get("platform") === "1"
  ) {
    return NextResponse.next();
  }

  const hostname = extractHost(req);
  if (!hostname) return NextResponse.next();

  // Direct platform hosts serve normal platform landing/app routes
  if (isPlatformHost(hostname)) {
    return NextResponse.next();
  }

  // Subdomain storefronts: <slug>.localhost or <slug>.viral.app
  const parts = hostname.split(".");
  if (
    (parts.length === 2 && parts[1] === "localhost") ||
    (parts.length === 3 && parts[1] === "viral" && parts[2] === "app")
  ) {
    const sub = parts[0];
    if (sub && !RESERVED_SUBDOMAINS.has(sub) && /^[a-z0-9-]+$/.test(sub)) {
      const target = req.nextUrl.clone();
      target.pathname = `/r/${sub}`;
      return NextResponse.rewrite(target);
    }
    return NextResponse.next();
  }

  // Verified Custom Domain storefronts (e.g., menu.yourbrand.com)
  if (/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(hostname)) {
    const target = req.nextUrl.clone();
    target.pathname = `/site/${encodeURIComponent(hostname)}`;
    return NextResponse.rewrite(target);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
