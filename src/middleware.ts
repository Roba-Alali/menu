import { NextRequest, NextResponse } from "next/server";

const IGNORED_PREFIXES = [
  "/_next",
  "/api",
  "/images",
  "/r",
  "/dashboard",
  "/admin",
  "/login",
  "/demo",
  "/forgot-password",
  "/site",
];

const RESERVED_SUBDOMAINS = new Set(["www", "app", "admin", "menus", "api"]);

function extractHost(req: NextRequest): string {
  const raw =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  return raw.split(",")[0].trim().split(":")[0].toLowerCase();
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    IGNORED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    ) ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hostname = extractHost(req);
  if (!hostname) return NextResponse.next();

  // Direct platform hosts serve normal platform landing/app routes
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "qlub.app" ||
    hostname === "www.qlub.app" ||
    hostname === "menus.qlub.app" ||
    hostname.endsWith(".run.app") ||
    /^\d+\.\d+\.\d+\.\d+$/.test(hostname)
  ) {
    return NextResponse.next();
  }

  // Subdomain storefronts: <slug>.localhost or <slug>.qlub.app
  const parts = hostname.split(".");
  if (
    (parts.length === 2 && parts[1] === "localhost") ||
    (parts.length === 3 && parts[1] === "qlub" && parts[2] === "app")
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
