"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    function checkHash() {
      if (
        typeof window !== "undefined" &&
        window.location.hash.toLowerCase() === "#admin"
      ) {
        router.replace("/admin");
      }
    }

    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [router]);

  return null;
}
